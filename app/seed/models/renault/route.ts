import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const RENAULT_BRAND_ID = "brand-renault";

type RenaultModelSeed = {
  name: string;
  description: string;
};

const renaultModels: RenaultModelSeed[] = [
  { name: "Clio", description: "Kompaktni mestni avtomobil z bogato zgodovino." },
  { name: "Captur", description: "Kompaktni SUV z možnostjo personalizacije." },
  { name: "Megane", description: "Kompaktni hatchback, karavan in limuzina." },
  { name: "Megane E-Tech", description: "Električni crossover nove generacije." },
  { name: "Kadjar", description: "SUV srednjega razreda." },
  { name: "Austral", description: "SUV naslednik Kadjarja z naprednimi tehnologijami." },
  { name: "Arkana", description: "Crossover coupe z edinstveno zasnovo." },
  { name: "Koleos", description: "Velik SUV z luksuznimi elementi." },
  { name: "Talisman", description: "Poslovna limuzina in karavan." },
  { name: "Espace", description: "Prostorni enoprostorec z bogato opremo." },
  { name: "Scenic", description: "Družinski enoprostorec z modernim dizajnom." },
  { name: "Grand Scenic", description: "Večji družinski enoprostorec." },
  { name: "Zoe", description: "Priljubljeni električni mestni avtomobil." },
  { name: "Twingo", description: "Mali mestni avtomobil z živahnim karakterjem." },
  { name: "Kangoo", description: "Kompakten gospodarski kombi in osebna različica." },
  { name: "Trafic", description: "Gospodarski kombi srednje velikosti." },
  { name: "Master", description: "Velik gospodarski kombi." },
  { name: "Alpine A110", description: "Športni coupe pod Renault Alpine znamko." },
  { name: "Laguna", description: "Poslovna limuzina prejšnjih generacij." },
  { name: "Fluence", description: "Limuzina s klasičnim slogom." },
  { name: "Symbol", description: "Kompaktna limuzina za mednarodne trge." },
  { name: "Modus", description: "Mestni mini-MPV." },
  { name: "Wind", description: "Mali športni roadster." },
  { name: "Vel Satis", description: "Luksuzna limuzina prejšnje generacije." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of renaultModels) {
      const normalizedName = normalize(model.name);
      const docId = `model-renault-${normalizedName}`;

      const created = await writeClient.createIfNotExists({
        _id: docId,
        _type: "model",
        name: model.name,
        brand: {
          _type: "reference",
          _ref: RENAULT_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalizedName,
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Renault models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("RENAULT MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Renault model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
