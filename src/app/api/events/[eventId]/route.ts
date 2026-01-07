export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    // This will cascade delete all attendees automatically due to schema settings
    await db.event.delete({
      where: { id: params.eventId },
    });

    return NextResponse.json({ message: "Event deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

// We also need a GET here to fetch single event details for the View page
export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const event = await db.event.findUnique({
      where: { id: params.eventId },
      include: { attendees: true }, // Fetch attendees with the event
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
}