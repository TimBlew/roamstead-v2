import { defineType, defineField } from "sanity";

export default defineType({
  name: "property",
  title: "Property",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Property Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
