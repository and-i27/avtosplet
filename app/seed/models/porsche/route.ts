import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const PORSCHE_BRAND_ID = "brand-porsche";

type PorscheModelSeed = {
  name: string;
  description: string;
};

const porscheModels: PorscheModelSeed[] = [
  { name: "911 Carrera", description: "Legendarni športni avtomobil z ikoničnim dizajnom." },
  { name: "911 Turbo", description: "Visoko zmogljiva različica modela 911." },
  { name: "911 GT3", description: "Športna različica z osredotočenostjo na vožnjo po stezi." },
  { name: "911 Targa", description: "Kombinacija kupeja in kabrioleta z značilno Targa streho." },
  { name: "718 Cayman", description: "Športni coupe z motorjem sredinske postavitve." },
  { name: "718 Boxster", description: "Športni roadster z motorjem sredinske postavitve." },
  { name: "Taycan", description: "Popolnoma električna športna limuzina." },
  { name: "Taycan Cross Turismo", description: "Električni športni karavan s terenskimi dodatki." },
  { name: "Panamera", description: "Luksuzna športna limuzina." },
  { name: "Panamera Sport Turismo", description: "Luksuzni športni karavan." },
  { name: "Macan", description: "Kompaktni športni SUV." },
  { name: "Macan EV", description: "Električna različica Macana." },
  { name: "Cayenne", description: "Športni SUV z izjemnimi zmogljivostmi." },
  { name: "Cayenne Coupe", description: "Športni SUV s kupejevsko silhueto." },
  { name: "Cayenne E-Hybrid", description: "Plug-in hibridna različica Cayenna." },
  { name: "918 Spyder", description: "Hibridni superšportnik." },
  { name: "Carrera GT", description: "Legendarni superšportnik iz prejšnje generacije." },
  { name: "959", description: "Ikonični superšportnik iz 80-ih let." },
  { name: "944", description: "Športni coupe iz 80-ih let." },
  { name: "968", description: "Zadnji razvoj linije 944 z izboljšanimi zmogljivostmi." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of porscheModels) {
      const id = `model-${normalize(model.name)}-${PORSCHE_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: PORSCHE_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Porsche models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("PORSCHE MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Porsche model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
