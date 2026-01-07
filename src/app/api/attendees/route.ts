import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";


const attendeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  eventId: z.string().min(1, "Event ID is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = attendeeSchema.parse(body);

    // Check if this email is already registered for THIS event
    const existingAttendee = await db.attendee.findUnique({
      where: {
        email_eventId: {
          email: validatedData.email,
          eventId: validatedData.eventId,
        },
      },
    });

    if (existingAttendee) {
      return NextResponse.json(
        { error: "This email is already registered for this event." },
        { status: 400 }
      );
    }

    // Save the new attendee
    const attendee = await db.attendee.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        eventId: validatedData.eventId,
      },
    });

    return NextResponse.json(attendee);
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to register attendee" },
      { status: 500 }
    );
  }
}