import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, Github, Loader2, Lock, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import GoogleIcon from '@/components/GoogleIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, startOAuth } = useAuth();
  const navigate = useNavigate();
  const update = (field) => (event) => setForm((value) => ({ ...value, [field]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/console', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <aside className="hidden lg:flex lg:w-1/2 gradient-bg items-center justify-center p-12 text-white">
        <div className="max-w-lg"><div className="flex items-center gap-3 mb-8"><Building2 className="w-10 h-10" /><span className="text-2xl font-bold">HostelOS</span></div><h1 className="text-4xl font-heading font-bold mb-4 leading-tight">Bring your hostel operations into one intelligent workspace.</h1><p className="text-lg text-white/75">Create your account now and complete resident or staff details after signing in.</p></div>
      </aside>
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 text-gray-900 dark:text-white"><Building2 /><span className="text-xl font-bold">HostelOS</span></div>
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Create account</h2>
          <p className="mt-2 mb-7 text-gray-500 dark:text-gray-400">Sign up with a provider or your email.</p>
          <div className="grid grid-cols-2 gap-3"><Button type="button" variant="outline" className="h-12 bg-white dark:bg-gray-900" onClick={() => startOAuth('google')}><GoogleIcon className="w-5 h-5 mr-2" />Google</Button><Button type="button" variant="outline" className="h-12 bg-white dark:bg-gray-900" onClick={() => startOAuth('github')}><Github className="w-5 h-5 mr-2" />GitHub</Button></div>
          <div className="relative my-7"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800" /></div><div className="relative flex justify-center"><span className="bg-gray-50 dark:bg-gray-950 px-4 text-sm text-gray-400">or use email</span></div></div>
          {error && <div role="alert" className="mb-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full name<div className="relative mt-1.5"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input required value={form.name} onChange={update('name')} className="pl-10 h-12 bg-white dark:bg-gray-900" placeholder="Your name" /></div></label>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email<div className="relative mt-1.5"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input type="email" autoComplete="email" required value={form.email} onChange={update('email')} className="pl-10 h-12 bg-white dark:bg-gray-900" placeholder="you@university.edu" /></div></label>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password<div className="relative mt-1.5"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input type={showPassword ? 'text' : 'password'} minLength={8} autoComplete="new-password" required value={form.password} onChange={update('password')} className="pl-10 pr-10 h-12 bg-white dark:bg-gray-900" placeholder="At least 8 characters" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></label>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Confirm password<div className="relative mt-1.5"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input type="password" minLength={8} autoComplete="new-password" required value={form.confirmPassword} onChange={update('confirmPassword')} className="pl-10 h-12 bg-white dark:bg-gray-900" placeholder="Repeat your password" /></div></label>
            <Button type="submit" disabled={loading} className="w-full h-12 gradient-bg text-white border-0">{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{loading ? 'Creating account...' : 'Create account'}</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-7">Already registered? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold">Log in</Link></p>
        </motion.div>
      </main>
    </div>
  );
}