import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const TOYOTA_BRAND_ID = "brand-toyota";

type ToyotaModelSeed = {
  name: string;
  description: string;
};

const toyotaModels: ToyotaModelSeed[] = [
  { name: "Yaris", description: "Kompaktni mestni avtomobil." },
  { name: "Auris", description: "Kompaktni hatchback, vključno s hibridno različico." },
  { name: "Corolla", description: "Ikona med kompaktnih avtomobili." },
  { name: "Camry", description: "Poslovna limuzina z napredno hibridno tehnologijo." },
  { name: "Avensis", description: "Poslovna limuzina in karavan." },
  { name: "C-HR", description: "Kompaktni SUV z edinstvenim dizajnom." },
  { name: "RAV4", description: "SUV srednjega razreda, vključno s hibridnimi različicami." },
  { name: "Land Cruiser", description: "Ikonični terenski SUV z izjemnimi zmogljivostmi." },
  { name: "Hilux", description: "Robusten pickup, idealen za teren in delo." },
  { name: "Prius", description: "Prvi široko dostopen hibridni avtomobil." },
  { name: "Supra", description: "Visokozmogljiv športni avtomobil." },
  { name: "Mirai", description: "Električni avtomobil na vodikove gorivne celice." },
  { name: "Yaris Cross", description: "Kompaktni SUV z značilnostmi Yaris." },
  { name: "GR Yaris", description: "Visokozmogljiv športni hatchback z dirkalnimi koreninami." },
  { name: "GR Supra", description: "Ikonični športni avtomobil, najnovejša generacija Supré." },
  { name: "Sienna", description: "Družinski enoprostorec z odličnimi prostorskimi možnostmi." },
  { name: "Proace", description: "Gospodarski kombi, prilagodljiv za različne naloge." },
  { name: "Proace City", description: "Manjši gospodarski kombi za mestni prevoz." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of toyotaModels) {
      const normalizedName = normalize(model.name);
      const docId = `model-toyota-${normalizedName}`;

      const created = await writeClient.createIfNotExists({
        _id: docId,
        _type: "model",
        name: model.name,
        brand: {
          _type: "reference",
          _ref: TOYOTA_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalizedName,
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Toyota models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("TOYOTA MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Toyota model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
