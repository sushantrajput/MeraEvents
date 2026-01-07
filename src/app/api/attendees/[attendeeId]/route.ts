import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { attendeeId: string } }
) {
  try {
    // Check if ID is present
    if (!params.attendeeId) {
      return NextResponse.json({ error: "ID missing" }, { status: 400 });
    }

    // Attempt delete
    const deleted = await db.attendee.delete({
      where: { id: params.attendeeId },
    });

    return NextResponse.json({ message: "Attendee removed", deleted });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to remove attendee" },
      { status: 500 }
    );
  }
}