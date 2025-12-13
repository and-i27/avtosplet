import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const SKODA_BRAND_ID = "brand-skoda";

type SkodaModelSeed = {
  name: string;
  description: string;
};

const skodaModels: SkodaModelSeed[] = [
  { name: "Fabia", description: "Kompaktni mestni avtomobil z ugodno porabo." },
  { name: "Scala", description: "Kompaktni hatchback z moderno zasnovo." },
  { name: "Octavia", description: "Najbolj priljubljen model, limuzina in karavan." },
  { name: "Superb", description: "Poslovna limuzina in karavan z luksuznimi elementi." },
  { name: "Kamiq", description: "Kompaktni SUV za mestne uporabnike." },
  { name: "Karoq", description: "SUV srednjega razreda s praktičnim pristopom." },
  { name: "Kodiaq", description: "Velik SUV z možnostjo 7 sedežev." },
  { name: "Enyaq iV", description: "Električni SUV nove generacije." },
  { name: "Enyaq Coupé iV", description: "Električni SUV coupe izvedba." },
  { name: "Rapid", description: "Kompaktna limuzina in Spaceback." },
  { name: "Roomster", description: "Večnamenski družinski kombi." },
  { name: "Yeti", description: "Priljubljen kompaktni SUV starejših generacij." },
  { name: "Citigo", description: "Mali mestni avtomobil." },
  { name: "Felicia", description: "Zgodovinski model, limuzina in kombi." },
  { name: "Favorit", description: "Ikonični model iz zgodnjih 90-ih." },
  { name: "120", description: "Klasika iz 80-ih let." },
  { name: "130 RS", description: "Športni model iz Škodine zgodovine." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of skodaModels) {
      const normalizedName = normalize(model.name);
      const docId = `model-skoda-${normalizedName}`;

      const created = await writeClient.createIfNotExists({
        _id: docId,
        _type: "model",
        name: model.name,
        brand: {
          _type: "reference",
          _ref: SKODA_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalizedName,
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Škoda models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("ŠKODA MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Škoda model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
