import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, Github, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import GoogleIcon from '@/components/GoogleIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';
import { apiRequest } from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(() => new URLSearchParams(window.location.search).get('message') || '');
  const { login, startOAuth, isAuthenticated, checkUserAuth } = useAuth();
  const navigate = useNavigate();

  // Activation states
  const [isActivating, setIsActivating] = useState(false);
  const [activationEmail, setActivationEmail] = useState('');
  const [activationStep, setActivationStep] = useState(1); // 1 = Request, 2 = Verify OTP & Set Password
  const [otpCode, setOtpCode] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [flashedOtp, setFlashedOtp] = useState('');
  const [activationSuccess, setActivationSuccess] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/console', { replace: true });
  }, [isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/console', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestOtp(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    setFlashedOtp('');
    try {
      const response = await apiRequest('/auth/activate/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email: activationEmail })
      });
      setFlashedOtp(response.otp);
      setActivationStep(2);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await apiRequest('/auth/activate/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: activationEmail, otp: otpCode })
      });
      setIsOtpVerified(true);
      setActivationSuccess(response.message || 'OTP verified! Please set your new password.');
      setTimeout(() => setActivationSuccess(''), 3000);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetPassword(event) {
    event.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await apiRequest('/auth/activate/set-password', {
        method: 'POST',
        body: JSON.stringify({
          email: activationEmail,
          otp: otpCode,
          password: newPassword
        })
      });
      setActivationSuccess(response.message || 'Account activated successfully!');
      setTimeout(async () => {
        await checkUserAuth();
        navigate('/console', { replace: true });
      }, 1500);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <aside className="hidden lg:flex lg:w-1/2 gradient-bg items-center justify-center p-12 text-white">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-8"><Building2 className="w-10 h-10" /><span className="text-2xl font-heading font-bold">HostelOS</span></div>
          <h1 className="text-4xl font-heading font-bold mb-4 leading-tight">Welcome back to smarter student hostel management.</h1>
          <p className="text-lg text-white/75">Access residents, tasks, resources, and hostel operations from one place.</p>
        </div>
      </aside>
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 text-gray-900 dark:text-white"><Building2 /><span className="text-xl font-bold">HostelOS</span></div>
          
          {isActivating ? (
            // Activation Form
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Activate Account</h2>
              <p className="mt-2 mb-7 text-gray-500 dark:text-gray-400">Set up a secure password for your pre-loaded student profile.</p>

              {error && <div role="alert" className="mb-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</div>}
              {activationSuccess && <div className="mb-5 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">{activationSuccess}</div>}

              {activationStep === 1 ? (
                // Step 1: Request OTP
                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Your Registered Email
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        required
                        value={activationEmail}
                        onChange={(e) => setActivationEmail(e.target.value)}
                        className="pl-10 h-12 bg-white dark:bg-gray-900"
                        placeholder="you@university.edu"
                      />
                    </div>
                  </label>
                  <Button type="submit" disabled={loading} className="w-full h-12 gradient-bg text-white border-0">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {loading ? 'Sending Code...' : 'Request Verification Code'}
                  </Button>
                </form>
              ) : (
                // Step 2: Verify OTP and Set Password
                <div className="space-y-5">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Verifying activation for: <strong>{activationEmail}</strong>
                  </div>

                  {flashedOtp && (
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-md text-sm text-indigo-700 dark:text-indigo-300 mb-4">
                      <strong>Code Flashed:</strong> For testing, your 6-digit activation code is: <code className="font-bold underline">{flashedOtp}</code>
                    </div>
                  )}

                  {!isOtpVerified ? (
                    // OTP Verification Form
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Enter 6-Digit OTP Code
                        <div className="relative mt-1.5">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="text"
                            required
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="pl-10 h-12 bg-white dark:bg-gray-900 tracking-widest text-lg font-bold"
                            placeholder="123456"
                          />
                        </div>
                      </label>
                      <Button type="submit" disabled={loading} className="w-full h-12 gradient-bg text-white border-0">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? 'Verifying Code...' : 'Verify OTP'}
                      </Button>
                      <button
                        type="button"
                        onClick={() => { setActivationStep(1); setFlashedOtp(''); setError(''); }}
                        className="text-xs text-gray-500 hover:text-indigo-600 block text-center w-full"
                      >
                        Request another code
                      </button>
                    </form>
                  ) : (
                    // Password Setting Form (Unlocked)
                    <form onSubmit={handleSetPassword} className="space-y-5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Choose Password
                        <div className="relative mt-1.5">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={8}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 bg-white dark:bg-gray-900"
                            placeholder="Choose new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </label>

                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Confirm Password
                        <div className="relative mt-1.5">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 h-12 bg-white dark:bg-gray-900"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </label>

                      <Button type="submit" disabled={loading} className="w-full h-12 gradient-bg text-white border-0">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? 'Activating Account...' : 'Set Password & Log In'}
                      </Button>
                    </form>
                  )}
                </div>
              )}

              <p className="text-center text-sm text-gray-500 mt-7">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsActivating(false);
                    setError('');
                    setActivationSuccess('');
                    setOtpCode('');
                    setIsOtpVerified(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold underline"
                >
                  Back to login
                </button>
              </p>
            </div>
          ) : (
            // Standard Login Form
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Log in</h2>
              <p className="mt-2 mb-7 text-gray-500 dark:text-gray-400">Use your account or a trusted provider.</p>
              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="h-12 bg-white dark:bg-gray-900" onClick={() => startOAuth('google')}><GoogleIcon className="w-5 h-5 mr-2" />Google</Button>
                <Button type="button" variant="outline" className="h-12 bg-white dark:bg-gray-900" onClick={() => startOAuth('github')}><Github className="w-5 h-5 mr-2" />GitHub</Button>
              </div>
              <div className="relative my-7"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800" /></div><div className="relative flex justify-center"><span className="bg-gray-50 dark:bg-gray-950 px-4 text-sm text-gray-400">or use email</span></div></div>
              {error && <div role="alert" className="mb-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</div>}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email<div className="relative mt-1.5"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="pl-10 h-12 bg-white dark:bg-gray-900" placeholder="you@university.edu" /></div></label>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200"><span className="flex justify-between">Password<Link to="/forgot-password" className="text-indigo-600 dark:text-indigo-400">Forgot?</Link></span><div className="relative mt-1.5"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="pl-10 pr-10 h-12 bg-white dark:bg-gray-900" placeholder="Password" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></label>
                <Button type="submit" disabled={loading} className="w-full h-12 gradient-bg text-white border-0">{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{loading ? 'Logging in...' : 'Log in'}</Button>
              </form>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                First-time resident?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsActivating(true);
                    setActivationStep(1);
                    setError('');
                  }}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold underline"
                >
                  Set up your account
                </button>
              </p>
              
              <p className="text-center text-sm text-gray-500 mt-7">New to HostelOS? <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold">Create an account</Link></p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}