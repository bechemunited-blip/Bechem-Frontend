import { defineField, defineType } from "sanity";

export const eventRsvpType = defineType({
    name: "eventRsvp",
    title: "Event RSVPs",
    type: "document",
    fields: [
        defineField({
            name: "eventId",
            title: "Event ID",
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
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Attending", value: "attending" },
                    { title: "Not Attending", value: "not_attending" },
                    { title: "Maybe", value: "maybe" },
                    { title: "Waitlist", value: "waitlist" },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "respondedAt",
            title: "Responded At",
            type: "datetime",
        }),
    ],
    preview: {
        select: {
            userId: "userId",
            status: "status",
            eventId: "eventId",
        },
        prepare({ userId, status, eventId }) {
            return {
                title: `${userId} - ${status}`,
                subtitle: `Event: ${eventId}`,
            };
        },
    },
});
