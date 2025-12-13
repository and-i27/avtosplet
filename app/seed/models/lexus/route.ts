import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const LEXUS_BRAND_ID = "brand-lexus";

type LexusModelSeed = {
  name: string;
  description: string;
};

const lexusModels: LexusModelSeed[] = [
  { name: "UX", description: "Kompaktni luksuzni SUV." },
  { name: "NX", description: "SUV srednjega razreda s hibridnim pogonom." },
  { name: "RX", description: "Luksuzni SUV z naprednimi hibridnimi opcijami." },
  { name: "LX", description: "Luksuzni SUV s terenskimi sposobnostmi." },
  { name: "TX", description: "Velik luksuzni SUV z možnostjo 6 ali 7 sedežev." },
  { name: "GX", description: "Robustni SUV z odličnimi terenskimi lastnostmi." },
  { name: "ES", description: "Luksuzna limuzina srednjega razreda." },
  { name: "IS", description: "Športna limuzina z izrazitim dizajnom." },
  { name: "LS", description: "Vrhunec Lexusove luksuzne limuzinske ponudbe." },
  { name: "RC", description: "Športni coupe z zmogljivimi motorji." },
  { name: "LC", description: "Luksuzni grand tourer coupe." },
  { name: "CT", description: "Kompaktni hibridni hatchback." },
  { name: "RX 500h", description: "Zmogljiva hibridna različica modela RX." },
  { name: "NX 450h+", description: "Plug-in hibridna različica modela NX." },
  { name: "RC F", description: "Športna različica coupeja RC." },
  { name: "LC 500", description: "Vrhunski coupe z atmosferskim V8 motorjem." },
  { name: "IS 500", description: "Limuzina s športnim V8 motorjem." },
  { name: "RZ 450e", description: "Popolnoma električni SUV." },
  { name: "LM", description: "Luksuzni minivan za VIP prevoz." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of lexusModels) {
      const id = `model-${normalize(model.name)}-${LEXUS_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: LEXUS_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Lexus models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("LEXUS MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Lexus model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
