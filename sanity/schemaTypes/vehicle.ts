import { defineType } from "sanity";

export const vehicle = defineType({
  name: "vehicle",
  title: "Vehicle",
  type: "document",
  fields: [
    { name: "brand", type: "reference", to: [{ type: "brand" }], title: "Brand", validation: (r) => r.required() },
    { name: "model", type: "reference", to: [{ type: "model" }], title: "Model", validation: (r) => r.required() },
    { name: "fuel", type: "reference", to: [{ type: "fuel" }], title: "Fuel", validation: (r) => r.required() },
    { name: "gearbox", type: "reference", to: [{ type: "gearbox" }], title: "Gearbox", validation: (r) => r.required() },
    { name: "color", type: "reference", to: [{ type: "color" }], title: "Color" },

    { name: "price", title: "Price", type: "number" },
    { name: "year", title: "Year", type: "number" },
    { name: "kilometers", title: "Kilometers", type: "number" },
    { name: "engineSize", title: "Engine size (ccm)", type: "number" },
    { name: "powerKW", title: "Power (kW)", type: "number" },

    { name: "doors", title: "Doors", type: "number" },
    { name: "seats", title: "Seats", type: "number" },

    { name: "description", title: "Description", type: "text" },

    { name: "images", title: "Images", type: "array", of: [{ type: "image", options: { hotspot: true } }] },

    { name: "views", title: "Views", type: "number", initialValue: 0 },
    { name: "user", title: "User", type: "reference", to: [{ type: "user" }] },
  ],
});