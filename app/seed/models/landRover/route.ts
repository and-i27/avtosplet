import { writeClient } from "@/sanity/lib/write-client";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const LANDROVER_BRAND_ID = "brand-land-rover";

type LandRoverModelSeed = {
  name: string;
  description: string;
};

const landRoverModels: LandRoverModelSeed[] = [
  { name: "Defender 90", description: "Kratka različica legendarnega terenca Defender." },
  { name: "Defender 110", description: "Daljša različica Defenderja z več prostora." },
  { name: "Defender 130", description: "Največja različica Defenderja z do 8 sedeži." },
  { name: "Discovery Sport", description: "Kompaktni SUV s terenskimi zmogljivostmi." },
  { name: "Discovery", description: "Prostoren SUV s poudarkom na udobju in terenskih sposobnostih." },
  { name: "Range Rover", description: "Luksuzni SUV z vrhunskim udobjem in terenskimi zmogljivostmi." },
  { name: "Range Rover Sport", description: "Športnejša različica Range Roverja." },
  { name: "Range Rover Velar", description: "Eleganten SUV srednje velikosti z naprednimi tehnologijami." },
  { name: "Range Rover Evoque", description: "Kompaktni SUV z urbanim stilom." },
  { name: "Range Rover Evoque Cabrio", description: "Kabriolet SUV verzija Evoque (prejšnja generacija)." },
  { name: "Freelander 2", description: "SUV prejšnje generacije, znan po praktičnosti." },
  { name: "Series III", description: "Klasični Land Rover iz 70-ih let." },
  { name: "Range Rover Classic", description: "Prvi Range Rover model, ki je postal ikona luksuznih SUV-jev." },
  { name: "Range Rover PHEV", description: "Plug-in hibridna različica Range Roverja." },
  { name: "Defender V8", description: "Najzmogljivejša verzija Defenderja z V8 motorjem." },
  { name: "Discovery Commercial", description: "Gospodarska verzija Discoveryja." },
];

export async function GET() {
  try {
    const results = [];

    for (const model of landRoverModels) {
      const id = `model-${normalize(model.name)}-${LANDROVER_BRAND_ID}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "model",
        name: model.name,
        description: model.description,
        brand: {
          _type: "reference",
          _ref: LANDROVER_BRAND_ID,
        },
        slug: {
          _type: "slug",
          current: normalize(model.name),
        },
      });

      results.push(created);
    }

    return Response.json({
      message: "Land Rover models seeded successfully",
      count: results.length,
    });
  } catch (error) {
    console.error("LAND ROVER MODEL SEED ERROR:", error);
    return Response.json(
      { error: "Land Rover model seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
