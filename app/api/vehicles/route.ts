import { writeClient } from "@/sanity/lib/write-client";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const brand = formData.get("brand") as string;
    const model = formData.get("model") as string;
    const fuel = formData.get("fuel") as string;
    const gearbox = formData.get("gearbox") as string;
    const color = formData.get("color") as string | null;
    const userId = formData.get("userId") as string;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 🔢 numbers
    const price = Number(formData.get("price"));
    const year = Number(formData.get("year"));
    const kilometers = Number(formData.get("kilometers"));
    const engineSize = Number(formData.get("engineSize"));
    const powerKW = Number(formData.get("powerKW"));
    const doors = Number(formData.get("doors"));
    const seats = Number(formData.get("seats"));

    const description = formData.get("description") as string;

    // 🖼️ upload images
    // 🖼️ upload images
const imageFiles = formData.getAll("images") as File[];
const imageRefs: any[] = [];

for (const file of imageFiles) {
  const asset = await writeClient.assets.upload("image", file, {
    filename: file.name,
  });

  imageRefs.push({
    _key: nanoid(),                    // ✅ OBVEZNO
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  });
}


    const vehicleDoc = {
      _type: "vehicle",
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
      images: imageRefs,
      views: 0,
      user: { _type: "reference", _ref: userId },
    };

    const created = await writeClient.create(vehicleDoc);
    return NextResponse.json(created, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
