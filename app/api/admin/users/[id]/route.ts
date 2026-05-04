import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const role = body.role === "admin" ? "admin" : "user";

    if (session.user.id === id && role !== "admin") {
      return NextResponse.json({ error: "You cannot remove your own admin role." }, { status: 400 });
    }

    await writeClient.patch(id).set({ role }).commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH admin user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
