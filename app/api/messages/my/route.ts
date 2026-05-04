import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const messages = await client.fetch(
      `*[_type == "message" && recipient._ref == $userId] | order(createdAt desc){
        _id,
        subject,
        body,
        createdAt,
        vehicle->{_id, brand->{name}, model->{name}},
        sender->{_id, name, email}
      }`,
      { userId: session.user.id }
    );

    return NextResponse.json(messages ?? []);
  } catch (error) {
    console.error("GET my messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
