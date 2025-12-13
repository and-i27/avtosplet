import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const VW_BRAND_ID = "brand-volkswagen";

type VWModelSeed = {
  name: string;
  description: string;
};

const vwModels: VWModelSeed[] = [
  { name: "Golf", description: "Kompaktni hatchback, ikona med avtomobili." },
  { name: "Polo", description: "Majhen mestni hatchback." },
  { name: "Passat", description: "Poslovna limuzina in karavan." },
  { name: "Arteon", description: "Elegantna limuzina in shooting brake." },
  { name: "Tiguan", description: "SUV srednjega razreda." },
  { name: "T-Roc", description: "Kompaktni SUV." },
  { name: "T-Cross", description: "Mali mestni SUV." },
  { name: "Touareg", description: "Luksuzni SUV." },

  { name: "ID.3", description: "Kompaktni električni hatchback." },
  { name: "ID.4", description: "Električni SUV." },
  { name: "ID.5", description: "Električni coupe SUV." },
  { name: "ID.7", description: "Električna limuzina." },

  { name: "Up!", description: "Mali mestni avtomobil." },
  { name: "Beetle", description: "Ikonični retro hatchback." },

  { name: "Multivan", description: "Večnamensko vozilo za družino in delo." },
  { name: "Transporter", description: "Gospodarski kombi za delo in prevoz." },
  { name: "Caddy", description: "Kompakten gospodarski kombi." },
  { name: "Amarok", description: "Pickup z robustnimi terenskimi zmogljivostmi." },
  { name: "California", description: "Kampi kombi za avanture." },
  { name: "Sharan", description: "Družinski enoprostorec." },

  { name: "Scirocco", description: "Športni coupe." },
  { name: "Phaeton", description: "Luksuzna limuzina." },
  { name: "Jetta", description: "Kompaktna limuzina." },
  { name: "CC", description: "Elegantna coupe limuzina." },
  { name: "Eos", description: "Kabriolet." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of vwModels) {
      const normalizedName = normalize(model.name);
      const docId = `model-vw-${normalizedName}`;

      const created = await writeClient.createIfNotExists({
        _id: docId,
        _type: "model",
        name: model.name,
        brand: {
          _type: "reference",
          _ref: VW_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalizedName,
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Volkswagen models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("VOLKSWAGEN MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Volkswagen model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
