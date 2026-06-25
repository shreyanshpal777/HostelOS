import React from "react";
import { CheckSquare } from "lucide-react";
import FeaturePageLayout from "@/components/landing/FeaturePageLayout";

export default function TaskManagement() {
  return (
    <FeaturePageLayout
      icon={CheckSquare}
      title="Task Management & Notifications"
      tag="Productivity"
      color="from-cyan-500 to-teal-600"
      description="Create, assign, and track tasks with deadlines, priorities, and automated reminders. From plumbing repairs to event planning — never miss a request, never drop a follow-up."
      benefits={[
        { title: "Smart Assignment", description: "Tasks auto-route to the right person based on type, location, and current workload." },
        { title: "Priority Engine", description: "AI analyzes urgency, impact, and history to auto-prioritize incoming tasks." },
        { title: "Deadline Tracking", description: "Visual timelines with automated escalation when deadlines approach or are missed." },
        { title: "Recurring Tasks", description: "Set up weekly inspections, monthly audits, and daily cleaning schedules that auto-generate." },
        { title: "Photo Evidence", description: "Attach before/after photos to maintenance tasks for accountability and record-keeping." },
        { title: "Completion Analytics", description: "Track resolution times, bottlenecks, and staff performance across all hostels." },
      ]}
      useCases={[
        { emoji: "🔧", title: "Maintenance Pipeline", description: "Broken tap → auto-assigned to plumber → photo proof → warden signs off → done." },
        { emoji: "🧹", title: "Cleaning Schedules", description: "Daily/weekly cleaning tasks auto-generated and tracked with room-level granularity." },
        { emoji: "📊", title: "Monthly Reports", description: "Auto-generated task completion reports for each hostel sent to administration." },
      ]}
    />
  );
}