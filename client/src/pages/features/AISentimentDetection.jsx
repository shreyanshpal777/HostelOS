import React from "react";
import { ShieldAlert } from "lucide-react";
import FeaturePageLayout from "@/components/landing/FeaturePageLayout";

export default function AISentimentDetection() {
  return (
    <FeaturePageLayout
      icon={ShieldAlert}
      title="Automated Sentiment & Conflict Detection"
      tag="AI Feature"
      color="from-purple-500 to-pink-500"
      description="Our AI monitors communication patterns, complaint language, and behavioral signals to detect rising tensions, negative sentiment spikes, or potential conflicts. Leadership gets alerted proactively — before issues escalate into crises."
      benefits={[
        { title: "Real-Time Monitoring", description: "Continuous analysis of complaints, chat messages, and feedback for sentiment indicators." },
        { title: "Tension Heatmaps", description: "Visual floor/hostel heatmaps showing areas with rising negative sentiment." },
        { title: "Proactive Alerts", description: "Wardens get alerted when a specific floor or group shows concerning patterns." },
        { title: "Conflict Prediction", description: "AI identifies interpersonal tensions from complaint patterns before they become confrontations." },
        { title: "Wellbeing Signals", description: "Detect isolation, stress, and mental health red flags from behavioral pattern changes." },
        { title: "Resolution Tracking", description: "Monitor whether interventions actually improve sentiment scores over time." },
      ]}
      useCases={[
        { emoji: "🔥", title: "Floor Tension", description: "AI detects 3x spike in noise complaints on Floor 4 → warden proactively intervenes." },
        { emoji: "🧠", title: "Student Wellbeing", description: "Student's complaint tone shifts negative over weeks → counselor flagged for outreach." },
        { emoji: "⚖️", title: "Roommate Conflicts", description: "Pattern of complaints between two roommates detected → room reassignment suggested." },
      ]}
      ctaText="See Sentiment AI in Action"
    />
  );
}