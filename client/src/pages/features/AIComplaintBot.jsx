import React from "react";
import { MessageSquare } from "lucide-react";
import FeaturePageLayout from "@/components/landing/FeaturePageLayout";

export default function AIComplaintBot() {
  return (
    <FeaturePageLayout
      icon={MessageSquare}
      title="Smart Complaint / Query Bot"
      tag="AI Feature"
      color="from-purple-500 to-pink-500"
      description="Students can raise complaints or ask questions 24/7 via chat. The AI bot resolves common queries instantly, creates tickets for complex issues, escalates to the right authority, and tracks resolution status — all without human intervention."
      benefits={[
        { title: "24/7 Availability", description: "Students get instant responses at 2 AM — no waiting for office hours or warden availability." },
        { title: "Instant Resolution", description: "80% of routine queries (WiFi password, mess timings, leave rules) resolved without human touch." },
        { title: "Auto-Ticketing", description: "Complex issues automatically become tracked tickets with category, priority, and assigned owner." },
        { title: "Smart Escalation", description: "Bot knows when it can't help — seamlessly hands off to the right human with full context." },
        { title: "Context Memory", description: "Bot remembers previous interactions — no need for students to repeat their issue history." },
        { title: "Satisfaction Tracking", description: "Post-resolution surveys measure student satisfaction and flag unresolved frustrations." },
      ]}
      useCases={[
        { emoji: "💬", title: "Late Night Queries", description: "'What's the WiFi password for Block B?' → instant response at midnight." },
        { emoji: "🎫", title: "Complaint Filing", description: "'My roommate plays loud music' → ticket created, tagged, and sent to floor warden." },
        { emoji: "📞", title: "Escalation", description: "'I feel unsafe' → immediately routed to warden + security with highest priority." },
      ]}
      ctaText="Try the Smart Bot"
    />
  );
}