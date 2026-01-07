"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Trash2, Calendar, Users, Mail, MapPin, Share2, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RegisterAttendeeModal } from "@/components/RegisterAttendeeModal";

const fetchEventDetails = async (id: string) => {
  const res = await fetch(`/api/events/${id}`);
  if (!res.ok) throw new Error("Event not found");
  return res.json();
};

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const eventId = params.eventId as string;

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEventDetails(eventId),
  });

  const deleteAttendee = useMutation({
    mutationFn: async (attendeeId: string) => {
      await fetch(`/api/attendees/${attendeeId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast.success("Attendee removed");
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  // --- DEBUGGED EXPORT CSV ---
  const handleExportCSV = () => {
    // 1. Debug Alert
    alert(`Debug: Button Clicked. Found ${event?.attendees?.length || 0} attendees.`);

    if (!event || event.attendees.length === 0) {
      toast.error("You need at least 1 attendee to export.");
      return;
    }

    try {
      const headers = ["Name,Email,Registration Date"];
      const rows = event.attendees.map((person: any) => 
        `"${person.name}","${person.email}","${new Date().toLocaleDateString()}"`
      );

      const csvContent = [headers, ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${event.title.replace(/\s+/g, '_')}_Attendees.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started!");
    } catch (err) {
      alert("Error exporting: " + err);
    }
  };

  // --- DEBUGGED EMAIL ALL ---
  const handleEmailAll = () => {
    // 1. Debug Alert
    alert(`Debug: Email Button Clicked. Found ${event?.attendees?.length || 0} attendees.`);

    if (!event || event.attendees.length === 0) {
      toast.error("No attendees to email.");
      return;
    }

    const emails = event.attendees.map((p: any) => p.email).join(",");
    const subject = encodeURIComponent(`Update regarding: ${event.title}`);
    const body = encodeURIComponent(`Hello everyone,\n\nHere is an update...`);
    
    // Force window location change
    window.open(`mailto:?bcc=${emails}&subject=${subject}&body=${body}`, "_self");
  };


  if (isLoading) return <div className="flex h-full items-center justify-center pt-20"><Loader2 className="animate-spin text-indigo-600"/></div>;
  if (isError || !event) return <div className="p-8">Event not found</div>;

  const filledPercentage = Math.min((event.attendees.length / event.capacity) * 100, 100);

  return (
    <div className="p-8 space-y-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <Badge className="w-fit bg-indigo-100 text-indigo-700 hover:bg-indigo-100 mb-2">Active Event</Badge>
              <CardTitle className="text-3xl font-bold text-gray-900">{event.title}</CardTitle>
              <p className="text-gray-500 mt-2">{event.description}</p>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-6 pt-0">
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                {format(new Date(event.date), "PPP")}
              </div>
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                 <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                 Online / TBD
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attendee List</CardTitle>
              <div className="bg-white">
                <RegisterAttendeeModal eventId={event.id} eventTitle={event.title} />
              </div>
            </CardHeader>
            <CardContent>
              {event.attendees.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No attendees yet.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {event.attendees.map((person: any) => (
                    <div key={person.id} className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                          {person.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{person.name}</p>
                          <p className="text-xs text-gray-500">{person.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={() => deleteAttendee.mutate(person.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Registration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Filled Capacity</span>
                <span className="font-bold text-indigo-600">{Math.round(filledPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${filledPercentage}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mb-4">{event.capacity - event.attendees.length} spots remaining</p>
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" /> Share Public Page
              </Button>
            </CardContent>
          </Card>

          {/* DEBUG BUTTONS */}
          <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">Organizer Tools</h3>
            <p className="text-indigo-100 text-sm mb-6">Manage outreach, send bulk reminders, or export data.</p>
            <div className="space-y-3">
              <Button 
                onClick={handleEmailAll}
                className="w-full bg-indigo-500 hover:bg-indigo-400 border-0 text-white justify-start"
              >
                <Mail className="w-4 h-4 mr-2" /> Email All Attendees
              </Button>
              <Button 
                onClick={handleExportCSV}
                className="w-full bg-indigo-500 hover:bg-indigo-400 border-0 text-white justify-start"
              >
                <Download className="w-4 h-4 mr-2" /> Export to CSV
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}