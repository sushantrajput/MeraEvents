"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { Search, LayoutGrid, List, Calendar, MapPin, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Import Button
import { CreateEventModal } from "@/components/CreateEventModal";

export default function EventsPortfolioPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "past">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

 
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const filteredEvents = events.filter((event: any) => {
    const eventDate = new Date(event.date);
    const today = startOfDay(new Date()); 
    
    let matchesStatus = true;
    if (filterStatus === "upcoming") matchesStatus = isAfter(eventDate, today) || eventDate.getTime() === today.getTime();
    if (filterStatus === "past") matchesStatus = isBefore(eventDate, today);

    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 space-y-8 min-h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Portfolio</h1>
          <p className="text-gray-500 mt-2">Manage, curate, and scale your professional gatherings.</p>
        </div>
        <div className="flex items-center gap-2">
           <CreateEventModal /> 
        </div>
      </div>

  
      <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            placeholder="Search your events database..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border-none rounded-lg text-sm focus:ring-0 text-gray-700 placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-lg">
          {(["all", "upcoming", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                filterStatus === tab ? "bg-black text-white shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-indigo-600 w-8 h-8" /></div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
            <Calendar className="w-8 h-8 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No events found</h3>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredEvents.map((event: any) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow border-gray-200 h-full flex flex-col">
                <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl" />
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className={isBefore(new Date(event.date), new Date()) ? "bg-gray-100 text-gray-600" : "bg-indigo-50 text-indigo-700"}>
                      {isBefore(new Date(event.date), new Date()) ? "Past Event" : "Upcoming"}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-xl text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-2">{event.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                      {format(new Date(event.date), "PPP")}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                      Online Event
                    </div>
                  </div>

                  <Link href={`/events/${event.id}`} className="w-full">
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                      View Details <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}