import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    const body = await req.json();
    const vehicleId = String(body.vehicleId ?? "");
    const recipientId = String(body.recipientId ?? "");
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!vehicleId || !recipientId || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (recipientId === session.user.id) {
      return NextResponse.json({ error: "You cannot message yourself." }, { status: 400 });
    }

    const created = await writeClient.create({
      _type: "message",
      vehicle: { _type: "reference", _ref: vehicleId },
      sender: { _type: "reference", _ref: session.user.id },
      recipient: { _type: "reference", _ref: recipientId },
      subject,
      body: message,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: created._id }, { status: 201 });
  } catch (error) {
    console.error("POST message error:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
