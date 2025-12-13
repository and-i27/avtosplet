import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const HONDA_BRAND_ID = "brand-honda";

type HondaModelSeed = {
  name: string;
  description: string;
};

const hondaModels: HondaModelSeed[] = [
  { name: "Civic", description: "Kompaktni avtomobil z dinamičnimi voznimi lastnostmi." },
  { name: "Accord", description: "Poslovna limuzina z napredno tehnologijo." },
  { name: "CR-V", description: "SUV srednjega razreda, idealen za družinske vožnje." },
  { name: "HR-V", description: "Kompaktni SUV z visokim udobjem in prostornostjo." },
  { name: "Jazz", description: "Kompaktni mestni avtomobil z odličnim izkoristkom prostora." },
  { name: "Pilot", description: "Velik SUV z veliko prostornino za družine." },
  { name: "Ridgeline", description: "Pickup z edinstveno zasnovo in udobjem SUV-a." },
  { name: "Insight", description: "Hibridni avtomobil s poudarkom na varčnosti." },
  { name: "Elysion", description: "Luksuzni enoprostorec z napredno tehnologijo." },
  { name: "Odyssey", description: "Prostoren družinski enoprostorec." },
  { name: "NSX", description: "Visokozmogljiv športni avtomobil." },
  { name: "S660", description: "Kompaktni športni roadster." },
  { name: "Element", description: "Praktičen SUV s prostornim notranjim prostorom." },
  { name: "ZRV", description: "Kompaktni SUV, zasnovan za mestne razmere." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of hondaModels) {
      const normalizedName = normalize(model.name);
      const docId = `model-honda-${normalizedName}`;

      const created = await writeClient.createIfNotExists({
        _id: docId,
        _type: "model",
        name: model.name,
        brand: {
          _type: "reference",
          _ref: HONDA_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalizedName,
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Honda models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("HONDA MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Honda model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
