"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/layout/PageHeader";
import SectionHeader from "@/components/layout/SectionHeader";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/auth";
import { User } from "@/lib/api/types";
import ActivityFeed from "@/components/community/ActivityFeed";
import PaymentModal from "@/components/ui/PaymentModal";

// Mock Data
const MATCH_HISTORY = [
    {
        id: 1,
        date: "2025-10-15",
        opponent: "Asante Kotoko",
        result: "Win",
        score: "2 - 1",
        attendance: "Full House",
    },
    {
        id: 2,
        date: "2025-10-08",
        opponent: "Hearts of Oak",
        result: "Draw",
        score: "1 - 1",
        attendance: "High",
    },
    {
        id: 3,
        date: "2025-10-01",
        opponent: "Medeama SC",
        result: "Win",
        score: "3 - 0",
        attendance: "Moderate",
    },
];

const SEASON_TICKET = {
    season: "2025/2026",
    seat: "Section A, Row 5, Seat 12",
    type: "Gold Member",
    status: "Active",
    renewalDate: "2026-08-01",
};

const TABS = [
    { id: "activity", label: "Activity Feed", icon: "ph:activity-duotone" },
    { id: "matches", label: "Match History", icon: "ph:soccer-ball-duotone" },
    { id: "tickets", label: "Season Tickets", icon: "ph:ticket-duotone" },
    { id: "impact", label: "My Impact", icon: "ph:hand-heart-duotone" },
    { id: "settings", label: "Settings", icon: "ph:gear-duotone" },
];

export default function CommunityDashboard() {
    const { user, token, logout, isAuthenticated, isLoading, updateUser } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("activity");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentModalMode, setPaymentModalMode] = useState<"volunteer" | "donate">("donate");
    const [selectedProjectTitle, setSelectedProjectTitle] = useState("General Support");

    const openPaymentModal = (mode: "volunteer" | "donate", project?: string) => {
        setPaymentModalMode(mode);
        setSelectedProjectTitle(project || "General Supporters Fund");
        setIsPaymentModalOpen(true);
    };

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-1">
                <Icon icon="line-md:loading-twotone-loop" className="w-12 h-12 text-primary" />
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case "activity":
                return <ActivityTab />;
            case "matches":
                return <MatchHistoryTab />;
            case "tickets":
                return <SeasonTicketsTab />;
            case "impact":
                return <ImpactTab user={user!} onAction={openPaymentModal} />;
            case "settings":
                return (
                    <SettingsTab
                        user={user!}
                        token={token!}
                        onUpdate={(updatedUser) => updateUser(updatedUser)}
                    />
                );
            default:
                return <ActivityTab />;
        }
    };

    return (
        <div className="bg-neutral-1 min-h-screen pb-20">
            <PageHeader
                title={`Welcome, ${user?.name?.split(' ')[0] || 'Hunter'}`}
                subtitle="Manage your community profile, match history, and season tickets."
                staticImage={user?.headerImage}
                variant="standard"
            />

            <div className="container-wide py-12 md:py-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    <aside className={`lg:w-72 shrink-0 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 fixed inset-y-0 left-0 z-50 bg-white shadow-xl p-4 w-72 overflow-y-auto' : 'hidden lg:block'}`}>
                        <Card variant="default" padding="none" cardClassName="sticky lg:top-24 overflow-hidden">
                            <div className="p-8 bg-primary text-white text-center">
                                <div className="relative w-24 h-24 mx-auto mb-4">
                                    <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center border-2 border-primary/20 overflow-hidden relative">
                                        {user?.avatar ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Icon icon="ph:user-duotone" className="w-12 h-12" />
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-primary z-10" />
                                </div>
                                <h3 className="font-mona-sans font-bold text-xl mb-1 line-clamp-1">{user?.name}</h3>
                                <p className="text-white/70 text-xs font-bold uppercase tracking-wider">
                                    {user?.role === 'admin' ? 'Administrator' : 'Fan Member'} • Since {new Date(user?.createdAt || "2024-01-01").getFullYear()}
                                </p>
                            </div>

                            <nav className="p-4 space-y-1">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                            ? 'bg-primary/10 text-primary border border-primary/20'
                                            : 'text-neutral-6 hover:bg-neutral-2 hover:text-neutral-9'
                                            }`}
                                    >
                                        <Icon icon={tab.icon} className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary' : 'text-neutral-4'}`} />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>

                            <div className="p-4 border-t border-neutral-3">
                                <button
                                    onClick={() => logout()}
                                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all font-montserrat uppercase tracking-widest text-[10px]"
                                >
                                    <Icon icon="ph:sign-out-duotone" className="w-5 h-5" />
                                    Log Out
                                </button>
                            </div>
                        </Card>
                    </aside>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-neutral-3 w-full mb-4">
                        <span className="font-bold text-lg text-neutral-9 capitalize">{TABS.find(t => t.id === activeTab)?.label}</span>
                        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-neutral-2 rounded-lg text-neutral-6">
                            <Icon icon="ph:list-bold" className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                {activeTab === "activity" ? (
                                    renderContent()
                                ) : (
                                    <Card variant="default" padding="lg" cardClassName="min-h-[600px] border-neutral-3 shadow-sm">
                                        {renderContent()}
                                    </Card>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                projectTitle={selectedProjectTitle}
                initialMode={paymentModalMode}
            />
        </div>
    );
}

