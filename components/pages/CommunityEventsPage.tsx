"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { communityEventsApi, BackendEvent } from "@/lib/api/community";
import PageHeader from "@/components/layout/PageHeader";
import SectionHeader from "@/components/layout/SectionHeader";

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        active: "bg-green-50 text-green-700 border-green-200",
        cancelled: "bg-red-50 text-red-700 border-red-200",
        completed: "bg-neutral-100 text-neutral-500 border-neutral-200",
    };
    return (
        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${styles[status] || styles.active}`}>
            {status}
        </span>
    );
}

// ─── RSVP Button ─────────────────────────────────────────────────────────────
function RsvpButton({
    event,
    userId,
    onRsvp,
    onCancel,
    isSubmitting,
}: {
    event: BackendEvent;
    userId?: string;
    onRsvp: (eventId: string) => void;
    onCancel: (eventId: string) => void;
    isSubmitting: boolean;
}) {
    const myRsvp = event.attendees?.find((a) => a.userId === userId);
    const isWaitlisted = event.waitlist?.some((w) => w.userId === userId);
    const isFull = event.capacity ? event.attendees.filter((a) => a.status === "attending").length >= event.capacity : false;

    if (event.status !== "active") return null;

    if (myRsvp?.status === "attending") {
        return (
            <button
                onClick={() => onCancel(event._id)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all group"
            >
                <Icon icon="ph:check-circle-fill" className="w-4 h-4 group-hover:hidden" />
                <Icon icon="ph:x-circle-fill" className="w-4 h-4 hidden group-hover:block" />
                <span className="group-hover:hidden">Going</span>
                <span className="hidden group-hover:inline">Cancel</span>
            </button>
        );
    }

    if (isWaitlisted) {
        return (
            <button
                onClick={() => onCancel(event._id)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
            >
                <Icon icon="ph:clock-duotone" className="w-4 h-4" />
                Waitlisted
            </button>
        );
    }

    return (
        <button
            onClick={() => onRsvp(event._id)}
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                isFull && !event.waitlistEnabled
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
            }`}
        >
            <Icon icon="ph:hand-waving-duotone" className="w-4 h-4" />
            {isFull ? (event.waitlistEnabled ? "Join Waitlist" : "Full") : "RSVP"}
        </button>
    );
}

