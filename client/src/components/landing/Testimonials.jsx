import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "HostelOS cut our administrative work by 70%. The AI task categorization alone saves us 3 hours daily.",
    name: "Dr. Ananya Sharma",
    role: "Chief Warden, IIT Delhi Hostels",
    initials: "AS",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    quote: "The WhatsApp integration is a game-changer. Students get instant updates and we track everything centrally.",
    name: "Rajesh Mehta",
    role: "Hostel Administrator, BITS Pilani",
    initials: "RM",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    quote: "Conflict detection flagged a brewing issue between floor groups before it escalated. Truly intelligent software.",
    name: "Priya Nair",
    role: "Student Affairs Head, VIT Vellore",
    initials: "PN",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    quote: "Role-based access means wardens see exactly what they need. No more information overload or permission confusion.",
    name: "Vikram Singh",
    role: "Dean of Students, NIT Trichy",
    initials: "VS",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    quote: "The complaint bot handles 80% of routine queries. Our staff now focuses on things that actually need human attention.",
    name: "Kavitha Reddy",
    role: "Hostel Superintendent, IISC Bangalore",
    initials: "KR",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    quote: "We manage 12 hostels across campus. HostelOS unified all our operations into one clean dashboard. Incredible.",
    name: "Arjun Desai",
    role: "Campus Director, Manipal University",
    initials: "AD",
    gradient: "from-emerald-500 to-green-600",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 lg:py-32 relative overflow-hidden bg-white dark:bg-gray-950 transition-colors">
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
            Trusted by Institutions
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            What <span className="gradient-text">Leaders</span> Say
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Hostel administrators, wardens, and student affairs heads share their experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-7 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}