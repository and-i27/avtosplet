// route handler for fetching vehicles of the authenticated user

import { client } from "@/sanity/lib/client";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Fetch vehicles for the authenticated user with GET
export async function GET() {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch vehicles from Sanity for the authenticated user
    const vehicles = await client.fetch(
      `*[_type == "vehicle" && user._ref == $userId]{
        _id,
        brand->{name},
        model->{name},
        year,
        price,
        images[]{asset->{url}}
      }`,
      { userId: session.user.id }
    );

    return NextResponse.json(vehicles ?? []);
  } catch (err) {
    // Log and return error on failure
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}
