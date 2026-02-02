// route handler for user data retrieval and update

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import bcrypt from "bcryptjs";

// Define the shape of the data expected in the PUT request
type UserPatchData = {
  name?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  password?: string; // dodano za TypeScript
};

// Fetch user data with GET
export async function GET() {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // Fetch user data from Sanity
  const user = await client.fetch<{
    name?: string;
    email?: string;
    providers?: string[];
  }>(
    `*[_type=="user" && _id==$id][0]{name,email,providers}`,
    { id: session.user.id }
  );

  return NextResponse.json(user ?? {});
}

// Update user data with PUT
export async function PUT(req: NextRequest) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // Parse request body
  const body: UserPatchData = await req.json();
  const { name, email, oldPassword, newPassword } = body;

  // Fetch current user data
  const user = await client.fetch<{ password?: string; email?: string }>(
    `*[_type=="user" && _id==$id][0]`,
    { id: session.user.id }
  );

  // check if user exists
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Prepare data to be patched
  const patchData: Record<string, string> = {};

  // Update name and email if provided
  if (name) patchData.name = name;
  if (email && email !== user.email) patchData.email = email;

  // Handle password change
  if (newPassword) {
    if (!oldPassword) {
      // Old password is required to set a new password
      return NextResponse.json(
        { error: "Staro geslo je obvezno." },
        { status: 400 }
      );
    }

    // Verify old password
    const match = await bcrypt.compare(oldPassword, user.password || "");

    // If old password does not match, return error
    if (!match) {
      return NextResponse.json(
        { error: "Staro geslo ni pravilno." },
        { status: 400 }
      );
    }

    patchData.password = await bcrypt.hash(newPassword, 10);
  }

  // Update user data in Sanity
  await writeClient.patch(session.user.id).set(patchData).commit();

  return NextResponse.json({ success: true });
}
