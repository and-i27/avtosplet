import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const MERCEDES_BRAND_ID = "brand-mercedes-benz";

type MercedesModelSeed = {
  name: string;
  description: string;
};

const mercedesModels: MercedesModelSeed[] = [
  { name: "A-Class", description: "Kompaktni avtomobil z napredno tehnologijo." },
  { name: "B-Class", description: "Kompaktni enoprostorec." },
  { name: "C-Class", description: "Luksuzna limuzina srednjega razreda." },
  { name: "E-Class", description: "Poslovna limuzina z udobjem in zmogljivostjo." },
  { name: "S-Class", description: "Vrhunska luksuzna limuzina." },

  { name: "CLA", description: "Kompaktna coupe limuzina." },
  { name: "CLS", description: "Coupe limuzina višjega razreda." },

  { name: "GLA", description: "Kompaktni SUV." },
  { name: "GLB", description: "Kompaktni SUV s 7 sedeži." },
  { name: "GLC", description: "SUV srednjega razreda." },
  { name: "GLE", description: "Luksuzni SUV." },
  { name: "GLS", description: "Velik luksuzni SUV." },
  {
    name: "G-Class",
    description:
      "Luksuzni terenski SUV z izjemnimi terenskimi sposobnostmi.",
  },

  { name: "EQC", description: "Električni SUV." },
  { name: "EQA", description: "Kompaktni električni SUV." },
  { name: "EQB", description: "Električni SUV s 7 sedeži." },
  { name: "EQS", description: "Luksuzna električna limuzina." },
  { name: "EQE", description: "Električna poslovna limuzina." },

  { name: "AMG GT", description: "Visokozmogljiv športni coupe." },
  { name: "SL", description: "Luksuzni roadster." },

  {
    name: "V-Class",
    description:
      "Luksuzni kombi za poslovno in družinsko uporabo.",
  },
  { name: "Sprinter", description: "Večji gospodarski kombi." },
  { name: "Citan", description: "Mali gospodarski kombi." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of mercedesModels) {
      const normalizedName = normalize(model.name);
      const docId = `model-mercedes-${normalizedName}`;

      const created = await writeClient.createIfNotExists({
        _id: docId,
        _type: "model",
        name: model.name,
        brand: {
          _type: "reference",
          _ref: MERCEDES_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalizedName,
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Mercedes-Benz models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("MERCEDES MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Mercedes model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
