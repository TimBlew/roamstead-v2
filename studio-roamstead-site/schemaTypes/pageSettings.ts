import { defineType, defineField } from "sanity";

export default defineType({
  name: "pageSettings",
  title: "Page Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageId",
      title: "Page Identifier",
      type: "string",
      description: 'Unique id like "homepage" or "about"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 3,
    }),
  ],
});
