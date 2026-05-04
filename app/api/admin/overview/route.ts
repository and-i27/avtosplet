import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [users, vehicles, messages] = await Promise.all([
      client.fetch(
        `*[_type == "user"] | order(name asc){
          _id,
          name,
          email,
          role,
          providers
        }`
      ),
      client.fetch(
        `*[_type == "vehicle"] | order(_createdAt desc){
          _id,
          price,
          year,
          _createdAt,
          brand->{name},
          model->{name},
          user->{_id, name, email}
        }`
      ),
      client.fetch(
        `*[_type == "message"] | order(createdAt desc)[0...10]{
          _id,
          subject,
          createdAt,
          sender->{name},
          recipient->{name},
          vehicle->{_id, brand->{name}, model->{name}}
        }`
      ),
    ]);

    return NextResponse.json({
      stats: {
        users: users.length,
        vehicles: vehicles.length,
        messages: messages.length,
        admins: users.filter((user: { role?: string }) => user.role === "admin").length,
      },
      users,
      vehicles,
      messages,
    });
  } catch (error) {
    console.error("GET admin overview error:", error);
    return NextResponse.json({ error: "Failed to fetch admin overview" }, { status: 500 });
  }
}
