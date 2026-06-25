import React from "react";
import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Smart User Management", to: "/features/user-management" },
    { label: "WhatsApp Communication", to: "/features/whatsapp-communication" },
    { label: "Role-Based Leadership", to: "/features/role-based-leadership" },
    { label: "Education Hub", to: "/features/education-hub" },
    { label: "Task Management", to: "/features/task-management" },
  ],
  "AI Features": [
    { label: "Task Categorization", to: "/features/ai-task-categorization" },
    { label: "Complaint Bot", to: "/features/ai-complaint-bot" },
    { label: "Sentiment Detection", to: "/features/ai-sentiment-detection" },
  ],
  Company: [
    { label: "About Us", to: "/about" },
    { label: "Careers", to: "/careers" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", to: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Cookie Policy", to: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-heading font-bold text-white">
                Hostel<span className="text-purple-400">OS</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              The modern operating system for student housing. AI-powered, fully automated.
            </p>
            <div className="space-y-2.5 text-sm">
              <a href="mailto:hello@hostelosl.com" className="flex items-center gap-2 hover:text-purple-400 transition">
                <Mail className="w-4 h-4" /> hello@hostelosl.com
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-purple-400 transition">
                <Phone className="w-4 h-4" /> +91 12345 67890
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" /> New Delhi, India
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm hover:text-purple-400 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} HostelOS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition">
              <Github className="w-4 h-4 text-white" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition">
              <Twitter className="w-4 h-4 text-white" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition">
              <Linkedin className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}