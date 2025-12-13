import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const JEEP_BRAND_ID = "brand-jeep";

type JeepModelSeed = {
  name: string;
  description: string;
};

const jeepModels: JeepModelSeed[] = [
  { name: "Renegade", description: "Kompaktni SUV s terenskimi zmogljivostmi." },
  { name: "Compass", description: "SUV srednjega razreda z možnostjo 4x4 pogona." },
  { name: "Cherokee", description: "SUV s terenskimi in cestnimi zmogljivostmi." },
  { name: "Grand Cherokee", description: "Luksuzni SUV z izjemnimi terenskimi sposobnostmi." },
  { name: "Grand Cherokee L", description: "Različica Grand Cherokeeja s 3 vrstami sedežev." },
  { name: "Grand Wagoneer", description: "Luksuzni SUV visoke klase." },
  { name: "Wrangler", description: "Ikonični terenski SUV z vrhunskimi terenskimi lastnostmi." },
  { name: "Wrangler 4xe", description: "Plug-in hibridna različica Wranglerja." },
  { name: "Gladiator", description: "Pick-up vozilo na osnovi Wranglerja." },
  { name: "Patriot", description: "SUV prejšnje generacije, znan po dostopnosti." },
  { name: "Commander", description: "SUV z 7 sedeži in robustnim izgledom." },
  { name: "Liberty", description: "SUV, znan tudi kot Cherokee v Evropi." },
  { name: "CJ-7", description: "Kultni terenski model iz 70-ih in 80-ih." },
  { name: "Wagoneer", description: "Velik SUV s poudarkom na luksuzu." },
  { name: "Avenger", description: "Majhen električni SUV nove generacije." },
  { name: "Renegade 4xe", description: "Plug-in hibridna različica modela Renegade." },
  { name: "Compass 4xe", description: "Plug-in hibridna različica modela Compass." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of jeepModels) {
      const id = `model-${normalize(model.name)}-${JEEP_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: JEEP_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Jeep models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("JEEP MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Jeep model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
