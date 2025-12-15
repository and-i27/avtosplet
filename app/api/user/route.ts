import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import bcrypt from "bcryptjs";

type UserPatchData = {
  name?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  password?: string; // dodano za TypeScript
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

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

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const body: UserPatchData = await req.json();
  const { name, email, oldPassword, newPassword } = body;

  const user = await client.fetch<{ password?: string; email?: string }>(
    `*[_type=="user" && _id==$id][0]`,
    { id: session.user.id }
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const patchData: Record<string, string> = {};

  if (name) patchData.name = name;
  if (email && email !== user.email) patchData.email = email;

  if (newPassword) {
    if (!oldPassword) {
      return NextResponse.json(
        { error: "Staro geslo je obvezno." },
        { status: 400 }
      );
    }

    const match = await bcrypt.compare(oldPassword, user.password || "");
    if (!match) {
      return NextResponse.json(
        { error: "Staro geslo ni pravilno." },
        { status: 400 }
      );
    }

    patchData.password = await bcrypt.hash(newPassword, 10);
  }

  await writeClient.patch(session.user.id).set(patchData).commit();

  return NextResponse.json({ success: true });
}
