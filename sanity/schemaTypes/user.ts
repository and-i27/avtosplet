import { defineType } from "sanity";

export const user = defineType({
  name: "user",
  type: "document",
  title: "User",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
    },
    {
      name: "email",
      type: "string",
      title: "Email",
    },
    {
      name: "password",
      type: "string",
      title: "Password",
      hidden: true, // hide passwords in Sanity Studio
    },
    {
      name: "githubId",
      type: "string",
      title: "GitHub ID",
      hidden: true, // hide in Studio, only for linking accounts
    },
    {
      name: "providers",
      type: "array",
      title: "Login Providers",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Credentials", value: "credentials" },
          { title: "GitHub", value: "github" },
        ],
      },
    },
    {
      name: "emailVerified",
      type: "datetime",
      title: "Email Verified",
      hidden: true,
    },
  ],
});
