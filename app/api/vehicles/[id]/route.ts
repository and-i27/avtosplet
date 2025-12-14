import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";

/* =====================================================
   GET – fetch vehicle for edit
===================================================== */
export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> } // params je Promise
) {
  try {
    const params = await context.params; // 👈 unwrap Promise
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const vehicle = await client.fetch(
      `*[_type=="vehicle" && _id==$id][0]{
        brand->{_id, name},
        model->{_id, name},
        fuel->{_id, name},
        gearbox->{_id, name},
        color->{_id, name},
        price,
        year,
        kilometers,
        engineSize,
        powerKW,
        doors,
        seats,
        description,
        images[]{ _key, "url": asset->url, "_ref": asset->_id }
      }`,
      { id }
    );

    if (!vehicle) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (err) {
    console.error("GET vehicle error:", err);
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 });
  }
}

/* =====================================================
   PUT – update vehicle
===================================================== */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const formData = await req.formData();

    const brand = formData.get("brand") as string;
    const model = formData.get("model") as string;
    const fuel = formData.get("fuel") as string;
    const gearbox = formData.get("gearbox") as string;
    const color = formData.get("color") as string | null;

    const price = Number(formData.get("price"));
    const year = Number(formData.get("year"));
    const kilometers = Number(formData.get("kilometers"));
    const engineSize = Number(formData.get("engineSize"));
    const powerKW = Number(formData.get("powerKW"));
    const doors = Number(formData.get("doors"));
    const seats = Number(formData.get("seats"));
    const description = formData.get("description") as string;

    /* ---------- EXISTING IMAGES ---------- */
    const existingImagesRaw = formData.get("existingImages") as string;
    const existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];

    /* ---------- NEW IMAGES ---------- */
    const newFiles = formData.getAll("images") as File[];
    const newImageRefs = [];

    for (const file of newFiles) {
      const asset = await writeClient.assets.upload("image", file, {
        filename: file.name,
      });

      newImageRefs.push({
        _type: "image",
        _key: crypto.randomUUID(),
        asset: { _type: "reference", _ref: asset._id },
      });
    }

    /* ---------- FINAL IMAGES ARRAY ---------- */
    const images = [
      ...existingImages.map((img: any) => ({
        _type: "image",
        _key: img._key,
        asset: { _type: "reference", _ref: img._ref },
      })),
      ...newImageRefs,
    ];

    /* ---------- PATCH VEHICLE ---------- */
    await writeClient
      .patch(id)
      .set({
        brand: { _type: "reference", _ref: brand },
        model: { _type: "reference", _ref: model },
        fuel: { _type: "reference", _ref: fuel },
        gearbox: { _type: "reference", _ref: gearbox },
        color: color ? { _type: "reference", _ref: color } : undefined,

        price,
        year,
        kilometers,
        engineSize,
        powerKW,
        doors,
        seats,
        description,
        images,
      })
      .commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT vehicle error:", err);
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
  }
}

/* =====================================================
   DELETE – delete vehicle
===================================================== */
export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Delete vozilo
    await writeClient.delete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE vehicle error:", err);
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
  }
}