// ─── Event Card ──────────────────────────────────────────────────────────────
function EventCard({
    event,
    userId,
    onRsvp,
    onCancel,
    isSubmitting,
}: {
    event: BackendEvent;
    userId?: string;
    onRsvp: (eventId: string) => void;
    onCancel: (eventId: string) => void;
    isSubmitting: boolean;
}) {
    const attendingCount = event.attendees?.filter((a) => a.status === "attending").length || 0;
    const eventDate = new Date(event.date);
    const isPast = eventDate < new Date();
    const month = eventDate.toLocaleString("en", { month: "short" }).toUpperCase();
    const day = eventDate.getDate();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                isPast ? "border-neutral-200 opacity-70" : "border-neutral-200"
            }`}
        >
            <div className="flex flex-col sm:flex-row">
                {/* Date block */}
                <div className="sm:w-24 shrink-0 bg-primary/5 flex flex-row sm:flex-col items-center justify-center gap-1 py-4 sm:py-6 border-b sm:border-b-0 sm:border-r border-neutral-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{month}</span>
                    <span className="text-3xl sm:text-4xl font-black text-primary">{day}</span>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-black text-neutral-900">{event.title}</h3>
                                <StatusBadge status={event.status} />
                            </div>
                            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">{event.description}</p>
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1.5">
                            <Icon icon="ph:clock-duotone" className="w-3.5 h-3.5 text-neutral-400" />
                            {eventDate.toLocaleString("en", { hour: "numeric", minute: "2-digit", hour12: true })}
                        </span>
                        {event.location && (
                            <span className="flex items-center gap-1.5">
                                <Icon icon="ph:map-pin-duotone" className="w-3.5 h-3.5 text-neutral-400" />
                                {event.location}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <Icon icon="ph:users-duotone" className="w-3.5 h-3.5 text-neutral-400" />
                            {attendingCount}{event.capacity ? `/${event.capacity}` : ""} attending
                        </span>
                        {event.waitlist?.length > 0 && (
                            <span className="flex items-center gap-1.5 text-amber-600">
                                <Icon icon="ph:queue-duotone" className="w-3.5 h-3.5" />
                                {event.waitlist.length} waitlisted
                            </span>
                        )}
                    </div>

                    {/* RSVP deadline */}
                    {event.rsvpDeadline && new Date(event.rsvpDeadline) > new Date() && (
                        <p className="text-[10px] text-neutral-400">
                            RSVP by {new Date(event.rsvpDeadline).toLocaleDateString("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                        </p>
                    )}

                    {/* RSVP action */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                        <div className="text-xs text-neutral-400">
                            Posted by {event.authorName}
                        </div>
                        <RsvpButton
                            event={event}
                            userId={userId}
                            onRsvp={onRsvp}
                            onCancel={onCancel}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CommunityEventsPage() {
    const { user, token } = useAuth();
    const [events, setEvents] = useState<BackendEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (!token) {
                setEvents([]);
                return;
            }
            const res = await communityEventsApi.list(token);
            setEvents(res.data || []);
        } catch (err) {
            console.error("Failed to fetch events:", err);
            setError("Could not load events. Please try again.");
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRsvp = useCallback(async (eventId: string) => {
        if (!token || !user) return;
        setSubmittingId(eventId);
        try {
            await communityEventsApi.rsvp(eventId, "attending", token);
            await fetchEvents();
        } catch (err) {
            console.error("RSVP failed:", err);
        } finally {
            setSubmittingId(null);
        }
    }, [token, user]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCancelRsvp = useCallback(async (eventId: string) => {
        if (!token) return;
        setSubmittingId(eventId);
        try {
            await communityEventsApi.cancelRsvp(eventId, token);
            await fetchEvents();
        } catch (err) {
            console.error("Cancel RSVP failed:", err);
        } finally {
            setSubmittingId(null);
        }
    }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

    const now = new Date();
    const filteredEvents = events.filter((e) => {
        if (filter === "upcoming") return new Date(e.date) >= now && e.status === "active";
        if (filter === "past") return new Date(e.date) < now || e.status === "completed";
        return true;
    });

    const FILTERS = [
        { id: "upcoming" as const, label: "Upcoming", icon: "ph:calendar-duotone" },
        { id: "all" as const, label: "All Events", icon: "ph:list-duotone" },
        { id: "past" as const, label: "Past", icon: "ph:clock-countdown-duotone" },
    ];

    return (
        <div className="pb-20">
            <PageHeader
                title="Community Events"
                subtitle="Join upcoming community gatherings, match-day meetups, and volunteer sessions."
                variant="standard"
            />

            <div className="container-wide py-12 md:py-16">
                <SectionHeader title="Events Calendar" subtext="RSVP and connect with fellow Hunters" showLine uppercase />

                {/* Filter bar */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide mt-6 mb-6">
                    {FILTERS.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                                filter === f.id
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "bg-white text-neutral-500 border border-neutral-200 hover:border-primary/30 hover:text-primary"
                            }`}
                        >
                            <Icon icon={f.icon} className="w-3.5 h-3.5" />
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Icon icon="line-md:loading-twotone-loop" className="w-10 h-10 text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <Icon icon="ph:warning-circle-duotone" className="w-12 h-12 mx-auto mb-3 text-red-300" />
                        <p className="text-sm font-medium text-red-500">{error}</p>
                        <button onClick={fetchEvents} className="mt-3 text-xs font-bold text-primary hover:underline">
                            Try again
                        </button>
                    </div>
                ) : !token ? (
                    <div className="text-center py-16 text-neutral-400">
                        <Icon icon="ph:lock-key-duotone" className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                        <p className="text-sm font-medium">Sign in to see community events</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence initial={false}>
                            {filteredEvents.map((event) => (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                    userId={user?.id}
                                    onRsvp={handleRsvp}
                                    onCancel={handleCancelRsvp}
                                    isSubmitting={submittingId === event._id}
                                />
                            ))}
                        </AnimatePresence>

                        {filteredEvents.length === 0 && (
                            <div className="text-center py-16 text-neutral-400">
                                <Icon icon="ph:calendar-x-duotone" className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                                <p className="text-sm font-medium">
                                    {filter === "upcoming" ? "No upcoming events yet." : "No events found."}
                                </p>
                                <p className="text-xs mt-1">Check back later for new community gatherings!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
