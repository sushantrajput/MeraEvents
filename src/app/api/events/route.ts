import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";


const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
 
  date: z.string(), 
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
});


export async function GET() {
  try {
    const events = await db.event.findMany({
      
      include: { 
        _count: { 
          select: { attendees: true } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Received Event Data:", body);

  
    const validatedData = eventSchema.parse(body);

    const event = await db.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        capacity: validatedData.capacity,
        
        date: new Date(validatedData.date), 
      },
    });

    console.log("✅ Event Created:", event.id);
    return NextResponse.json(event);

  } catch (error) {
  
    console.error("❌ CREATE EVENT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create event", details: String(error) }, 
      { status: 500 }
    );
  }
}