function ActivityTab() {
    return <ActivityFeed />;
}

function MatchHistoryTab() {
    return (
        <div className="space-y-8">
            <SectionHeader title="Match History" showLine uppercase />
            <div className="overflow-hidden rounded-2xl border border-neutral-3">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="bg-neutral-2 border-b border-neutral-3 text-left text-xs font-bold text-neutral-5 uppercase tracking-wider">
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6">Opponent</th>
                                <th className="py-4 px-6">Score</th>
                                <th className="py-4 px-6">Attendance</th>
                                <th className="py-4 px-6">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MATCH_HISTORY.map(match => (
                                <tr key={match.id} className="border-b border-neutral-3 hover:bg-neutral-1 transition-colors last:border-0">
                                    <td className="py-4 px-6 text-neutral-7 text-sm font-medium">{match.date}</td>
                                    <td className="py-4 px-6 font-bold text-neutral-9">{match.opponent}</td>
                                    <td className="py-4 px-6 text-neutral-9 font-bold font-mono text-lg">{match.score}</td>
                                    <td className="py-4 px-6 text-neutral-6 text-sm">
                                        <span className="inline-flex items-center gap-1">
                                            <Icon icon="ph:users" className="text-neutral-4" /> {match.attendance}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${match.result === "Win" ? "bg-green-100 text-green-700 border border-green-200" :
                                            match.result === "Draw" ? "bg-neutral-2 text-neutral-6 border border-neutral-3" : "bg-red-100 text-red-700 border border-red-200"
                                            }`}>
                                            {match.result}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function SeasonTicketsTab() {
    return (
        <div>
            <SectionHeader title="Season Tickets" showLine uppercase className="mb-8" />
            <div className="bg-linear-to-br from-[#3F2A78] to-[#25184b] rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden max-w-2xl mx-auto border-t border-white/10">
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div>
                        <div className="text-white/60 text-sm font-bold uppercase tracking-wider mb-2">Season</div>
                        <div className="text-4xl md:text-5xl font-black font-mona-sans">{SEASON_TICKET.season}</div>
                    </div>
                    <div className="bg-green-500/20 text-green-400 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase border border-green-500/30">
                        {SEASON_TICKET.status}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-10 mb-10 relative z-10">
                    <div>
                        <div className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Type</div>
                        <div className="text-xl font-bold">{SEASON_TICKET.type}</div>
                    </div>
                    <div>
                        <div className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Seat Location</div>
                        <div className="text-xl font-bold">{SEASON_TICKET.seat}</div>
                    </div>
                </div>
                <div className="flex items-end justify-between relative z-10 pt-8 border-t border-white/10">
                    <div>
                        <div className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Renewal Date</div>
                        <div className="text-base font-bold font-mono">{SEASON_TICKET.renewalDate}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsTab({ user, token, onUpdate }: { user: User, token: string, onUpdate: (user: User) => void }) {
    const [name, setName] = useState(user.name);
    const [avatar, setAvatar] = useState(user.avatar || "");
    const [headerImage, setHeaderImage] = useState(user.headerImage || "");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'header') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 2MB for base64 safety)
        if (file.size > 2 * 1024 * 1024) {
            setError("Image size too large. Please select an image under 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            if (type === 'avatar') {
                setAvatar(base64String);
            } else {
                setHeaderImage(base64String);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const updatedUser = await authService.updateProfile(token, {
                name,
                avatar,
                headerImage
            });
            onUpdate(updatedUser);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: unknown) {
            setError((err as Error).message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const hasChanges = name !== user.name || avatar !== (user.avatar || "") || headerImage !== (user.headerImage || "");

    return (
        <div className="max-w-2xl mx-auto space-y-10">
            <SectionHeader title="Account Settings" showLine uppercase />

            {success && <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-bold">Profile updated successfully!</div>}
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{error}</div>}

            <div className="space-y-8">
                <h3 className="text-xs font-bold text-neutral-4 uppercase tracking-wider border-b border-neutral-3 pb-3">Profile Customization</h3>

                {/* Profile Picture Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-neutral-1 rounded-2xl border border-neutral-3">
                    <div className="relative w-24 h-24 shrink-0 rounded-full bg-white border-2 border-primary/20 overflow-hidden flex items-center justify-center">
                        {avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatar} alt="Profile preview" className="w-full h-full object-cover" />
                        ) : (
                            <Icon icon="ph:user-duotone" className="w-12 h-12 text-neutral-4" />
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Icon icon="ph:camera-fill" className="text-white w-8 h-8" />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                        </label>
                    </div>
                    <div>
                        <h4 className="font-bold text-neutral-9 mb-1">Profile Picture</h4>
                        <p className="text-xs text-neutral-5 mb-3">Upload a clean face shot to be recognized in match threads.</p>
                        <label className="text-xs font-bold text-primary hover:underline cursor-pointer">
                            Change Avatar
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                        </label>
                    </div>
                </div>

                {/* Header Image Upload */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-neutral-7">Dashboard Banner</h4>
                    <div className="relative w-full h-32 md:h-40 bg-neutral-1 rounded-2xl border border-dotted border-neutral-4 overflow-hidden group">
                        {headerImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={headerImage} alt="Header preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-4">
                                <Icon icon="ph:image-duotone" className="w-10 h-10 mb-2" />
                                <span className="text-xs">No banner set</span>
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                            <Icon icon="ph:upload-simple-bold" className="w-8 h-8 mb-2" />
                            <span className="text-xs font-bold uppercase tracking-widest">Update Banner</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'header')} />
                        </label>
                    </div>
                    <p className="text-[10px] text-neutral-4 italic">Recommended size: 1200x400px. Max size 2MB.</p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xs font-bold text-neutral-4 uppercase tracking-wider border-b border-neutral-3 pb-3">Basic Information</h3>
                <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input label="Email Address" value={user.email} type="email" disabled />
                <div className="pt-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleUpdateProfile}
                        disabled={isLoading || !hasChanges}
                    >
                        {isLoading ? "Updating..." : "Save All Changes"}
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xs font-bold text-neutral-4 uppercase tracking-wider border-b border-neutral-3 pb-3">Security</h3>
                <div className="p-6 bg-neutral-1 rounded-2xl border border-neutral-3">
                    <p className="text-sm text-neutral-6 mb-4">You can change your password to keep your account secure.</p>
                    <Button variant="outline" size="sm">Change Password</Button>
                </div>
            </div>
        </div>
    );
}

// ─── My Impact Tab ────────────────────────────────────────────────────────────
function ImpactTab({ user, onAction }: { user: User, onAction: (mode: "volunteer" | "donate", project?: string) => void }) {
    const BADGES = [
        { icon: "ph:hand-heart-fill", label: "First Volunteer", desc: "Volunteered for your first project", earned: true, color: "text-green-600 bg-green-50 border-green-200" },
        { icon: "ph:currency-circle-dollar-fill", label: "First Donor", desc: "Made your first donation", earned: true, color: "text-blue-600 bg-blue-50 border-blue-200" },
        { icon: "ph:soccer-ball-fill", label: "Match Veteran", desc: "Attended 10+ matches", earned: true, color: "text-primary bg-primary/10 border-primary/20" },
        { icon: "ph:chat-circle-dots-fill", label: "Community Voice", desc: "Posted 20+ times in the feed", earned: false, color: "text-neutral-400 bg-neutral-100 border-neutral-200" },
        { icon: "ph:star-fill", label: "Gold Hunter", desc: "Top 10 contributor this month", earned: false, color: "text-neutral-400 bg-neutral-100 border-neutral-200" },
        { icon: "ph:trophy-fill", label: "Legend", desc: "Complete all other badges", earned: false, color: "text-neutral-400 bg-neutral-100 border-neutral-200" },
    ];

    const VOLUNTEER_HISTORY = [
        { project: "School Feeding Programme", role: "Coordinator", hours: 24, date: "Oct 2025", status: "Completed" },
        { project: "Youth Football Academy", role: "Coach Assistant", hours: 16, date: "Sep 2025", status: "Completed" },
        { project: "Community Health Drive", role: "Volunteer", hours: 8, date: "Aug 2025", status: "Ongoing" },
    ];

    const DONATION_HISTORY = [
        { project: "School Feeding Programme", amount: "GHS 200", date: "Oct 2025", method: "Mobile Money" },
        { project: "Community Clean-Up", amount: "GHS 100", date: "Jul 2025", method: "Card" },
    ];

    const totalHours = VOLUNTEER_HISTORY.reduce((s, v) => s + v.hours, 0);
    const rankPct = 68; // mock percentile

    return (
        <div className="space-y-10">
            <SectionHeader title="My Impact" subtext={`${user.name}'s contribution to the Hunters community`} showLine uppercase />

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: "ph:clock-countdown-duotone", label: "Volunteer Hours", value: `${totalHours}h`, color: "text-green-600 bg-green-50" },
                    { icon: "ph:currency-circle-dollar-duotone", label: "Total Donated", value: "GHS 300", color: "text-blue-600 bg-blue-50" },
                    { icon: "ph:hand-heart-duotone", label: "Projects Joined", value: `${VOLUNTEER_HISTORY.length}`, color: "text-primary bg-primary/10" },
                    { icon: "ph:medal-duotone", label: "Badges Earned", value: `${BADGES.filter(b => b.earned).length}/${BADGES.length}`, color: "text-amber-600 bg-amber-50" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl border border-neutral-100 p-5 flex flex-col items-center text-center shadow-sm">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${s.color}`}>
                            <Icon icon={s.icon} className="w-6 h-6" />
                        </div>
                        <div className="text-2xl font-black text-neutral-900 mb-1">{s.value}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Community Rank */}
            <div className="bg-[#3F2A78] rounded-2xl p-6 text-white relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16" />
                <div className="flex-1 relative z-10 w-full">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Community Rank</p>
                            <p className="text-3xl font-black">Top {100 - rankPct}%</p>
                        </div>
                        <div className="text-5xl md:hidden">🏆</div>
                    </div>
                    <div className="bg-white/10 rounded-full h-2.5 mb-2">
                        <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${rankPct}%` }} />
                    </div>
                    <p className="text-white/50 text-xs">You are in the top {100 - rankPct}% of all Hunters community members — keep going! 💛</p>
                </div>

                <div className="shrink-0 flex gap-3 relative z-10 w-full md:w-auto">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onAction("donate")}
                        buttonClassName="!bg-white !text-primary !border-transparent hover:!bg-primary hover:!text-white hover:!border-white transition-all whitespace-nowrap"
                    >
                        Donate Funds
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAction("volunteer")}
                        buttonClassName="!border-white/20 !text-white hover:!bg-white hover:!text-primary transition-all whitespace-nowrap"
                    >
                        Volunteer
                    </Button>
                </div>
            </div>

            {/* Badges */}
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                    <Icon icon="ph:medal-duotone" className="w-4 h-4" /> Badges
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {BADGES.map((b) => (
                        <div
                            key={b.label}
                            className={`flex items-center gap-3 p-4 rounded-2xl border ${b.earned ? b.color : "opacity-40 " + b.color}`}
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/50">
                                <Icon icon={b.icon} className={`w-5 h-5 ${b.color.split(" ")[0]}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-black leading-tight truncate">{b.label}</p>
                                <p className="text-[9px] text-current opacity-60 leading-tight">{b.desc}</p>
                                {!b.earned && <p className="text-[9px] font-bold uppercase tracking-wider opacity-50 mt-0.5">Locked</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Volunteer History */}
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                    <Icon icon="ph:hand-heart-duotone" className="w-4 h-4" /> Volunteer History
                </h3>
                <div className="overflow-hidden rounded-2xl border border-neutral-200">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                            <thead>
                                <tr className="bg-neutral-50 border-b border-neutral-200 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                    <th className="py-3 px-5">Project</th>
                                    <th className="py-3 px-5">Role</th>
                                    <th className="py-3 px-5">Hours</th>
                                    <th className="py-3 px-5">Period</th>
                                    <th className="py-3 px-5">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {VOLUNTEER_HISTORY.map((v, i) => (
                                    <tr key={i} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                                        <td className="py-3 px-5 text-sm font-bold text-neutral-800">{v.project}</td>
                                        <td className="py-3 px-5 text-sm text-neutral-500">{v.role}</td>
                                        <td className="py-3 px-5 text-sm font-black text-primary">{v.hours}h</td>
                                        <td className="py-3 px-5 text-sm text-neutral-400">{v.date}</td>
                                        <td className="py-3 px-5">
                                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${v.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {v.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Donation History */}
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                    <Icon icon="ph:currency-circle-dollar-duotone" className="w-4 h-4" /> Donation History
                </h3>
                <div className="overflow-hidden rounded-2xl border border-neutral-200">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[400px]">
                            <thead>
                                <tr className="bg-neutral-50 border-b border-neutral-200 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                    <th className="py-3 px-5">Project</th>
                                    <th className="py-3 px-5">Amount</th>
                                    <th className="py-3 px-5">Method</th>
                                    <th className="py-3 px-5">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {DONATION_HISTORY.map((d, i) => (
                                    <tr key={i} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                                        <td className="py-3 px-5 text-sm font-bold text-neutral-800">{d.project}</td>
                                        <td className="py-3 px-5 text-sm font-black text-blue-600">{d.amount}</td>
                                        <td className="py-3 px-5 text-sm text-neutral-500">{d.method}</td>
                                        <td className="py-3 px-5 text-sm text-neutral-400">{d.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
