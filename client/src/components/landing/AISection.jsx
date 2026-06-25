import React from "react";
import { Link } from "react-router-dom";
import { Brain, MessageSquare, ShieldAlert, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const aiFeatures = [
  {
    icon: Brain,
    title: "Intelligent Task Categorization & Tagging",
    description: "Our AI automatically categorizes incoming tasks — maintenance, disciplinary, academic, facility — and assigns priority tags based on urgency, history, and context. No manual sorting needed.",
    highlights: ["Auto-priority scoring", "Smart tag suggestions", "Historical pattern learning"],
    link: "/features/ai-task-categorization",
  },
  {
    icon: MessageSquare,
    title: "Smart Complaint / Query Bot",
    description: "Students can raise complaints or ask questions 24/7. The AI bot resolves common queries instantly, escalates complex issues to the right authority, and tracks resolution status.",
    highlights: ["24/7 availability", "Auto-escalation", "Resolution tracking"],
    link: "/features/ai-complaint-bot",
  },
  {
    icon: ShieldAlert,
    title: "Automated Sentiment & Conflict Detection",
    description: "Monitors communication patterns to detect rising tensions, negative sentiment spikes, or potential conflicts. Alerts leadership proactively before issues escalate.",
    highlights: ["Real-time monitoring", "Proactive alerts", "Conflict prevention"],
    link: "/features/ai-sentiment-detection",
  },
];

export default function AISection() {
  return (
    <section id="ai" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold mb-4">
            <Zap className="w-4 h-4" />
            AI-Powered Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
            AI That <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Thinks Ahead</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Three powerful AI modules that transform reactive management into proactive, intelligent operations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {aiFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link to={feature.link} className="block h-full">
                <div className="group h-full glass-card-dark rounded-2xl p-7 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-5 shadow-lg shadow-purple-500/25">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        {h}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center text-sm font-medium text-purple-400 mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}