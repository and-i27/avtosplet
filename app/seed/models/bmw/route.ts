import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const BMW_BRAND_ID = "brand-bmw";

type BmwModelSeed = {
  name: string;
  description: string;
};

const bmwModels: BmwModelSeed[] = [
  { name: "1 Series", description: "Kompaktni hatchback z dinamičnimi voznimi lastnostmi." },
  { name: "2 Series", description: "Kompaktni coupe, limuzina ali cabrio." },
  { name: "3 Series", description: "Športna limuzina in karavan srednjega razreda." },
  { name: "4 Series", description: "Športni coupe, gran coupe ali cabrio." },
  { name: "5 Series", description: "Poslovna limuzina z luksuznimi dodatki." },
  { name: "6 Series", description: "Luksuzni gran turismo in coupe." },
  { name: "7 Series", description: "Luksuzna limuzina z inovacijami in prestižem." },
  { name: "8 Series", description: "Luksuzni športni coupe, gran coupe in cabrio." },

  { name: "X1", description: "Kompaktni premium SUV." },
  { name: "X2", description: "Športni coupe SUV." },
  { name: "X3", description: "SUV srednjega razreda." },
  { name: "X4", description: "Coupe različica X3." },
  { name: "X5", description: "Luksuzni SUV." },
  { name: "X6", description: "Športni coupe SUV." },
  { name: "X7", description: "Velik luksuzni SUV." },

  { name: "Z4", description: "Športni roadster." },

  { name: "i3", description: "Kompaktni električni mestni avtomobil." },
  { name: "i4", description: "Električni gran coupe." },
  { name: "i5", description: "Električna poslovna limuzina." },
  { name: "i7", description: "Električna luksuzna limuzina." },
  { name: "iX", description: "Električni SUV." },
  { name: "iX1", description: "Kompaktni električni SUV." },
  { name: "iX3", description: "Električna različica X3." },

  { name: "M2", description: "Visokozmogljiv coupe." },
  { name: "M3", description: "Ikonična športna limuzina." },
  { name: "M4", description: "Športni coupe." },
  { name: "M5", description: "Visokozmogljiva poslovna limuzina." },
  { name: "M8", description: "Luksuzni superšportni coupe." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of bmwModels) {
      const normalizedName = normalize(model.name);
      const docId = `model-bmw-${normalizedName}`;

      const created = await writeClient.createIfNotExists({
        _id: docId,
        _type: "model",
        name: model.name,
        brand: {
          _type: "reference",
          _ref: BMW_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalizedName,
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "BMW models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("BMW MODEL SEED ERROR:", error);
    return Response.json(
      { error: "BMW model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
