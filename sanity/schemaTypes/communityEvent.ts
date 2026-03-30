import { defineField, defineType } from "sanity";

export const communityEventType = defineType({
    name: "communityEvent",
    title: "Community Events",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required().max(200),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            validation: (Rule) => Rule.required().max(5000),
        }),
        defineField({
            name: "location",
            title: "Location",
            type: "string",
        }),
        defineField({
            name: "eventDate",
            title: "Event Date",
            type: "datetime",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "endDate",
            title: "End Date",
            type: "datetime",
        }),
        defineField({
            name: "capacity",
            title: "Capacity",
            type: "number",
        }),
        defineField({
            name: "imageUrl",
            title: "Image URL",
            type: "url",
        }),
        defineField({
            name: "createdBy",
            title: "Created By",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "rsvpDeadline",
            title: "RSVP Deadline",
            type: "datetime",
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Upcoming", value: "upcoming" },
                    { title: "Ongoing", value: "ongoing" },
                    { title: "Completed", value: "completed" },
                    { title: "Cancelled", value: "cancelled" },
                ],
            },
            initialValue: "upcoming",
        }),
        defineField({
            name: "waitlistEnabled",
            title: "Waitlist Enabled",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "attendeeCount",
            title: "Attendee Count",
            type: "number",
            initialValue: 0,
        }),
        defineField({
            name: "waitlistCount",
            title: "Waitlist Count",
            type: "number",
            initialValue: 0,
        }),
    ],
    preview: {
        select: {
            title: "title",
            status: "status",
            eventDate: "eventDate",
            attendeeCount: "attendeeCount",
        },
        prepare({ title, status, eventDate, attendeeCount }) {
            const date = eventDate ? new Date(eventDate).toLocaleDateString() : "No date";
            return {
                title: title || "Untitled Event",
                subtitle: `[${status}] ${date} | ${attendeeCount || 0} attendees`,
            };
        },
    },
    orderings: [
        {
            title: "Event Date (Upcoming)",
            name: "eventDateAsc",
            by: [{ field: "eventDate", direction: "asc" }],
        },
        {
            title: "Event Date (Past)",
            name: "eventDateDesc",
            by: [{ field: "eventDate", direction: "desc" }],
        },
    ],
});
