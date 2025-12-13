import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const MAZDA_BRAND_ID = "brand-mazda";

type MazdaModelSeed = {
  name: string;
  description: string;
};

const mazdaModels: MazdaModelSeed[] = [
  { name: "Mazda2", description: "Kompaktni mestni avtomobil." },
  { name: "Mazda3", description: "Kompaktni hatchback in limuzina z elegantnim dizajnom." },
  { name: "Mazda6", description: "Limuzina in karavan srednjega razreda." },
  { name: "CX-3", description: "Kompaktni SUV z dinamično vožnjo." },
  { name: "CX-30", description: "Crossover med CX-3 in CX-5." },
  { name: "CX-5", description: "SUV srednjega razreda z bogato opremo." },
  { name: "CX-60", description: "SUV z zmogljivimi hibridnimi motorji." },
  { name: "CX-90", description: "Velik SUV z možnostjo 7 sedežev." },
  { name: "MX-30", description: "Popolnoma električni SUV." },
  { name: "MX-5", description: "Ikonični roadster z zadnjim pogonom." },
  { name: "BT-50", description: "Pickup z robustno zasnovo." },
  { name: "RX-8", description: "Športni coupe z Wanklovim motorjem." },
  { name: "RX-7", description: "Legendarni športni coupe z rotacijskim motorjem." },
  { name: "CX-7", description: "SUV starejših generacij." },
  { name: "CX-9", description: "SUV z možnostjo 7 sedežev za družinsko uporabo." },
  { name: "Mazda5", description: "Kompakten enoprostorec." },
  { name: "Mazda Premacy", description: "Enoprostorec prejšnjih generacij." },
  { name: "Eunos Cosmo", description: "Luksuzni coupe z rotacijskim motorjem." },
  { name: "Mazda 323", description: "Kompaktni avtomobil starejših generacij." },
  { name: "Mazda 626", description: "Limuzina in karavan srednjega razreda (preteklost)." },
  { name: "Mazda Demio", description: "Prejšnja generacija Mazda2." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of mazdaModels) {
      const id = `model-${normalize(model.name)}-${MAZDA_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: MAZDA_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Mazda models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("MAZDA MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Mazda model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
