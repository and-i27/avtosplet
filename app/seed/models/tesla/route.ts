import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const TESLA_BRAND_ID = "brand-tesla";

type TeslaModelSeed = {
  name: string;
  description: string;
};

const teslaModels: TeslaModelSeed[] = [
  { name: "Model S", description: "Luksuzna električna limuzina z izjemnim pospeškom." },
  { name: "Model 3", description: "Dostopnejša električna limuzina." },
  { name: "Model X", description: "Luksuzni SUV z značilnimi krilnimi vrati." },
  { name: "Model Y", description: "Kompaktni električni SUV." },
  { name: "Roadster", description: "Športni električni avtomobil, prvi model Tesle." },
  { name: "Roadster (2025)", description: "Novi Roadster z ekstremnimi zmogljivostmi." },
  { name: "Cybertruck", description: "Futuristični električni pickup z robustnim dizajnom." },
  { name: "Semi", description: "Električni tovornjak za dolge razdalje." },
  { name: "Model S Plaid", description: "Ekstremno hitra različica Modela S." },
  { name: "Model 3 Performance", description: "Športna različica Modela 3 z boljšimi zmogljivostmi." },
  { name: "Model X Plaid", description: "Najzmogljivejša različica Modela X." },
  { name: "Model Y Performance", description: "Športna različica Modela Y." },
  { name: "Cybertruck Dual Motor", description: "Cybertruck z dvema motorjema." },
  { name: "Cybertruck Tri Motor", description: "Cybertruck z tremi motorji in maksimalnim dosegom." },
  { name: "Semi Long Range", description: "Različica Semi z večjim dosegom." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of teslaModels) {
      const id = `model-${normalize(model.name)}-${TESLA_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: TESLA_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Tesla models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("TESLA MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Tesla model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
