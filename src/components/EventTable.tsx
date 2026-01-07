"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, Trash2, Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EventTableProps {
  events: any[];
  isLoading: boolean;
}

export function EventTable({ events, isLoading }: EventTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Delete Logic
  const deleteEvent = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: () => toast.error("Failed to delete event"),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-12 bg-white rounded-xl shadow-sm">
        <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
      </div>
    );
  }

  if (events?.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 bg-white rounded-xl shadow-sm">
        No events found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-900">Active Events</h3>
        <Button variant="ghost" size="icon" className="text-gray-400">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-12 px-6 py-3 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="col-span-4">Event Info</div>
        <div className="col-span-3">Date</div>
        <div className="col-span-3">Registration</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {events.map((event: any) => (
        <div
          key={event.id}
          className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors border-b last:border-0"
        >
          
          <div className="col-span-4">
            <p className="font-medium text-gray-900">{event.title}</p>
            <p className="text-sm text-gray-500 truncate">{event.description}</p>
          </div>

         
          <div className="col-span-3 text-gray-600 text-sm">
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

        
          <div className="col-span-3 pr-8">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (event._count.attendees / event.capacity) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {event._count.attendees}/{event.capacity}
              </span>
            </div>
          </div>

         
          <div className="col-span-1">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 shadow-none font-medium">
              Open
            </Badge>
          </div>

          <div className="col-span-1 flex justify-end gap-2">
         
            <button
              onClick={() => {
                console.log("Navigating to:", `/events/${event.id}`);
                router.push(`/events/${event.id}`);
              }}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors cursor-pointer"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>

           
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                  title="Delete Event"
                >
                  {deleteEvent.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the event <b>"{event.title}"</b>{" "}
                    and remove all registered attendees. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => deleteEvent.mutate(event.id)}
                  >
                    Delete Event
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}