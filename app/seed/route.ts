// Script for seeding colors into the Sanity database

import { writeClient } from "@/sanity/lib/write-client";

// Normalize string to create ID
function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Define the structure of a color to be seeded
type ColorSeed = {
  name: string;
  description?: string;
};

const colors: ColorSeed[] = [
  { name: "Bela", description: "Klasična bela barva." },
  { name: "Črna", description: "Klasična črna barva." },
  { name: "Srebrna", description: "Srebrna kovinska barva, pogosto uporabljena pri limuzinah." },
  { name: "Siva", description: "Nevtralna siva barva, primerna za poslovna vozila." },
  { name: "Rdeča", description: "Športna in opazna rdeča barva." },
  { name: "Modra", description: "Elegantna modra barva." },
  { name: "Zelena", description: "Temno zelena barva, primerna za terenska vozila." },
  { name: "Rumena", description: "Živahna rumena barva za izstopajoč videz." },
  { name: "Oranžna", description: "Športna oranžna barva, pogosto uporabljena na športnih modelih." },
  { name: "Vijolična", description: "Redka vijolična barva za poseben izgled." },
  { name: "Bež", description: "Nevtralna bež barva, primerna za klasične modele." },
  { name: "Rjava", description: "Temno rjava barva za robusten izgled." },
  { name: "Mat Črna", description: "Matirana črna barva za sodoben in agresiven videz." },
  { name: "Mat Siva", description: "Matirana siva barva, moderna in elegantna." },
  { name: "Kovinsko Modra", description: "Kovinsko modra barva s svetlečim efektom." },
  { name: "Kovinsko Zelena", description: "Kovinska zelena barva s svetlečim leskom." },
  { name: "Pearl Bela", description: "Perla bela barva z bisernim efektom." },
  { name: "Pearl Črna", description: "Perla črna barva z globokim sijajem." },
  { name: "Kameleon", description: "Posebna barva, ki spreminja odtenke glede na svetlobo." },
  { name: "Saten Črna", description: "Satenasti črn zaključek z mehkim leskom." },
];

// Seed colors into the database with GET
export async function GET() {
  try {
    // Array to hold results
    const results = [];

    // Iterate over each color and create if not exists
    for (const color of colors) {
      const id = `color-${normalize(color.name)}`;

      const created = await writeClient.createIfNotExists({
        _id: id,
        _type: "color",
        name: color.name,
      });

      results.push(created);
    }

    // Return success response with count of seeded colors
    return Response.json({
      message: "Colors seeded successfully",
      count: results.length,
    });
  } catch (error) {
    // Log and return error on failure
    console.error("COLOR SEED ERROR:", error);
    return Response.json(
      { error: "Color seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
