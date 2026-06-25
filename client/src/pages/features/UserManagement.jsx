import React from "react";
import { Users } from "lucide-react";
import FeaturePageLayout from "@/components/landing/FeaturePageLayout";

export default function UserManagement() {
  return (
    <FeaturePageLayout
      icon={Users}
      title="Smart User Management"
      tag="Management"
      color="from-blue-500 to-indigo-600"
      description="Manage every person in your hostel ecosystem — students, wardens, maintenance staff, and administrators — with intelligent profiles, automated onboarding, and real-time tracking across all hostels in your group."
      benefits={[
        { title: "Automated Onboarding", description: "New students get accounts, room assignments, and orientation materials automatically when added to the system." },
        { title: "Smart Profiles", description: "Each user has a rich profile with hostel history, complaints filed, tasks assigned, and behavioral analytics." },
        { title: "Bulk Operations", description: "Import 500+ students at once via CSV, assign rooms, and send welcome messages — all in one click." },
        { title: "Real-Time Directory", description: "Searchable directory with filters for hostel, floor, year, department, and status — always current." },
        { title: "Activity Tracking", description: "Track check-ins, check-outs, leave records, and attendance patterns across the entire hostel group." },
        { title: "Parent Portal", description: "Optional parent access for viewing student welfare reports, attendance, and important announcements." },
      ]}
      useCases={[
        { emoji: "🎓", title: "Semester Intake", description: "Onboard 2000 freshers in a day with automated room allocation and welcome kits." },
        { emoji: "🔄", title: "Room Swaps", description: "Handle room change requests with conflict checks and automated notifications." },
        { emoji: "📊", title: "Occupancy Reports", description: "Generate real-time occupancy analytics across all hostels for administration." },
      ]}
    />
  );
}