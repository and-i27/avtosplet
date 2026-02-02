// route handler for fetching vehicle models based on brand

import { writeClient } from "@/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";

// Fetch models for a given brand with GET
export async function GET(req: NextRequest) {
  try {
    // Get brand ID from query parameters
    const brandId = req.nextUrl.searchParams.get("brand");
    if (!brandId) return NextResponse.json({ models: [] });

    // Fetch models from Sanity based on brand ID
    const models = await writeClient.fetch(
      '*[_type=="model" && brand._ref == $brand]{_id, name}',
      { brand: brandId }
    );

    return NextResponse.json({ models });
  } catch (error) {
    // Log and return error on failure
    console.error("Failed to fetch models:", error);
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}
