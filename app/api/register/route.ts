// register route handler

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { writeClient } from "@/sanity/lib/write-client";

export async function POST(req: NextRequest) {
  try {

    // Parse request body
    const { name, email, password } = await req.json();

    // Check for missing fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Sanity
    const newUser = await writeClient.create({
      _type: "user",
      name,
      email,
      password: hashedPassword,
      providers: ["credentials"], // mark as credentials account
      emailVerified: null,
    });

    return NextResponse.json(
      { message: "User created successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    // In case of unexpected errors, log and return an error message
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
