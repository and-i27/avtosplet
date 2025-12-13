import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const FORD_BRAND_ID = "brand-ford";

type FordModelSeed = {
  name: string;
  description: string;
};

const fordModels: FordModelSeed[] = [
  { name: "Fiesta", description: "Majhen mestni avtomobil z dinamičnim karakterjem." },
  { name: "Focus", description: "Kompaktni hatchback in limuzina z odličnimi voznimi lastnostmi." },
  { name: "Mondeo", description: "Poslovna limuzina z napredno tehnologijo." },
  { name: "Kuga", description: "SUV srednjega razreda." },
  { name: "Puma", description: "Kompaktni SUV s športnimi poudarki." },
  { name: "EcoSport", description: "Majhen SUV za mestne avanture." },
  { name: "Explorer", description: "Velik SUV z veliko zmogljivostmi in prostorom." },
  { name: "Edge", description: "SUV srednjega razreda z bogato opremo." },
  { name: "Mustang", description: "Ikonični športni avtomobil s klasičnim dizajnom." },
  { name: "Mustang Mach-E", description: "Električni SUV s športnimi zmogljivostmi." },
  { name: "Ranger", description: "Pickup z robustnimi terenskimi zmogljivostmi." },
  { name: "Transit", description: "Gospodarski kombi za delo in prevoz." },
  { name: "Tourneo Custom", description: "Večnamenski kombi za družine in podjetja." },
  { name: "Galaxy", description: "Prostorni družinski enoprostorec." },
  { name: "S-Max", description: "Športni enoprostorec za aktivne družine." },
  { name: "Bronco", description: "Ikonični SUV za terensko vožnjo." },
  { name: "Maverick", description: "Kompakten pickup z modernim izgledom." },
  { name: "F-150", description: "Najbolje prodajan pickup v ZDA." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of fordModels) {
      const normalizedName = normalize(model.name);
      const docId = `model-ford-${normalizedName}`;

      const created = await writeClient.createIfNotExists({
        _id: docId,
        _type: "model",
        name: model.name,
        brand: {
          _type: "reference",
          _ref: FORD_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalizedName,
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Ford models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("FORD MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Ford model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
