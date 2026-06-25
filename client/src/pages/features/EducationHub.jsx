import React from "react";
import { BookOpen } from "lucide-react";
import FeaturePageLayout from "@/components/landing/FeaturePageLayout";

export default function EducationHub() {
  return (
    <FeaturePageLayout
      icon={BookOpen}
      title="Centralized Education Section"
      tag="Education"
      color="from-amber-500 to-orange-600"
      description="A searchable knowledge base for hostel guidelines, study resources, emergency procedures, and policy documents. Students find answers instantly instead of asking repeatedly."
      benefits={[
        { title: "Document Repository", description: "Upload and organize hostel rules, safety procedures, and academic calendars in one searchable place." },
        { title: "FAQ System", description: "Auto-generated FAQ from common complaints and queries — students help themselves first." },
        { title: "Video Tutorials", description: "Embed orientation videos, fire drill walkthroughs, and facility usage guides." },
        { title: "Version Control", description: "Track policy changes over time with version history and change logs." },
        { title: "Student Contributions", description: "Let student reps contribute guides, tips, and peer-written resources with warden approval." },
        { title: "Multilingual Content", description: "Translate resources into regional languages so no student is left behind." },
      ]}
      useCases={[
        { emoji: "📖", title: "Fresher Orientation", description: "New students access a complete digital orientation package before they even arrive." },
        { emoji: "🔥", title: "Emergency Procedures", description: "Fire drill protocols, evacuation maps, and emergency contacts — always one tap away." },
        { emoji: "📝", title: "Exam Guidelines", description: "Quiet hours policy, library access rules, and exam-season protocols in one place." },
      ]}
    />
  );
}