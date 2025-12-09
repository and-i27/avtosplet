import { defineType } from "sanity";

export const vehicle = defineType({
  name: "vehicle",
  type: "document",
  title: "Vehicle",
  fields: [
    // --- Basic ---
    {
      name: "brand",
      title: "Znamka",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "model",
      title: "Model",
      type: "string",
      validation: (Rule) => Rule.required(),
    },

    // --- Price / Year / KM ---
    {
      name: "price",
      title: "Cena (€)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    },
    {
      name: "year",
      title: "Letnik",
      type: "number",
      validation: (Rule) => Rule.required().min(1900).max(2200),
    },
    {
      name: "kilometers",
      title: "Prevoženi KM",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    },

    // --- Fuel / Gearbox ---
    {
      name: "fuel",
      title: "Gorivo",
      type: "string",
      options: {
        list: [
          { title: "Bencin", value: "bencin" },
          { title: "Dizel", value: "dizel" },
          { title: "Hibrid", value: "hibrid" },
          { title: "Električni", value: "elektricni" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "gearbox",
      title: "Menjalnik",
      type: "string",
      options: {
        list: [
          { title: "Ročni", value: "rocni" },
          { title: "Avtomatski", value: "avtomatski" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },

    // --- Engine ---
    {
      name: "engineSize",
      title: "Prostornina (CCM)",
      type: "number",
    },
    {
      name: "powerKW",
      title: "Moč (kW)",
      type: "number",
      validation: (Rule) => Rule.required(),
    },

    // --- Car body ---
    {
      name: "doors",
      title: "Število vrat",
      type: "string",
      options: {
        list: [
          { title: "2/3", value: "2-3" },
          { title: "4/5", value: "4-5" },
          { title: "6/7", value: "6-7" },
        ],
      },
    },
    {
      name: "seats",
      title: "Število sedežev",
      type: "number",
      validation: (Rule) => Rule.min(2).max(15),
    },
    {
      name: "color",
      title: "Barva",
      type: "string",
      options: {
    list: [
      { title: "Bela", value: "Bela" },
      { title: "Črna", value: "Črna" },
      { title: "Siva", value: "Siva" },
      { title: "Srebrna", value: "Srebrna" },
      { title: "Modra", value: "Modra" },
      { title: "Rdeča", value: "Rdeča" },
      { title: "Zelena", value: "Zelena" },
      { title: "Rumena", value: "Rumena" },
      { title: "Rjava", value: "Rjava" },
      { title: "Oranžna", value: "Oranžna" },
      { title: "Roza", value: "Roza" },
      { title: "Vijolična", value: "Vijolična" },
    ],
  },
    },

    // --- Description ---
    {
      name: "description",
      title: "Opis",
      type: "text",
    },

    // --- Images ---
    {
      name: "images",
      title: "Slike",
      type: "array",
      of: [{ type: "image" }],
      options: {
        hotspot: true,
      }
    },

    // --- System ---
    {
      name: "user",
      title: "Uporabnik",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "views",
      title: "Ogledi",
      type: "number",
      initialValue: 0,
    }
  ],
});