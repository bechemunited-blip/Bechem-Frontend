import CommunityEventsPage from "@/components/pages/CommunityEventsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Community Events | Bechem United FC",
    description: "Discover upcoming community events, RSVP, and connect with fellow Hunters.",
};

export default function EventsPage() {
    return (
        <main className="min-h-screen bg-neutral-100">
            <CommunityEventsPage />
        </main>
    );
}
