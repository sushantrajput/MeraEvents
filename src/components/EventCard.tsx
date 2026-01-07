"use client";

import { format } from "date-fns";
import { Calendar, Users, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EventCard({ event }: { event: any }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const attendeeCount = event._count?.attendees || 0;

  const deleteEvent = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/events/${event.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      toast.success("Event deleted!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  return (
    <Card className="flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-slate-800">
          {event.title}
        </CardTitle>
        <div className="flex items-center text-xs text-slate-500 font-medium mt-1">
          <Calendar className="w-3 h-3 mr-1.5" />
          {format(new Date(event.date), "MMM d, yyyy")}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-6">
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10 leading-relaxed">
          {event.description}
        </p>
        
        <div className="flex items-center justify-between">
           <div className="flex items-center text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
            <Users className="w-4 h-4 mr-2 text-indigo-500" />
            {attendeeCount} / {event.capacity}
          </div>
        </div>

        
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 relative z-50">
          
         
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              
              router.push(`/events/${event.id}`);
            }}
            className="flex-1 flex items-center justify-center py-2 px-4 rounded-md bg-indigo-50 text-indigo-600 font-medium text-sm hover:bg-indigo-100 transition-colors border border-indigo-200 cursor-pointer"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </button>

          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (confirm("Are you sure you want to delete this event?")) {
                deleteEvent.mutate();
              }
            }}
            className="flex items-center justify-center p-2 rounded-md bg-white text-red-500 hover:bg-red-50 hover:text-red-700 border border-slate-200 transition-colors cursor-pointer"
            title="Delete Event"
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>
      </CardContent>
    </Card>
  );
}