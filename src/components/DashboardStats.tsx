"use client";

import { Calendar, Users, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";

interface DashboardStatsProps {
  events: any[];
}

export function DashboardStats({ events }: DashboardStatsProps) {
  const totalEvents = events?.length || 0;
  const totalRegistrations = events?.reduce(
    (acc: number, curr: any) => acc + curr._count.attendees,
    0
  ) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        label="Total Events"
        value={totalEvents}
        icon={Calendar}
        colorClass="bg-indigo-500"
      />
      <StatsCard
        label="Total Registrations"
        value={totalRegistrations}
        icon={Users}
        colorClass="bg-emerald-500"
      />
      <StatsCard
        label="Upcoming This Week"
        value={totalEvents} 
        icon={TrendingUp}
        colorClass="bg-orange-500"
      />
    </div>
  );
}