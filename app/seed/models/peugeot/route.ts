import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const PEUGEOT_BRAND_ID = "brand-peugeot";

type PeugeotModelSeed = {
  name: string;
  description: string;
};

const peugeotModels: PeugeotModelSeed[] = [
  { name: "208", description: "Mestni avtomobil z modernim dizajnom in tehnologijo." },
  { name: "2008", description: "Kompaktni SUV z dinamičnim slogom." },
  { name: "308", description: "Kompaktni hatchback in karavan." },
  { name: "3008", description: "SUV srednjega razreda z naprednimi funkcijami." },
  { name: "408", description: "Fastback SUV s prepoznavnim slogom." },
  { name: "5008", description: "Velik SUV s 7 sedeži." },
  { name: "508", description: "Elegantna limuzina in karavan." },
  { name: "Rifter", description: "Večnamensko družinsko vozilo." },
  { name: "Traveller", description: "Velik enoprostorec za potovanja in poslovno uporabo." },
  { name: "Expert", description: "Gospodarski kombi srednje velikosti." },
  { name: "Partner", description: "Kompakten gospodarski kombi." },
  { name: "Boxer", description: "Velik gospodarski kombi." },
  { name: "e-208", description: "Električni mestni avtomobil." },
  { name: "e-2008", description: "Električni kompaktni SUV." },
  { name: "e-Rifter", description: "Električno družinsko vozilo." },
  { name: "e-Traveller", description: "Električni enoprostorec." },
  { name: "e-Expert", description: "Električni gospodarski kombi." },
  { name: "e-Partner", description: "Električni kompaktni gospodarski kombi." },
  { name: "RCZ", description: "Športni coupe z unikatnim dizajnom." },
  { name: "607", description: "Luksuzna limuzina prejšnjih generacij." },
  { name: "106", description: "Kultni mali mestni avtomobil." },
  { name: "206", description: "Priljubljeni hatchback prejšnje generacije." },
  { name: "306", description: "Kompaktni avtomobil prejšnje generacije." },
  { name: "405", description: "Poslovna limuzina prejšnjih let." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of peugeotModels) {
      const normalizedName = normalize(model.name);
      const docId = `model-peugeot-${normalizedName}`;

      const created = await writeClient.createIfNotExists({
        _id: docId,
        _type: "model",
        name: model.name,
        brand: {
          _type: "reference",
          _ref: PEUGEOT_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalizedName,
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Peugeot models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("PEUGEOT MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Peugeot model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
