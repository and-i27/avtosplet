import { defineField, defineType } from "sanity";

export const message = defineType({
  name: "message",
  title: "Message",
  type: "document",
  fields: [
    defineField({
      name: "vehicle",
      title: "Vehicle",
      type: "reference",
      to: [{ type: "vehicle" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sender",
      title: "Sender",
      type: "reference",
      to: [{ type: "user" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "recipient",
      title: "Recipient",
      type: "reference",
      to: [{ type: "user" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
      validation: (rule) => rule.required().min(3).max(120),
    }),
    defineField({
      name: "body",
      title: "Message",
      type: "text",
      validation: (rule) => rule.required().min(10).max(2000),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      subject: "subject",
      senderName: "sender.name",
      recipientName: "recipient.name",
    },
    prepare(selection) {
      const { subject, senderName, recipientName } = selection;

      return {
        title: subject || "Message",
        subtitle: `${senderName || "Unknown"} -> ${recipientName || "Unknown"}`,
      };
    },
  },
});
