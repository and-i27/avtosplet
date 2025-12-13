import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CITROEN_BRAND_ID = "brand-citroen";

type CitroenModelSeed = {
  name: string;
  description: string;
};

const citroenModels: CitroenModelSeed[] = [
  { name: "C1", description: "Majhen mestni avtomobil." },
  { name: "C3", description: "Kompaktni hatchback z urbanim dizajnom." },
  { name: "C3 Aircross", description: "Majhen SUV z značilnim stilom." },
  { name: "C4", description: "Kompaktni hatchback z naprednimi tehnologijami." },
  { name: "ë-C4", description: "Električna različica modela C4." },
  { name: "C4 X", description: "Limuzina s SUV pridihom." },
  { name: "C5 Aircross", description: "SUV srednjega razreda z udobnim podvozjem." },
  { name: "C5 X", description: "Kombinacija limuzine, karavana in SUV-ja." },
  { name: "Berlingo", description: "Večnamensko vozilo za družine ali podjetja." },
  { name: "ë-Berlingo", description: "Električna različica Berlinga." },
  { name: "SpaceTourer", description: "Prostoren enoprostorec za družine ali podjetja." },
  { name: "ë-SpaceTourer", description: "Električna različica SpaceTourerja." },
  { name: "Jumpy", description: "Dostavno vozilo srednje velikosti." },
  { name: "ë-Jumpy", description: "Električno dostavno vozilo." },
  { name: "Ami", description: "Mikro mestno električno vozilo." },
  { name: "C-Zero", description: "Majhen električni avtomobil." },
  { name: "DS3 (pre-Citroen)", description: "Luksuzna kompaktna limuzina iz DS serije." },
  { name: "Cactus", description: "Kreativni in drzen kompaktni crossover." },
  { name: "Saxo", description: "Kompaktni avtomobil iz 90-ih." },
  { name: "Xantia", description: "Limuzina z legendarno hidropnevmatsko vzmetenje." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of citroenModels) {
      const id = `model-${normalize(model.name)}-${CITROEN_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: CITROEN_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Citroën models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("CITROEN MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Citroën model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
