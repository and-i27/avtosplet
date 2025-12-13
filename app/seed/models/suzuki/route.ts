import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const SUZUKI_BRAND_ID = "brand-suzuki";

type SuzukiModelSeed = {
  name: string;
  description: string;
};

const suzukiModels: SuzukiModelSeed[] = [
  { name: "Swift", description: "Kompaktni hatchback z dinamičnim videzom." },
  { name: "Swift Sport", description: "Športna različica modela Swift." },
  { name: "Ignis", description: "Mestni crossover z retro-modernim videzom." },
  { name: "Baleno", description: "Kompakten hatchback z več prostora." },
  { name: "Vitara", description: "Kompaktni SUV z terenskimi sposobnostmi." },
  { name: "Grand Vitara", description: "SUV z resnejšimi terenskimi zmogljivostmi." },
  { name: "S-Cross", description: "Kompaktni SUV s sodobnim dizajnom." },
  { name: "Jimny", description: "Majhen, a zelo sposoben terenski SUV." },
  { name: "Across", description: "SUV na osnovi Toyote RAV4 Plug-in Hybrid." },
  { name: "Alto", description: "Majhen mestni avtomobil." },
  { name: "Celerio", description: "Ekonomičen mestni avtomobil." },
  { name: "Kizashi", description: "Limuzina srednjega razreda." },
  { name: "SX4", description: "Kompaktni crossover." },
  { name: "XL7", description: "SUV z možnostjo 7 sedežev." },
  { name: "Liana", description: "Kompaktni hatchback in limuzina." },
  { name: "Splash", description: "Kompakten mestni avto z višjim sedenjem." },
  { name: "Wagon R", description: "Praktičen mestni enoprostorec." },
  { name: "Carry", description: "Kompaktno gospodarsko vozilo (pickup in kombi)." },
  { name: "APV", description: "Enoprostorec za družinsko ali gospodarsko uporabo." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of suzukiModels) {
      const id = `model-${normalize(model.name)}-${SUZUKI_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: SUZUKI_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Suzuki models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("SUZUKI MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Suzuki model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
