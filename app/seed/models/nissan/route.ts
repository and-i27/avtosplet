import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const NISSAN_BRAND_ID = "brand-nissan";

type NissanModelSeed = {
  name: string;
  description: string;
};

const nissanModels: NissanModelSeed[] = [
  { name: "Micra", description: "Kompaktni mestni avtomobil." },
  { name: "Note", description: "Kompaktni enoprostorec z vsestranskostjo." },
  { name: "Juke", description: "Kompaktni crossover z izrazitim videzom." },
  { name: "Qashqai", description: "Priljubljeni kompaktni SUV." },
  { name: "X-Trail", description: "SUV srednjega razreda z možnostjo 7 sedežev." },
  { name: "Murano", description: "SUV z izrazitim dizajnom in udobjem." },
  { name: "Navara", description: "Pickup s terenskimi sposobnostmi." },
  { name: "Leaf", description: "Popolnoma električni mestni avtomobil." },
  { name: "Ariya", description: "Električni SUV z naprednimi tehnologijami." },
  { name: "Almera", description: "Kompaktna limuzina prejšnjih generacij." },
  { name: "Primera", description: "Limuzina in karavan srednjega razreda (preteklost)." },
  { name: "Maxima", description: "Luksuzna limuzina višjega razreda." },
  { name: "Patrol", description: "Velik SUV s terenskimi zmogljivostmi." },
  { name: "GT-R", description: "Legendarni športni avtomobil z oznako Godzilla." },
  { name: "370Z", description: "Športni coupe z V6 motorjem." },
  { name: "350Z", description: "Predhodnik modela 370Z." },
  { name: "Pulsar", description: "Kompaktni hatchback." },
  { name: "Terrano", description: "SUV starejših generacij." },
  { name: "Titan", description: "Velik pickup za ameriški trg." },
  { name: "Cube", description: "Mestni avtomobil z unikatnim dizajnom." },
  { name: "Serena", description: "Družinski enoprostorec." },
  { name: "NV200", description: "Gospodarsko vozilo in kombi." },
  { name: "NV300", description: "Večji gospodarski kombi." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of nissanModels) {
      const id = `model-${normalize(model.name)}-${NISSAN_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: NISSAN_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Nissan models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("NISSAN MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Nissan model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
