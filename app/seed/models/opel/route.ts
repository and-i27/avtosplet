import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const OPEL_BRAND_ID = "brand-opel";

type OpelModelSeed = {
  name: string;
  description: string;
};

const opelModels: OpelModelSeed[] = [
  { name: "Corsa", description: "Kompaktni mestni avtomobil." },
  { name: "Astra", description: "Kompaktni hatchback in karavan." },
  { name: "Insignia", description: "Srednje velika limuzina in karavan." },
  { name: "Mokka", description: "Kompaktni SUV z modernim dizajnom." },
  { name: "Crossland", description: "Majhen SUV s prostorno notranjostjo." },
  { name: "Grandland", description: "SUV srednjega razreda." },
  { name: "Zafira Life", description: "Prostoren enoprostorec za več potnikov." },
  { name: "Vivaro", description: "Dostavno in osebno vozilo srednje velikosti." },
  { name: "Combo Life", description: "Večnamensko družinsko vozilo." },
  { name: "Combo Cargo", description: "Dostavno vozilo." },
  { name: "Meriva", description: "Kompaktni enoprostorec." },
  { name: "Antara", description: "SUV iz prejšnjih generacij." },
  { name: "Vectra", description: "Srednje velika limuzina prejšnje generacije." },
  { name: "Kadett", description: "Zgodovinski kompaktni avtomobil." },
  { name: "Omega", description: "Velika limuzina iz 90-ih let." },
  { name: "Calibra", description: "Športni coupe." },
  { name: "Manta", description: "Klasični športni coupe iz 70-ih let." },
  { name: "GT", description: "Kultni roadster." },
  { name: "Cascada", description: "Kabriolet za vožnjo z odprto streho." },
  { name: "Signum", description: "Luksuzna različica Vectre." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of opelModels) {
      const id = `model-${normalize(model.name)}-${OPEL_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: OPEL_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Opel models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("OPEL MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Opel model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
