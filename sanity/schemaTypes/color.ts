import { defineType } from "sanity";

export const color = defineType({
   name: "color",
  title: "Color",
  type: "document",
  fields: [{ name: "name", title: "Name", type: "string", validation: (r) => r.required() }],
});