import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const HYUNDAI_BRAND_ID = "brand-hyundai";

type HyundaiModelSeed = {
  name: string;
  description: string;
};

const hyundaiModels: HyundaiModelSeed[] = [
  { name: "i10", description: "Kompaktni mestni avtomobil." },
  { name: "i20", description: "Kompaktni hatchback z dinamičnim videzom." },
  { name: "i30", description: "Kompaktni hatchback, karavan in fastback." },
  { name: "i40", description: "Limuzina in karavan srednjega razreda." },
  { name: "Bayon", description: "Mestni crossover z modernim slogom." },
  { name: "Kona", description: "Kompaktni SUV z možnostjo električnega pogona." },
  { name: "Kona Electric", description: "Popolnoma električna različica Kone." },
  { name: "Tucson", description: "SUV srednjega razreda z naprednimi tehnologijami." },
  { name: "Santa Fe", description: "Velik SUV z možnostjo 7 sedežev." },
  { name: "Palisade", description: "Luksuzni SUV za ameriški trg." },
  { name: "Ioniq 5", description: "Električni crossover nove generacije." },
  { name: "Ioniq 6", description: "Električna limuzina s futurističnim dizajnom." },
  { name: "Ioniq 7", description: "Prihajajoči električni SUV." },
  { name: "Nexo", description: "SUV na vodikove gorivne celice." },
  { name: "Venue", description: "Kompaktni SUV za mestne vožnje." },
  { name: "Accent", description: "Kompaktna limuzina." },
  { name: "Elantra", description: "Kompaktna limuzina z napredno tehnologijo." },
  { name: "Sonata", description: "Limuzina srednjega razreda." },
  { name: "Azera", description: "Luksuzna limuzina." },
  { name: "Staria", description: "Futuristični enoprostorec in dostavno vozilo." },
  { name: "H-1", description: "Gospodarski kombi in enoprostorec." },
  { name: "iLoad", description: "Gospodarski kombi." },
  { name: "Veloster", description: "Športni coupe s tremi vrati." },
  { name: "Genesis Coupe", description: "Športni coupe pod Genesis znamko (starejši model)." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of hyundaiModels) {
      const id = `model-${normalize(model.name)}-${HYUNDAI_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: HYUNDAI_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Hyundai models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("HYUNDAI MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Hyundai model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
