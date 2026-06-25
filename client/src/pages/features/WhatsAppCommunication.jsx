import React from "react";
import { MessageCircle } from "lucide-react";
import FeaturePageLayout from "@/components/landing/FeaturePageLayout";

export default function WhatsAppCommunication() {
  return (
    <FeaturePageLayout
      icon={MessageCircle}
      title="Automated WhatsApp Communication"
      tag="Automation"
      color="from-green-500 to-emerald-600"
      description="Keep students, staff, and parents informed with automated WhatsApp broadcasts, two-way messaging, and smart notification routing. No more missed announcements or unread emails."
      benefits={[
        { title: "Broadcast Announcements", description: "Send hostel-wide or floor-specific announcements instantly — water outages, events, curfew changes." },
        { title: "Two-Way Messaging", description: "Students can reply to messages, ask questions, and raise complaints directly via WhatsApp." },
        { title: "Smart Scheduling", description: "Schedule messages for optimal delivery times based on student activity patterns." },
        { title: "Template Library", description: "Pre-built message templates for common scenarios — fee reminders, maintenance alerts, event invites." },
        { title: "Delivery Analytics", description: "Track read rates, response times, and engagement across all communications." },
        { title: "Multi-Language Support", description: "Auto-translate messages based on student language preferences for inclusive communication." },
      ]}
      useCases={[
        { emoji: "🚰", title: "Emergency Alerts", description: "Instant water/power outage notifications reach every affected student in seconds." },
        { emoji: "💰", title: "Fee Reminders", description: "Automated fee deadline reminders with payment links sent at scheduled intervals." },
        { emoji: "📅", title: "Event Updates", description: "Cultural fest, sports day, and hostel meeting reminders with RSVP tracking." },
      ]}
    />
  );
}