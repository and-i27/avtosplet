import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const VOLVO_BRAND_ID = "brand-volvo";

type VolvoModelSeed = {
  name: string;
  description: string;
};

const volvoModels: VolvoModelSeed[] = [
  { name: "XC40", description: "Kompaktni SUV s skandinavskim dizajnom." },
  { name: "XC60", description: "SUV srednjega razreda z napredno varnostno opremo." },
  { name: "XC90", description: "Luksuzni SUV z možnostjo 7 sedežev." },
  { name: "V40", description: "Kompaktni hatchback." },
  { name: "V60", description: "Karavan srednjega razreda." },
  { name: "V90", description: "Luksuzni karavan." },
  { name: "S60", description: "Limuzina srednjega razreda." },
  { name: "S90", description: "Luksuzna limuzina." },
  { name: "C40 Recharge", description: "Popolnoma električni coupe SUV." },
  { name: "EX30", description: "Popolnoma električni kompaktni SUV." },
  { name: "EX90", description: "Popolnoma električni luksuzni SUV." },
  { name: "C70", description: "Cabrio/coupe prejšnjih generacij." },
  { name: "850", description: "Ikonični model 90-ih let." },
  { name: "240", description: "Legendarni karavan in limuzina iz 80-ih." },
  { name: "740", description: "Klasični limuzinski in karavanski model." },
  { name: "Amazon", description: "Klasična limuzina iz 60-ih let." },
  { name: "P1800", description: "Ikonični športni coupe." },
  { name: "XC70", description: "Robusten karavan z višjo oddaljenostjo od tal." },
  { name: "V50", description: "Kompaktni karavan." },
  { name: "S40", description: "Kompaktna limuzina." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of volvoModels) {
      const id = `model-${normalize(model.name)}-${VOLVO_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: VOLVO_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Volvo models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("VOLVO MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Volvo model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
