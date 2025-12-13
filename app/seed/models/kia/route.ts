import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const KIA_BRAND_ID = "brand-kia";

type KiaModelSeed = {
  name: string;
  description: string;
};

const kiaModels: KiaModelSeed[] = [
  { name: "Picanto", description: "Mestni avtomobil z živahnim dizajnom." },
  { name: "Rio", description: "Kompaktni hatchback z udobjem za vsak dan." },
  { name: "Ceed", description: "Kompaktni hatchback in karavan." },
  { name: "Ceed Sportswagon", description: "Karavan različica priljubljenega Ceeda." },
  { name: "ProCeed", description: "Shooting Brake s športnim pridihom." },
  { name: "Stonic", description: "Kompaktni SUV za mestne avanture." },
  { name: "Sportage", description: "SUV srednjega razreda s sodobnim videzom." },
  { name: "Sorento", description: "Velik SUV z možnostjo 7 sedežev." },
  { name: "EV6", description: "Električni crossover z naprednimi tehnologijami." },
  { name: "Niro", description: "Kompaktni SUV z možnostjo hibridnega in električnega pogona." },
  { name: "e-Niro", description: "Popolnoma električna različica Niro." },
  { name: "XCeed", description: "Crossover različica Ceed linije." },
  { name: "Seltos", description: "SUV srednjega razreda (v določenih regijah)." },
  { name: "Carnival", description: "Večnamenski enoprostorec." },
  { name: "Soul", description: "Kompaktni crossover z značilnim dizajnom." },
  { name: "e-Soul", description: "Električna različica Soul." },
  { name: "Optima", description: "Limuzina srednjega razreda (predhodnik K5)." },
  { name: "K5", description: "Sodobna limuzina z naprednimi funkcijami." },
  { name: "Stinger", description: "Športni fastback s poudarkom na zmogljivosti." },
  { name: "Telluride", description: "Velik SUV za ameriški trg." },
  { name: "Mohave", description: "Velik SUV s terenskimi zmogljivostmi." },
  { name: "Cadenza", description: "Luksuzna limuzina." },
  { name: "K900", description: "Luksuzna limuzina višjega razreda." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of kiaModels) {
      const id = `model-${normalize(model.name)}-${KIA_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: KIA_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Kia models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("KIA MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Kia model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
