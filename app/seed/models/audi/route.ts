import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const AUDI_BRAND_ID = "brand-audi";

type AudiModelSeed = {
  name: string;
  description: string;
};

const audiModels: AudiModelSeed[] = [
  { name: "A1", description: "Kompaktni hatchback za mestno vožnjo." },
  { name: "A3", description: "Kompaktni premium hatchback/limuzina." },
  { name: "A4", description: "Srednje velik luksuzni avtomobil." },
  { name: "A5", description: "Športna limuzina in coupe." },
  { name: "A6", description: "Poslovna limuzina z napredno tehnologijo." },
  { name: "A7", description: "Luksuzni coupe limuzina." },
  { name: "A8", description: "Vrhunec luksuza in inovacij." },
  { name: "Q2", description: "Majhen crossover SUV." },
  { name: "Q3", description: "Kompaktni SUV za vsakodnevno vožnjo." },
  { name: "Q5", description: "SUV srednjega razreda." },
  { name: "Q7", description: "Velik luksuzni SUV." },
  { name: "Q8", description: "Luksuzni coupe SUV." },
  { name: "TT", description: "Ikonični športni coupe/roadster." },
  { name: "R8", description: "Visokozmogljiv športni superavto." },
  { name: "RS3", description: "Kompaktni športni hatchback/limuzina." },
  { name: "RS4 Avant", description: "Visokozmogljiv karavan." },
  { name: "RS5", description: "Športni coupe/limuzina." },
  { name: "RS6 Avant", description: "Luksuzni in zmogljiv karavan." },
  { name: "RS7", description: "Zmogljiva luksuzna limuzina." },
  { name: "e-tron", description: "Popolnoma električni SUV." },
  { name: "Q4 e-tron", description: "Kompaktni električni SUV." },
  { name: "e-tron GT", description: "Luksuzni električni športni avto." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of audiModels) {
      const normalizedName = normalize(model.name);

      const docId = `model-audi-${normalizedName}`;

      const created = await writeClient.createIfNotExists({
        _id: docId,
        _type: "model",
        name: model.name,
        brand: {
          _type: "reference",
          _ref: AUDI_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalizedName,
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Audi models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("AUDI MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Audi model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
