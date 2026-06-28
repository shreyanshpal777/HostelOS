import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, Github, Loader2, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import GoogleIcon from '@/components/GoogleIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(() => new URLSearchParams(window.location.search).get('message') || '');
  const { login, startOAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <aside className="hidden lg:flex lg:w-1/2 gradient-bg items-center justify-center p-12 text-white">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-8"><Building2 className="w-10 h-10" /><span className="text-2xl font-heading font-bold">HostelOS</span></div>
          <h1 className="text-4xl font-heading font-bold mb-4 leading-tight">Welcome back to smarter student housing.</h1>
          <p className="text-lg text-white/75">Access residents, tasks, resources, and hostel operations from one place.</p>
        </div>
      </aside>
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 text-gray-900 dark:text-white"><Building2 /><span className="text-xl font-bold">HostelOS</span></div>
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
          <p className="text-center text-sm text-gray-500 mt-7">New to HostelOS? <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold">Create an account</Link></p>
        </motion.div>
      </main>
    </div>
  );
}