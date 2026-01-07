import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const attendees = await db.attendee.findMany({
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      
      orderBy: {
        registeredAt: 'desc', 
      },
    });

    return NextResponse.json(attendees);
  } catch (error) {
    console.error("FETCH ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendees" },
      { status: 500 }
    );
  }
}