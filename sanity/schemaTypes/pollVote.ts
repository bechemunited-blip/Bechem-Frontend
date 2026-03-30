import { defineField, defineType } from "sanity";

export const pollVoteType = defineType({
    name: "pollVote",
    title: "Poll Votes",
    type: "document",
    fields: [
        defineField({
            name: "pollId",
            title: "Poll ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "userId",
            title: "User ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "selectedOptions",
            title: "Selected Options",
            type: "array",
            of: [{ type: "string" }],
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: "votedAt",
            title: "Voted At",
            type: "datetime",
        }),
    ],
    preview: {
        select: {
            userId: "userId",
            pollId: "pollId",
        },
        prepare({ userId, pollId }) {
            return {
                title: `Vote by ${userId}`,
                subtitle: `Poll: ${pollId}`,
            };
        },
    },
});
