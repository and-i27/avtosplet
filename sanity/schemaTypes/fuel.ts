import { defineType } from "sanity";

export const fuel = defineType({
  name: "fuel",
  title: "Fuel",
  type: "document",
  fields: [{ name: "name", title: "Name", type: "string", validation: (r) => r.required() }],
});