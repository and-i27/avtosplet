// route handler for fetching vehicle options

import { writeClient } from "@/sanity/lib/write-client";
import { NextResponse } from "next/server";

// Fetch vehicle options with GET
export async function GET() {
  try {
    // Fetch brands, colors, fuels, and gearboxes from Sanity
    const [brands, colors, fuels, gearboxes] = await Promise.all([
      writeClient.fetch('*[_type == "brand"]{_id, name}'),
      writeClient.fetch('*[_type == "color"]{_id, name}'),
      writeClient.fetch('*[_type == "fuel"]{_id, name}'),
      writeClient.fetch('*[_type == "gearbox"]{_id, name}'),
    ]);

    return NextResponse.json({ brands, colors, fuels, gearboxes });
  } catch (error) {
    // Log and return error on failure
    console.error("Failed to fetch options:", error);
    return NextResponse.json({ error: "Failed to fetch options" }, { status: 500 });
  }
}
