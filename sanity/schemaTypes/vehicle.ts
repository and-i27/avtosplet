import { defineType } from "sanity";

export const vehicle = defineType({
  name: "vehicle",
  type: "document",
  title: "Vehicle",
  fields: [
    {
      name: "title",
      type: "string",
    },
    {
      name: "slug",
      type: "slug",
      options: {
        source: 'title'
      }
    },
    {
      name: "user",
      type: "reference",
      to: { type: 'user'}
    },
    {
      name: "views",
      type: "number",
    },
    {
      name: "description",
      type: "text",
    },
    {
      name: "category",
      type: "string",
      validation: (Rule) => Rule.min(1).max(20).required().error("please enter a category"),
    },
    {
      name: "image",
      type: "url",
    },
  ],
});
