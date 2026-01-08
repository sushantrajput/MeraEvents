"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Users, Filter, Loader2, Mail, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AttendeesPage() {
  
  
  const [localSearch, setLocalSearch] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState<string | null>(null);

  const { data: attendees = [], isLoading, isError } = useQuery({
    queryKey: ["allAttendees"],
    queryFn: async () => {
      const res = await fetch("/api/attendees/all");
      if (!res.ok) throw new Error("Failed to fetch attendees");
      return res.json();
    },
  });

  const uniqueEvents = useMemo(() => {
    const events = attendees.map((a: any) => a.event?.title).filter(Boolean);
    return Array.from(new Set(events)) as string[];
  }, [attendees]);

  
  const filteredAttendees = attendees.filter((person: any) => {
 
    const searchString = (localSearch).toLowerCase();
    
    const matchesSearch = 
      person.name.toLowerCase().includes(searchString) ||
      person.email.toLowerCase().includes(searchString) ||
      person.event?.title?.toLowerCase().includes(searchString);

    const matchesEvent = selectedEventFilter 
      ? person.event?.title === selectedEventFilter 
      : true;

    return matchesSearch && matchesEvent;
  });

  return (
    <div className="p-8 space-y-8 h-full flex flex-col">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendee Directory</h1>
        <p className="text-gray-500 mt-2">
          A unified view of all individuals registered across your events.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
       
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or event..."
            className="pl-10 bg-white"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

       
        <div className="relative min-w-[200px]">
          <select 
            className="w-full h-10 pl-3 pr-10 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            value={selectedEventFilter || ""}
            onChange={(e) => setSelectedEventFilter(e.target.value || null)}
          >
            <option value="">All Events</option>
            {uniqueEvents.map((evt) => (
              <option key={evt} value={evt}>
                {evt}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {(selectedEventFilter || localSearch) && (
          <Button 
            variant="ghost" 
            onClick={() => {
              setLocalSearch("");
              setSelectedEventFilter(null);
            }}
            className="text-gray-500"
          >
            Reset
            <X className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      <Card className="border-0 shadow-sm bg-white flex-1 flex flex-col">
        <div className="grid grid-cols-12 px-6 py-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-5">Attendee</div>
          <div className="col-span-4">Registered For</div>
          <div className="col-span-3 text-right">Join Date</div>
        </div>

        <CardContent className="p-0 flex-1 relative overflow-auto">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          )}

          {!isLoading && !isError && filteredAttendees.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center h-full">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-900 font-medium text-lg">No matches found</p>
              <p className="text-gray-500 text-sm mt-2">
                Try selecting a different event or clearing your search.
              </p>
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {filteredAttendees.map((person: any) => (
              <div key={person.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50/80 transition-colors">
                <div className="col-span-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{person.name}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                      <Mail className="w-3 h-3 mr-1.5" />
                      {person.email}
                    </div>
                  </div>
                </div>

                <div className="col-span-4">
                  <Link href={`/events/${person.eventId}`}>
                    <Badge variant="secondary" className="hover:bg-indigo-100 hover:text-indigo-700 transition-colors cursor-pointer font-medium">
                      {person.event?.title || "Unknown Event"}
                    </Badge>
                  </Link>
                </div>

                <div className="col-span-3 text-right text-sm text-gray-500">
                  {format(new Date(person.registeredAt), "MMM d, yyyy")}
                  <br />
                  <span className="text-xs text-gray-400">
                    {format(new Date(person.registeredAt), "h:mm a")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}