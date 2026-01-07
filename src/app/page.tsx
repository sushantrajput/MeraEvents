"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation"; 
import { CreateEventModal } from "@/components/CreateEventModal";
import { DashboardStats } from "@/components/DashboardStats";
import { EventTable } from "@/components/EventTable";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || ""; 

  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const filteredEvents = events.filter((event: any) => 
    event.title.toLowerCase().includes(query) || 
    event.description.toLowerCase().includes(query)
  );

  return (
    <div className="p-8 space-y-8">
     
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Event Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your events and track attendee registrations.
          </p>
        </div>
        <CreateEventModal />
      </div>

      <DashboardStats events={events} />
      
      <div className="space-y-4">
        {query && (
           <p className="text-sm text-gray-500">
             Showing results for: <span className="font-semibold text-indigo-600">"{query}"</span>
           </p>
        )}
        <EventTable events={filteredEvents} isLoading={isLoading} />
      </div>
    </div>
  );
}