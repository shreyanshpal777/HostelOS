import React from "react";
import { Brain } from "lucide-react";
import FeaturePageLayout from "@/components/landing/FeaturePageLayout";

export default function AITaskCategorization() {
  return (
    <FeaturePageLayout
      icon={Brain}
      title="Intelligent Task Categorization & Tagging"
      tag="AI Feature"
      color="from-purple-500 to-pink-500"
      description="Our AI reads incoming tasks and complaints, automatically categorizes them — maintenance, disciplinary, academic, facility — assigns priority tags, and routes them to the right team. Zero manual sorting."
      benefits={[
        { title: "Auto-Classification", description: "NLP engine reads task descriptions and classifies into 12+ categories with 95%+ accuracy." },
        { title: "Priority Scoring", description: "AI scores urgency (1-10) based on keywords, history, affected count, and context." },
        { title: "Smart Tags", description: "Auto-generated tags like #plumbing, #urgent, #floor-3, #recurring for instant filtering." },
        { title: "Learning Engine", description: "The AI improves over time by learning from manual corrections and resolution patterns." },
        { title: "Duplicate Detection", description: "Identifies duplicate or related complaints and merges them before assignment." },
        { title: "Trend Analysis", description: "Spots patterns — e.g., plumbing complaints spike every monsoon — and flags preemptive action." },
      ]}
      useCases={[
        { emoji: "🏷️", title: "Auto-Routing", description: "'AC not working in Room 305' → tagged #maintenance #HVAC #floor-3 → assigned to HVAC team." },
        { emoji: "🔗", title: "Duplicate Merging", description: "5 students report the same broken elevator — AI merges into one high-priority task." },
        { emoji: "📈", title: "Trend Alerts", description: "AI notices rising food complaints → alerts mess committee before it becomes a crisis." },
      ]}
      ctaText="Experience AI Categorization"
    />
  );
}