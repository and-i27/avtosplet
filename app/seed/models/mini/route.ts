import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const MINI_BRAND_ID = "brand-mini";

type MiniModelSeed = {
  name: string;
  description: string;
};

const miniModels: MiniModelSeed[] = [
  { name: "Mini 3-door", description: "Kompaktni in ikonični mestni avtomobil z dinamičnim oblikovanjem." },
  { name: "Mini 5-door", description: "Večja različica 3-vratne Mini, primerna za družine." },
  { name: "Mini Clubman", description: "Kombinacija praktičnosti in šarma, s posebnimi vrati na zadnji strani." },
  { name: "Mini Countryman", description: "SUV različica Mini-ja, z več prostora in zmogljivostmi." },
  { name: "Mini Cabrio", description: "Kabrioletna različica Mini-ja za ljubitelje vožnje z odprto streho." },
  { name: "Mini Electric", description: "Električna različica Mini-ja, ohranila ikoničen dizajn z ekološko prijaznim pogonom." },
  { name: "Mini John Cooper Works", description: "Visoko zmogljiv športni model Mini z vrhunskimi lastnostmi na cesti." },
  { name: "Mini Paceman", description: "Kompaktni SUV-coupe iz preteklosti, z edinstvenim dizajnom." },
  { name: "Mini Roadster", description: "Dvosedežni roadster z izjemno dinamiko vožnje." },
  { name: "Mini Coupe", description: "Kompaktni coupe z športnim izgledom in visoko zmogljivostjo." },
  { name: "Mini Clubman ALL4", description: "All-wheel drive različica Clubmana za boljše terenske zmogljivosti." },
  { name: "Mini Countryman PHEV", description: "Plug-in hibridna različica Mini Countryman z boljšo ekološko učinkovitostjo." },
  { name: "Mini Electric SE", description: "Mestni električni avtomobil s stilom in športnim značajem." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of miniModels) {
      const id = `model-${normalize(model.name)}-${MINI_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: MINI_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Mini models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("MINI MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Mini model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
