import { defineField, defineType } from "sanity";

export const commentType = defineType({
    name: "comment",
    title: "Comments",
    type: "document",
    fields: [
        defineField({
            name: "content",
            title: "Content",
            type: "text",
            validation: (Rule) => Rule.required().max(300),
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
            name: "entityType",
            title: "Entity Type",
            type: "string",
            options: {
                list: [
                    { title: "Fan Post", value: "fan_post" },
                    { title: "Community Project", value: "community_project" },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "entityId",
            title: "Entity ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "parentCommentId",
            title: "Parent Comment ID",
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
            entityType: "entityType",
            status: "status",
        },
        prepare({ title, subtitle, entityType, status }) {
            const typeLabel = entityType === "fan_post" ? "Post" : "Project";
            return {
                title: title || "Unknown Author",
                subtitle: `[${typeLabel} | ${status}] ${subtitle?.substring(0, 60)}...`,
            };
        },
    },
    orderings: [
        {
            title: "Newest First",
            name: "createdAtDesc",
            by: [{ field: "_createdAt", direction: "desc" }],
        },
    ],
});
