import { defineField, defineType } from "sanity";

export const fanPostType = defineType({
    name: "fanPost",
    title: "Fan Posts",
    type: "document",
    fields: [
        defineField({
            name: "content",
            title: "Content",
            type: "text",
            validation: (Rule) => Rule.required().max(500),
        }),
        defineField({
            name: "authorId",
            title: "Author ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "authorName",
            title: "Author Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "imageUrl",
            title: "Image URL",
            type: "url",
        }),
        defineField({
            name: "fixtureId",
            title: "Fixture ID",
            type: "string",
        }),
        defineField({
            name: "likes",
            title: "Likes",
            type: "array",
            of: [{ type: "string" }],
        }),
        defineField({
            name: "likesCount",
            title: "Likes Count",
            type: "number",
            initialValue: 0,
        }),
        defineField({
            name: "commentsCount",
            title: "Comments Count",
            type: "number",
            initialValue: 0,
        }),
        defineField({
            name: "flaggedBy",
            title: "Flagged By",
            type: "array",
            of: [{ type: "string" }],
        }),
        defineField({
            name: "flagCount",
            title: "Flag Count",
            type: "number",
            initialValue: 0,
        }),
        defineField({
            name: "isPinned",
            title: "Is Pinned",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "isHidden",
            title: "Is Hidden",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Active", value: "active" },
                    { title: "Hidden", value: "hidden" },
                    { title: "Deleted", value: "deleted" },
                ],
            },
            initialValue: "active",
        }),
    ],
    preview: {
        select: {
            title: "authorName",
            subtitle: "content",
            status: "status",
            isPinned: "isPinned",
        },
        prepare({ title, subtitle, status, isPinned }) {
            const pin = isPinned ? "📌 " : "";
            return {
                title: `${pin}${title}`,
                subtitle: `[${status}] ${subtitle?.substring(0, 80)}...`,
            };
        },
    },
    orderings: [
        {
            title: "Newest First",
            name: "createdAtDesc",
            by: [{ field: "_createdAt", direction: "desc" }],
        },
        {
            title: "Most Liked",
            name: "likesCountDesc",
            by: [{ field: "likesCount", direction: "desc" }],
        },
    ],
});
