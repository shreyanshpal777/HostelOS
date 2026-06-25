import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const stats = [
  { value: "12K+", label: "Students Managed" },
  { value: "150+", label: "Hostels Active" },
  { value: "98%", label: "Task Automation" },
  { value: "24/7", label: "AI Support" },
];

export default function HeroSection({ heroImage }) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white dark:bg-gray-950 transition-colors">
      <div className="absolute inset-0 gradient-bg-subtle dark:opacity-30" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-purple-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">AI-Powered Hostel Management</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold leading-tight mb-6 text-gray-900 dark:text-white">
              The Modern{" "}
              <span className="gradient-text">Operating System</span>{" "}
              for Student Housing.
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-xl">
              Centralize hostel operations, automate communication, and leverage AI to manage everything from complaints to tasks — all in one intelligent platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/signup">
                <Button size="lg" className="gradient-bg text-white border-0 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all text-base px-8 h-13 gap-2 w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 text-base px-8 h-13 gap-2 w-full sm:w-auto">
                  <Play className="w-4 h-4" />
                  See How It Works
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center sm:text-left"
                >
                  <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative float-animation">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
              <img
                src={heroImage}
                alt="AI-Powered Hostel Management Platform"
                className="relative w-full rounded-2xl shadow-2xl shadow-purple-500/10"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 glass-card rounded-2xl px-5 py-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">AI Conflict Detection</div>
                  <div className="text-xs text-gray-500">3 issues resolved today</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-4 -right-4 glass-card rounded-2xl px-5 py-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Tasks Automated</div>
                  <div className="text-xs text-gray-500">47 tasks this week</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}