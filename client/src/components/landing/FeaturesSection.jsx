import React from "react";
import { Link } from "react-router-dom";
import { Users, MessageCircle, Shield, BookOpen, CheckSquare, Bell, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Users,
    title: "Smart User Management",
    description: "Manage students, wardens, and staff with intelligent profiles, automated onboarding, and real-time tracking across all hostels.",
    tag: "Management",
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
    link: "/features/user-management",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Communication",
    description: "Automated announcements, alerts, and two-way messaging via WhatsApp — keep everyone informed without manual effort.",
    tag: "Automation",
    color: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/20",
    link: "/features/whatsapp-communication",
  },
  {
    icon: Shield,
    title: "Role-Based Leadership",
    description: "Define hierarchies — Rector, Warden, Floor In-charge, Student Rep — with scoped permissions and accountability chains.",
    tag: "Security",
    color: "from-purple-500 to-violet-600",
    shadow: "shadow-purple-500/20",
    link: "/features/role-based-leadership",
  },
  {
    icon: BookOpen,
    title: "Centralized Education",
    description: "Share study resources, hostel guidelines, emergency procedures, and policy documents in a searchable knowledge base.",
    tag: "Education",
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
    link: "/features/education-hub",
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Create, assign, and track tasks with deadlines, priorities, and automated reminders. Never miss a maintenance request again.",
    tag: "Productivity",
    color: "from-cyan-500 to-teal-600",
    shadow: "shadow-cyan-500/20",
    link: "/features/task-management",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Intelligent notification routing ensures the right person gets the right alert at the right time — across email, WhatsApp, and in-app.",
    tag: "Communication",
    color: "from-rose-500 to-pink-600",
    shadow: "shadow-rose-500/20",
    link: "/features/notifications",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 relative bg-white dark:bg-gray-950 transition-colors">
      <div className="absolute inset-0 gradient-bg-subtle dark:opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-4">
            Powerful Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for{" "}
            <span className="gradient-text">Modern Hostel Ops</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            From student management to automated communications — every tool your hostel group needs, built into one seamless platform.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link to={feature.link} className="block h-full">
                <div className="group relative h-full bg-white dark:bg-gray-900 rounded-2xl p-7 border border-gray-100 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} ${feature.shadow} shadow-lg flex items-center justify-center`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{feature.tag}</span>
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{feature.description}</p>
                  <div className="flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
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