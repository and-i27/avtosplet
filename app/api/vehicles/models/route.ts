import { writeClient } from "@/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const brandId = req.nextUrl.searchParams.get("brand");
    if (!brandId) return NextResponse.json({ models: [] });

    const models = await writeClient.fetch(
      '*[_type=="model" && brand._ref == $brand]{_id, name}',
      { brand: brandId }
    );

    return NextResponse.json({ models });
  } catch (error) {
    console.error("Failed to fetch models:", error);
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}
