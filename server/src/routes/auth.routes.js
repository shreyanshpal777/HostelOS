import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendActivationOtp } from '../services/notifications/email.service.js';

export const authRouter = Router();
const cookieName = 'hostelos_session';
const oauthCookieName = 'hostelos_oauth_state';
const emailSchema = z.string().email().transform((value) => value.trim().toLowerCase());
const registerSchema = z.object({ name: z.string().trim().min(2), email: emailSchema, password: z.string().min(8).max(128) });
const loginSchema = z.object({ email: emailSchema, password: z.string().min(1) });

function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1))];
  }));
}
function publicUser(user) {
  return { id: String(user._id), name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl, authProviders: user.authProviders, onboardingComplete: Boolean(user.phone && user.roomNumber && user.floor !== undefined) };
}
function sessionToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role, type: 'session' }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}
function setSession(res, user) {
  const token = sessionToken(user);
  const payload = jwt.decode(token);
  const maxAge = Math.max(0, payload.exp * 1000 - Date.now());
  res.cookie(cookieName, token, { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax', maxAge, path: '/' });
}
function clearSession(res) {
  res.clearCookie(cookieName, { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
}
function providerConfig(provider) {
  const configs = {
    google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET, callbackUrl: env.GOOGLE_CALLBACK_URL },
    github: { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET, callbackUrl: env.GITHUB_CALLBACK_URL }
  };
  const config = configs[provider];
  if (!config.clientId || !config.clientSecret) throw Object.assign(new Error(`${provider} authentication is not configured`), { statusCode: 503 });
  return config;
}
function oauthState(provider) {
  return jwt.sign({ provider, type: 'oauth_state' }, env.JWT_SECRET, { expiresIn: '10m' });
}
function setOAuthState(res, state) {
  res.cookie(oauthCookieName, state, { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 10 * 60 * 1000, path: '/api/auth' });
}
function verifyState(req, state, provider) {
  if (!state || parseCookies(req)[oauthCookieName] !== state) throw new Error('Invalid OAuth state');
  const payload = jwt.verify(state, env.JWT_SECRET);
  if (payload.type !== 'oauth_state' || payload.provider !== provider) throw new Error('Invalid OAuth state');
}
async function findOrCreateOAuthUser({ provider, providerId, email, name, avatarUrl }) {
  if (!email) throw Object.assign(new Error(`${provider} did not provide a verified email address`), { statusCode: 400 });
  let user = await User.findOne({ [`providerIds.${provider}`]: providerId });
  if (!user) user = await User.findOne({ email });
  if (!user) user = new User({ name: name || email.split('@')[0], email });
  user.providerIds = { ...(user.providerIds?.toObject?.() || user.providerIds || {}), [provider]: providerId };
  user.authProviders = [...new Set([...(user.authProviders || []), provider])];
  if (!user.avatarUrl && avatarUrl) user.avatarUrl = avatarUrl;
  user.isActivated = true; // OAuth is auto-activated
  user.lastLoginAt = new Date();
  await user.save();
  return user;
}
function callbackSuccess(res, user) {
  setSession(res, user);
  res.redirect(`${env.CLIENT_URL}/login?oauth=success`);
}
function callbackFailure(res, error) {
  const message = encodeURIComponent(error.message || 'Authentication failed');
  res.redirect(`${env.CLIENT_URL}/login?oauth=error&message=${message}`);
}

export function requireAuth(req, res, next) {
  try {
    const token = parseCookies(req)[cookieName];
    if (!token) throw new Error('Missing session');
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (payload.type !== 'session') throw new Error('Invalid session');
    req.auth = { userId: payload.sub, role: payload.role };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Authentication required' });
  }
}

authRouter.post('/register', asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  if (await User.exists({ email: input.email })) throw Object.assign(new Error('An account with this email already exists'), { statusCode: 409 });
  const user = new User({ name: input.name, email: input.email, authProviders: ['local'], isActivated: true });
  await user.setPassword(input.password);
  await user.save();
  setSession(res, user);
  res.status(201).json({ success: true, data: publicUser(user) });
}));
authRouter.post('/login', asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const user = await User.findOne({ email: input.email }).select('+passwordHash');
  if (!user) throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  if (!user.isActivated) throw Object.assign(new Error('Account not activated. Please use first-time resident setup.'), { statusCode: 403 });
  if (!(await user.comparePassword(input.password))) throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  if (!user.isActive) throw Object.assign(new Error('This account is inactive'), { statusCode: 403 });
  user.lastLoginAt = new Date();
  if (!user.authProviders.includes('local')) user.authProviders.push('local');
  await user.save();
  setSession(res, user);
  res.json({ success: true, data: publicUser(user) });
}));
authRouter.post('/logout', (req, res) => {
  clearSession(res);
  res.json({ success: true });
});
authRouter.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.auth.userId);
  if (!user || !user.isActive) throw Object.assign(new Error('Account unavailable'), { statusCode: 401 });
  res.json({ success: true, data: publicUser(user) });
}));

