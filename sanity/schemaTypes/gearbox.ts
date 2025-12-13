import { defineType } from "sanity";

export const gearbox = defineType({
    name: "gearbox",
  title: "Gearbox",
  type: "document",
  fields: [{ name: "name", title: "Name", type: "string", validation: (r) => r.required() }],
});