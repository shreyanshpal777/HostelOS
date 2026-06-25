import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function FeaturePageLayout({ icon: Icon, title, tag, description, color, benefits, useCases, ctaText }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Navbar />
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden bg-white dark:bg-gray-950 transition-colors">
        <div className="absolute inset-0 gradient-bg-subtle dark:opacity-30" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-300/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-8 transition">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="flex items-start gap-5 mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">{tag}</span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-white">{title}</h1>
              </div>
            </div>

            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl mb-12">{description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-6 mb-16"
          >
            {benefits.map((b, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{b.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{b.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {useCases && useCases.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Real-World Use Cases</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {useCases.map((uc, i) => (
                  <div key={i} className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-5 border border-indigo-100 dark:border-indigo-500/20">
                    <div className="text-2xl mb-3">{uc.emoji}</div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{uc.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{uc.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Link to="/signup">
              <Button size="lg" className="gradient-bg text-white border-0 shadow-xl shadow-purple-500/25 hover:scale-105 transition-all text-base px-8 gap-2">
                {ctaText || "Get Started Free"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}