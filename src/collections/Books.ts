import { CollectionConfig } from "payload";

export const Books: CollectionConfig = {
  slug: "books",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "author",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");
            }
            if (value) {
              return value
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");
            }
            return value;
          },
        ],
      },
    },
    {
      name: "description",
      type: "text",
      required: true,
    },
    {
      name: "summary",
      type: "richText",
    },
    {
      name: "topics",
      type: "relationship",
      relationTo: "topics",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "link",
      type: "text",
      admin: {
        position: "sidebar",
      },
    },
  ],
};

export default Books;
