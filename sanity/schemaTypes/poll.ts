import { defineField, defineType } from "sanity";

export const pollType = defineType({
    name: "poll",
    title: "Polls",
    type: "document",
    fields: [
        defineField({
            name: "question",
            title: "Question",
            type: "string",
            validation: (Rule) => Rule.required().max(500),
        }),
        defineField({
            name: "options",
            title: "Options",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "key",
                            title: "Key",
                            type: "string",
                        }),
                        defineField({
                            name: "text",
                            title: "Text",
                            type: "string",
                        }),
                        defineField({
                            name: "voteCount",
                            title: "Vote Count",
                            type: "number",
                            initialValue: 0,
                        }),
                    ],
                },
            ],
            validation: (Rule) => Rule.required().min(2).max(10),
        }),
        defineField({
            name: "type",
            title: "Type",
            type: "string",
            options: {
                list: [
                    { title: "Single Choice", value: "single_choice" },
                    { title: "Multiple Choice", value: "multiple_choice" },
                ],
            },
            initialValue: "single_choice",
        }),
        defineField({
            name: "createdBy",
            title: "Created By",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "expiresAt",
            title: "Expires At",
            type: "datetime",
        }),
        defineField({
            name: "showResultsBeforeEnd",
            title: "Show Results Before End",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "totalVotes",
            title: "Total Votes",
            type: "number",
            initialValue: 0,
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Draft", value: "draft" },
                    { title: "Active", value: "active" },
                    { title: "Closed", value: "closed" },
                ],
            },
            initialValue: "draft",
        }),
    ],
    preview: {
        select: {
            title: "question",
            status: "status",
            totalVotes: "totalVotes",
        },
        prepare({ title, status, totalVotes }) {
            return {
                title: title || "Untitled Poll",
                subtitle: `[${status}] ${totalVotes || 0} votes`,
            };
        },
    },
});
