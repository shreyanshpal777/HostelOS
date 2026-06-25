import React from "react";
import { Bell } from "lucide-react";
import FeaturePageLayout from "@/components/landing/FeaturePageLayout";

export default function Notifications() {
  return (
    <FeaturePageLayout
      icon={Bell}
      title="Smart Notifications"
      tag="Communication"
      color="from-rose-500 to-pink-600"
      description="Intelligent notification routing ensures the right person gets the right alert at the right time — across email, WhatsApp, and in-app channels. No noise, no missed signals."
      benefits={[
        { title: "Channel Routing", description: "Urgent alerts go via WhatsApp, routine updates via email, and FYIs as in-app notifications." },
        { title: "Digest Mode", description: "Aggregate non-urgent notifications into daily or weekly digests to reduce alert fatigue." },
        { title: "Do-Not-Disturb", description: "Respect quiet hours and exam periods — batch notifications and deliver when appropriate." },
        { title: "Escalation Alerts", description: "Unacknowledged critical alerts auto-escalate to the next level after configurable timeouts." },
        { title: "Read Receipts", description: "Know exactly who has seen important announcements — follow up only with those who haven't." },
        { title: "Custom Triggers", description: "Set up custom notification rules — e.g., alert warden when occupancy drops below 80%." },
      ]}
      useCases={[
        { emoji: "🚨", title: "Security Alerts", description: "Unauthorized entry detected → instant alert to security, warden, and campus police." },
        { emoji: "📬", title: "Daily Digest", description: "Wardens get a morning digest: pending tasks, complaints, and today's schedule." },
        { emoji: "🔔", title: "Smart Reminders", description: "Curfew reminders sent 30 min before deadline only to students still checked out." },
      ]}
    />
  );
}