import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Building2, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "AI Power", href: "#ai" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm border-b border-purple-100/50 dark:border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-gray-900 dark:text-white">
              Hostel<span className="gradient-text">OS</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white rounded-lg hover:bg-indigo-50/50 dark:hover:bg-white/10 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 dark:text-gray-200 dark:hover:text-white dark:hover:bg-white/10 font-medium gap-2">
                <LogIn className="w-4 h-4" />
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="gradient-bg text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all font-medium gap-2">
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Button>
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-purple-100/50"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full gradient-bg text-white border-0 justify-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}