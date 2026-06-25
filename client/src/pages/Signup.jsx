import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Mail, Lock, User, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative text-white max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold">HostelOS</span>
          </div>
          <h1 className="text-4xl font-heading font-bold mb-4 leading-tight">Start managing smarter, not harder.</h1>
          <p className="text-lg text-white/70">Create your account and bring AI-powered automation to your hostel operations in minutes.</p>

          <div className="mt-10 space-y-4">
            {["Free forever for small teams", "No credit card required", "Set up in under 5 minutes"].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">✓</div>
                <span className="text-white/80">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50 dark:bg-gray-950 transition-colors">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-gray-900">HostelOS</span>
          </div>

          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Fill in your details to get started</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Dr. Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-white"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="pl-10 h-12 bg-white"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 gradient-bg text-white border-0 shadow-lg shadow-purple-500/25 text-base font-medium gap-2">
              <UserPlus className="w-4 h-4" />
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By signing up, you agree to our <Link to="/terms" className="text-indigo-600">Terms</Link> and <Link to="/privacy" className="text-indigo-600">Privacy Policy</Link>.
          </p>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Log In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}