authRouter.get('/google', (req, res, next) => {
  try {
    const config = providerConfig('google');
    const state = oauthState('google');
    setOAuthState(res, state);
    const params = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.callbackUrl, response_type: 'code', scope: 'openid email profile', state, prompt: 'select_account' });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  } catch (error) { next(error); }
});
authRouter.get('/google/callback', async (req, res) => {
  try {
    verifyState(req, req.query.state, 'google');
    const config = providerConfig('google');
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code: req.query.code, client_id: config.clientId, client_secret: config.clientSecret, redirect_uri: config.callbackUrl, grant_type: 'authorization_code' }) });
    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(tokens.error_description || 'Google token exchange failed');
    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { authorization: `Bearer ${tokens.access_token}` } });
    const profile = await profileResponse.json();
    if (!profileResponse.ok || !profile.email_verified) throw new Error('Google email could not be verified');
    callbackSuccess(res, await findOrCreateOAuthUser({ provider: 'google', providerId: profile.sub, email: profile.email.toLowerCase(), name: profile.name, avatarUrl: profile.picture }));
  } catch (error) { callbackFailure(res, error); }
});

authRouter.get('/github', (req, res, next) => {
  try {
    const config = providerConfig('github');
    const state = oauthState('github');
    setOAuthState(res, state);
    const params = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.callbackUrl, scope: 'read:user user:email', state });
    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  } catch (error) { next(error); }
});
authRouter.get('/github/callback', async (req, res) => {
  try {
    verifyState(req, req.query.state, 'github');
    const config = providerConfig('github');
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ client_id: config.clientId, client_secret: config.clientSecret, code: req.query.code, redirect_uri: config.callbackUrl }) });
    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok || !tokens.access_token) throw new Error(tokens.error_description || 'GitHub token exchange failed');
    const headers = { accept: 'application/vnd.github+json', authorization: `Bearer ${tokens.access_token}`, 'user-agent': 'HostelOS' };
    const [profileResponse, emailsResponse] = await Promise.all([fetch('https://api.github.com/user', { headers }), fetch('https://api.github.com/user/emails', { headers })]);
    const profile = await profileResponse.json();
    const emails = await emailsResponse.json();
    const email = Array.isArray(emails) ? emails.find((item) => item.primary && item.verified)?.email || emails.find((item) => item.verified)?.email : null;
    if (!profileResponse.ok) throw new Error('GitHub profile request failed');
    callbackSuccess(res, await findOrCreateOAuthUser({ provider: 'github', providerId: String(profile.id), email: email?.toLowerCase(), name: profile.name || profile.login, avatarUrl: profile.avatar_url }));
  } catch (error) { callbackFailure(res, error); }
});

authRouter.post('/activate/request-otp', asyncHandler(async (req, res) => {
  const { email } = z.object({ email: emailSchema }).parse(req.body);
  const user = await User.findOne({ email });
  if (!user) {
    throw Object.assign(new Error('No pre-loaded account found with this email. Please contact the Admin.'), { statusCode: 404 });
  }
  if (!user.isActive) {
    throw Object.assign(new Error('This account has been deactivated. Please contact the Admin.'), { statusCode: 403 });
  }
  if (user.isActivated) {
    return res.status(400).json({ success: false, message: 'Account is already activated. Please log in directly.' });
  }

  // Generate 6-digit random code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.activationOtp = otpCode;
  user.activationOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  await user.save();

  console.log(`[Activation OTP for ${email}]: ${otpCode}`);

  // Send real email with OTP code using nodemailer
  try {
    await sendActivationOtp(email, otpCode, user.name);
  } catch (emailError) {
    console.error(`Failed to send email to ${email}:`, emailError.message);
    // Continue execution so the flashed fallback still works for testing
  }

  res.json({
    success: true,
    message: 'OTP sent to your email and flashed to device (for testing).',
    otp: otpCode // Flashed/returned directly to device as requested
  });
}));

authRouter.post('/activate/verify-otp', asyncHandler(async (req, res) => {
  const { email, otp } = z.object({ email: emailSchema, otp: z.string().length(6) }).parse(req.body);
  const user = await User.findOne({ email });
  if (!user) {
    throw Object.assign(new Error('No pre-loaded account found with this email.'), { statusCode: 404 });
  }
  
  if (user.activationOtp !== otp || !user.activationOtpExpiresAt || user.activationOtpExpiresAt < new Date()) {
    throw Object.assign(new Error('Invalid or expired OTP. Please request a new code.'), { statusCode: 400 });
  }

  res.json({
    success: true,
    message: 'OTP verified successfully. Please set your password now.'
  });
}));

authRouter.post('/activate/set-password', asyncHandler(async (req, res) => {
  const { email, otp, password } = z.object({
    email: emailSchema,
    otp: z.string().length(6),
    password: z.string().min(8)
  }).parse(req.body);
  
  const user = await User.findOne({ email });
  if (!user) {
    throw Object.assign(new Error('No pre-loaded account found with this email.'), { statusCode: 404 });
  }

  if (user.activationOtp !== otp || !user.activationOtpExpiresAt || user.activationOtpExpiresAt < new Date()) {
    throw Object.assign(new Error('Invalid or expired OTP. Verification failed.'), { statusCode: 400 });
  }

  await user.setPassword(password);
  user.isActivated = true;
  user.activationOtp = undefined;
  user.activationOtpExpiresAt = undefined;
  user.lastLoginAt = new Date();
  if (!user.authProviders.includes('local')) user.authProviders.push('local');
  await user.save();

  setSession(res, user);
  res.json({
    success: true,
    message: 'Account activated successfully. Logged in.',
    data: publicUser(user)
  });
}));