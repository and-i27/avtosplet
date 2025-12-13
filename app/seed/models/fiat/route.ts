import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const FIAT_BRAND_ID = "brand-fiat";

type FiatModelSeed = {
  name: string;
  description: string;
};

const fiatModels: FiatModelSeed[] = [
  { name: "500", description: "Ikonični mestni avtomobil s sodobnim retro videzom." },
  { name: "500X", description: "Kompaktni SUV z značilnostmi modela 500." },
  { name: "500L", description: "Prostorna različica modela 500 za družinsko rabo." },
  { name: "Panda", description: "Majhen mestni avtomobil, znan po praktičnosti." },
  { name: "Panda 4x4", description: "Terenska različica modela Panda." },
  { name: "Tipo", description: "Kompaktna limuzina in hatchback." },
  { name: "Punto", description: "Popularen kompaktni avtomobil." },
  { name: "Bravo", description: "Kompaktni hatchback prejšnjih generacij." },
  { name: "Doblo", description: "Večnamensko dostavno in družinsko vozilo." },
  { name: "Fiorino", description: "Kompaktno dostavno vozilo." },
  { name: "Ducato", description: "Veliko dostavno vozilo." },
  { name: "Qubo", description: "Kompaktni MPV z veliko prostora." },
  { name: "Uno", description: "Zgodovinski mestni avtomobil iz 80-ih in 90-ih." },
  { name: "Multipla", description: "Družinski MPV z edinstvenim videzom." },
  { name: "Croma", description: "Velika družinska limuzina in karavan." },
  { name: "124 Spider", description: "Športni roadster." },
  { name: "Seicento", description: "Majhen mestni avtomobil." },
  { name: "Grande Punto", description: "Večja različica Punta z modernejšim dizajnom." },
  { name: "Stilo", description: "Kompaktni hatchback in karavan." },
  { name: "Freemont", description: "SUV na osnovi Dodge Journeya." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of fiatModels) {
      const id = `model-${normalize(model.name)}-${FIAT_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: FIAT_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Fiat models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("FIAT MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Fiat model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
