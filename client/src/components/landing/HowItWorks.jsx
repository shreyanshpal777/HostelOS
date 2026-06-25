import React from "react";
import { Link } from "react-router-dom";
import { UserPlus, Settings, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    icon: UserPlus,
    title: "Set Up Your Hostel Group",
    description: "Add your hostels, define the organizational structure, and invite wardens, staff, and student representatives.",
  },
  {
    num: "02",
    icon: Settings,
    title: "Configure AI & Automations",
    description: "Enable smart task categorization, connect WhatsApp, set up notification rules, and let the AI learn your operations.",
  },
  {
    num: "03",
    icon: Rocket,
    title: "Go Live & Let AI Handle It",
    description: "Watch as tasks get auto-assigned, complaints route themselves, and conflicts are flagged before they escalate.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-4">
            Simple Setup
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Up and Running in{" "}
            <span className="gradient-text">Three Steps</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            From sign-up to full automation — get your entire hostel group managed in minutes, not months.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-xl shadow-purple-500/20 relative z-10">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-600 z-20">
                  {step.num}
                </span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-3">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-14"
        >
          <Link to="/signup">
            <Button size="lg" className="gradient-bg text-white border-0 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all text-base px-8 gap-2">
              Start Now — It's Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}