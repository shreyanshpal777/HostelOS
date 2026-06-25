import React from "react";
import { Shield } from "lucide-react";
import FeaturePageLayout from "@/components/landing/FeaturePageLayout";

export default function RoleBasedLeadership() {
  return (
    <FeaturePageLayout
      icon={Shield}
      title="Role-Based Leadership System"
      tag="Security"
      color="from-purple-500 to-violet-600"
      description="Define clear hierarchies — Rector, Warden, Floor In-charge, Student Representative — with scoped permissions, accountability chains, and automated delegation. Everyone sees exactly what they need."
      benefits={[
        { title: "Custom Role Definitions", description: "Create unlimited roles with granular permissions — view, edit, approve, escalate — tailored to your org." },
        { title: "Hierarchy Chains", description: "Define escalation paths so unresolved issues automatically climb the chain of command." },
        { title: "Delegation Rules", description: "Wardens going on leave? Auto-delegate their responsibilities to a designated deputy." },
        { title: "Audit Trail", description: "Every action, approval, and decision is logged with timestamps and user attribution." },
        { title: "Dashboard per Role", description: "Each role gets a customized dashboard — students see their tasks, wardens see their floor, rectors see everything." },
        { title: "Permission Templates", description: "Pre-built permission templates for common hostel structures — easily adapt to your institution." },
      ]}
      useCases={[
        { emoji: "🏛️", title: "Multi-Campus Setup", description: "Different role structures for boys' and girls' hostels under one unified system." },
        { emoji: "🔒", title: "Data Privacy", description: "Medical records visible only to the warden and health officer — not floor reps." },
        { emoji: "📋", title: "Approval Chains", description: "Leave requests flow: Student → Floor Rep → Warden → Rector with auto-reminders." },
      ]}
    />
  );
}