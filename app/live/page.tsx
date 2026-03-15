import ComingSoonPage from "@/components/pages/ComingSoonPage";

export const metadata = {
    title: "Watch Live - BUFC",
    description: "Live match streaming for Bechem United FC is coming soon.",
};

export default function LiveComingSoon() {
    return (
        <ComingSoonPage
            context="live"
            title="WATCH LIVE"
            description="The Hunters' den is going digital. Our live streaming platform is in the final stages of development. Stay updated to catch every goal as it happens."
        />
    );
}
