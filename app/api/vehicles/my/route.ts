import { client } from "@/sanity/lib/client";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

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
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}
