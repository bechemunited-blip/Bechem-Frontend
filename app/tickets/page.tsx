import ComingSoonPage from "@/components/pages/ComingSoonPage";

export const metadata = {
    title: "Stay Tuned - BUFC Tickets",
    description: "Ticketing for Bechem United FC matches is coming soon.",
};

export default function TicketsComingSoon() {
    return (
        <ComingSoonPage
            context="tickets"
            title="TICKETING"
            description="We're currently finalizing our digital ticketing system to give you the best matchday experience. Sign up below to be the first to know when tickets go on sale."
        />
    );
}
