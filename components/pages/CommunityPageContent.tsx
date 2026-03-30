"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/layout/PageHeader";
import SectionHeader from "@/components/layout/SectionHeader";
import { CommunityPageSettings, CommunityProject, SanityImage } from "@/lib/types";
import { urlFor } from "@/lib/sanity.client";
import JoinHuntersPack from "@/components/layout/JoinHuntersPack";
import { useUI } from "@/store/hooks/useUI";
import { useAuth } from "@/store/hooks/useAuth";
import { useRouter } from "next/navigation";
import PaymentModal from "@/components/ui/PaymentModal";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

// ── Animated Counter Component ────────────────────────────────────────────────
const AnimatedCounter = ({ value }: { value: string }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Parse the numeric part and suffix (e.g., "5,000+" -> 5000, "+")
    const numericValue = parseFloat(value.replace(/,/g, "").replace(/[^0-9.]/g, "")) || 0;
    const suffix = value.replace(/[0-9.,]/g, "");

    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });

    React.useEffect(() => {
        if (isInView) {
            motionValue.set(numericValue);
        }
    }, [isInView, motionValue, numericValue]);

    const [display, setDisplay] = React.useState("0");

    React.useEffect(() => {
        return springValue.on("change", (latest) => {
            setDisplay(Math.floor(latest).toLocaleString());
        });
    }, [springValue]);

    return (
        <span ref={ref}>
            {display}{suffix}
        </span>
    );
};

// Helper function for date formatting (matching user image)
const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    const j = day % 10, k = day % 100;
    let suffix = "th";
    if (j === 1 && k !== 11) suffix = "st";
    if (j === 2 && k !== 12) suffix = "nd";
    if (j === 3 && k !== 13) suffix = "rd";

    return `${day}${suffix} ${month} ${year}`;
};

// Mock Data for statistics (Fallbacks)
const DUMMY_STATS = [
    { label: "Active Members", value: "5,000+" },
    { label: "Matches Attended", value: "120" },
    { label: "Projects Completed", value: "25" },
    { label: "Lives Impacted", value: "10K+" },
];



// High-quality local placeholders for empty bento slots
const DUMMY_PROJECTS = [
    {
        _id: "dummy-1",
        title: "Elite Youth Academy Development",
        slug: { current: "#" },
        imageUrl: "/img/bufc_stadium.png",
        description: "Empowering the next generation of football stars through structured technical training and academic support."
    },
    {
        _id: "dummy-2",
        title: "Health & Wellness Outreach",
        slug: { current: "#" },
        imageUrl: "/img/fans.jpg",
        description: "Mobile clinics providing essential health screenings and sports medicine advice to rural communities."
    },
    {
        _id: "dummy-3",
        title: "Sustainable Green Initiative",
        slug: { current: "#" },
        imageUrl: "/img/banner.jpg",
        description: "Tree planting and waste management programs to keep our stadium and surrounding environment clean."
    },
    {
        _id: "dummy-4",
        title: "Football For All Tournament",
        slug: { current: "#" },
        imageUrl: "/img/gallery-banner-v2.jpg",
        description: "Uniting local communities through competitive and friendly football matches across the region."
    },
];

interface DummyProject {
    _id: string;
    title: string;
    slug: { current: string };
    imageUrl: string;
    description: string;
}

interface CommunityPageContentProps {
    settings: CommunityPageSettings | null;
    featuredProjects: CommunityProject[];
    joinHuntersPackSettings?: {
        title: string;
        description: string;
        buttonText: string;
        images: Array<{
            image: SanityImage;
            order: number;
        }>;
    };
}

export default function CommunityPageContent({
    settings,
    featuredProjects,
    joinHuntersPackSettings,
}: CommunityPageContentProps) {
    const { openAuthModal } = useUI();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
    const [paymentModalMode, setPaymentModalMode] = React.useState<"volunteer" | "donate">("donate");

    const openPaymentModal = (mode: "volunteer" | "donate") => {
        setPaymentModalMode(mode);
        setIsPaymentModalOpen(true);
    };

    return (
        <div className="w-full">
            {/* Page Header */}
            <PageHeader
                title={settings?.heroTitle || "Community"}
                subtitle={settings?.heroSubtitle || "Detailed information about our community initiatives."}
                backgroundImage={settings?.heroImage}
                variant="standard"
            />

            {/* Intro & Stats Section */}
            <section className="container-wide py-12 md:py-20">
                <div className="flex flex-col items-center text-center mb-16">
                    {/* Community Crowd Image with Text Overlay */}
                    <div className="relative w-full max-w-7xl aspect-square sm:aspect-video md:aspect-[2.35/1] rounded-2xl md:rounded-3xl overflow-hidden mb-8 shadow-xl border-4 border-white flex items-end justify-center">
                        <Image
                            src="/img/fans.jpg"
                            alt="Bechem United Community Support"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Overlay gradient for depth and text readability */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent" />

                        <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 text-center w-full">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase mb-3 md:mb-4 max-w-3xl mx-auto leading-tight drop-shadow-lg">
                                {settings?.heroTitle || "Join Our Community"}
                            </h2>
                            <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto font-medium drop-shadow-md">
                                {settings?.heroSubtitle || "Together we are stronger. Be part of something bigger than just football."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                                {!isAuthenticated ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="lg"
                                            onClick={() => openAuthModal("signup")}
                                            buttonClassName="px-8 py-4 bg-white hover:bg-primary shadow-lg group transition-all duration-300"
                                            textClassName="text-lg font-bold text-primary group-hover:text-white transition-colors duration-300"
                                        >
                                            {settings?.joinButtonText || "Join Community"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="lg"
                                            onClick={() => openAuthModal("signin")}
                                            buttonClassName="px-8 py-4 border-2 border-white hover:bg-white group"
                                            textClassName="text-lg font-bold text-white group-hover:text-primary transition-colors"
                                        >
                                            {settings?.signInButtonText || "Sign In"}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="lg"
                                            onClick={() => openPaymentModal("donate")}
                                            buttonClassName="px-8 py-4 bg-white hover:bg-primary shadow-lg group transition-all duration-300"
                                            textClassName="text-lg font-bold text-primary group-hover:text-white transition-colors duration-300"
                                        >
                                            Donate Funds
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="lg"
                                            onClick={() => openPaymentModal("volunteer")}
                                            buttonClassName="px-8 py-4 border-2 border-white hover:bg-white group"
                                            textClassName="text-lg font-bold text-white group-hover:text-primary transition-colors"
                                        >
                                            Volunteer Now
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto w-full px-4">
                    {(settings?.statistics || DUMMY_STATS).map((stat, idx) => (
                        <Card
                            key={idx}
                            variant="default"
                            padding="lg"
                            cardClassName="text-center group hover:-translate-y-1 h-full min-h-[160px] flex flex-col justify-center items-center"
                        >
                            <div className="font-mona-sans font-black text-4xl md:text-5xl text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                                <AnimatedCounter value={stat.value} />
                            </div>
                            <div className="font-montserrat font-bold text-neutral-5 uppercase tracking-wider text-xs md:text-sm">
                                {stat.label}
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ──── Benefits of Joining ──────────────────────────────────── */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container-wide">
                    <SectionHeader
                        title="Why Join the Hunters Community?"
                        subtext="Become part of something bigger. Here's what you unlock when you sign up."
                        showLine
                        uppercase
                        className="mb-12 md:mb-16"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: "ph:soccer-ball-duotone",
                                iconBg: "bg-primary/10",
                                iconColor: "text-primary",
                                title: "Exclusive Match Threads",
                                desc: "Join live discussions during every Bechem United match with fellow fans. React in real-time, share predictions, and celebrate goals together.",
                            },
                            {
                                icon: "ph:hand-heart-duotone",
                                iconBg: "bg-green-50",
                                iconColor: "text-green-600",
                                title: "Community Impact",
                                desc: "Volunteer for our projects, track your impact hours, and earn recognition badges as a Hunter who gives back to the community.",
                            },
                            {
                                icon: "ph:ticket-duotone",
                                iconBg: "bg-amber-50",
                                iconColor: "text-amber-600",
                                title: "Season Ticket Management",
                                desc: "Manage your season tickets digitally, view seat details, check renewal dates, and access your full attendance history.",
                            },
                            {
                                icon: "ph:microphone-stage-duotone",
                                iconBg: "bg-blue-50",
                                iconColor: "text-blue-600",
                                title: "Player AMAs & Club News",
                                desc: "Get first access to player Ask-Me-Anything sessions, exclusive club announcements, and behind-the-scenes content unavailable elsewhere.",
                            },
                            {
                                icon: "ph:users-three-duotone",
                                iconBg: "bg-rose-50",
                                iconColor: "text-rose-600",
                                title: "Fan Network",
                                desc: "Connect with thousands of Hunters fans across Ghana and the world. Organise supporters' buses, share match memories, and make lifelong friends.",
                            },
                            {
                                icon: "ph:trophy-duotone",
                                iconBg: "bg-purple-50",
                                iconColor: "text-purple-600",
                                title: "Leaderboards & Badges",
                                desc: "Climb the community leaderboard, earn exclusive fan badges, and be recognised as one of the most dedicated Hunters supporters.",
                            },
                        ].map((benefit, idx) => (
                            <div
                                key={idx}
                                className="group p-6 md:p-8 rounded-[24px] border border-neutral-100 hover:border-primary/20 bg-neutral-50 hover:bg-white hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 cursor-default"
                            >
                                <div className={`w-14 h-14 ${benefit.iconBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon icon={benefit.icon} className={`w-7 h-7 ${benefit.iconColor}`} />
                                </div>
                                <h3 className="font-mona-sans font-black text-lg text-neutral-9 mb-3 uppercase tracking-tight leading-snug">
                                    {benefit.title}
                                </h3>
                                <p className="text-sm text-neutral-5 leading-relaxed font-montserrat">
                                    {benefit.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Row */}
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {!isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => openAuthModal("signup")}
                                    className="w-full sm:w-auto px-10 py-4 rounded-full bg-primary text-white font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Join Free Today
                                </button>
                                <button
                                    onClick={() => openAuthModal("signin")}
                                    className="w-full sm:w-auto px-10 py-4 rounded-full border-2 border-neutral-200 text-neutral-7 font-black uppercase tracking-widest text-sm hover:border-primary hover:text-primary transition-all duration-300"
                                >
                                    Already a Member? Sign In
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => openPaymentModal("donate")}
                                    className="w-full sm:w-auto px-10 py-4 rounded-full bg-primary text-white font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Donate to a Project
                                </button>
                                <button
                                    onClick={() => openPaymentModal("volunteer")}
                                    className="w-full sm:w-auto px-10 py-4 rounded-full border-2 border-neutral-200 text-neutral-7 font-black uppercase tracking-widest text-sm hover:border-primary hover:text-primary transition-all duration-300"
                                >
                                    Volunteer With Us
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            <section className="bg-neutral-2 py-16 md:py-24">
                <div className="container-wide">
                    <SectionHeader
                        title={settings?.featuredProjectsTitle || "Featured Projects"}
                        subtext={settings?.featuredProjectsSubtext || "Highlighting our most significant community initiatives."}
                        showLine
                        uppercase
                        className="mb-12"
                    >
                        <Link
                            href="/community/projects"
                            className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-xs md:text-sm uppercase tracking-widest md:tracking-wider"
                        >
                            VIEW ALL <Icon icon="ph:arrow-right" />
                        </Link>
                    </SectionHeader>

                    {/* Bento Grid with Fallbacks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr md:auto-rows-[450px]">
                        {/* Column 1: Hero Project Card */}
                        {(() => {
                            const project = (featuredProjects?.[0] || DUMMY_PROJECTS[0]) as (CommunityProject | DummyProject);
                            const imgSrc = 'featuredImage' in project && project.featuredImage
                                ? urlFor(project.featuredImage).width(600).height(800).url()
                                : (project as DummyProject).imageUrl;

                            const dateLabel = 'startDate' in project && project.startDate
                                ? formatDate(project.startDate)
                                : '_createdAt' in project
                                    ? formatDate(project._createdAt)
                                    : "Featured Initiative";

                            return (
                                <Link
                                    href={project.slug?.current === "#" ? "/community/projects" : `/community/projects/${project.slug?.current}`}
                                    className="group relative overflow-hidden rounded-[32px] shadow-sm hover:shadow-2xl transition-all duration-500 min-h-[400px] md:min-h-0"
                                >
                                    <Image
                                        src={imgSrc}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

                                    {/* Date/Category Badge */}
                                    <div className="absolute top-8 left-8">
                                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/10">
                                            {dateLabel}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-8 left-8 right-8 text-white">
                                        <h3 className="font-mona-sans font-black text-xl mb-2 uppercase leading-snug">
                                            {project.title}
                                        </h3>
                                        <p className="text-white/70 text-sm line-clamp-2">
                                            {'description' in project && typeof project.description === 'string'
                                                ? project.description
                                                : "Driving impact through dedicated community initiatives."}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })()}

                        {/* Column 2: Info Card (Always Present) */}
                        <div className="bg-neutral-9 rounded-[32px] p-10 flex flex-col justify-between text-white shadow-sm hover:shadow-xl transition-all duration-500 order-first lg:order-0">
                            <div>
                                <h3 className="font-mona-sans font-black text-2xl mb-8 uppercase tracking-wide">
                                    NEWS & UPDATES
                                </h3>
                                <div className="space-y-6 text-white/70 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Welcome to the home of Bechem United FC news. Here you&apos;ll find everything from match day coverage and player spotlights to community initiatives and youth development programs that define who we are.
                                    </p>
                                    <p>
                                        The Hunters are more than a team&mdash;we&apos;re a community. Stay updated with news that matters, from the pitch to the people who make this club special.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/news"
                                className="self-end flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium border-b border-transparent hover:border-white/20 pb-1"
                            >
                                Discover more <Icon icon="ph:arrow-up-right-bold" />
                            </Link>
                        </div>

                        {/* Column 3: Nested Nested Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                            {/* Small Card 1 */}
                            {(() => {
                                const project = (featuredProjects?.[1] || DUMMY_PROJECTS[1]) as (CommunityProject | DummyProject);
                                const imgSrc = 'featuredImage' in project && project.featuredImage
                                    ? urlFor(project.featuredImage).width(400).height(400).url()
                                    : (project as DummyProject).imageUrl;
                                return (
                                    <Link
                                        href={project.slug?.current === "#" ? "/community/projects" : `/community/projects/${project.slug?.current}`}
                                        className="relative overflow-hidden rounded-[32px] shadow-sm hover:shadow-lg transition-all min-h-[200px] md:min-h-0"
                                    >
                                        <Image
                                            src={imgSrc}
                                            alt={project.title}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>
                                );
                            })()}

                            {/* Small Card 2 */}
                            {(() => {
                                const project = (featuredProjects?.[2] || DUMMY_PROJECTS[2]) as (CommunityProject | DummyProject);
                                const imgSrc = 'featuredImage' in project && project.featuredImage
                                    ? urlFor(project.featuredImage).width(400).height(400).url()
                                    : (project as DummyProject).imageUrl;
                                return (
                                    <Link
                                        href={project.slug?.current === "#" ? "/community/projects" : `/community/projects/${project.slug?.current}`}
                                        className="relative overflow-hidden rounded-[32px] shadow-sm hover:shadow-lg transition-all min-h-[200px] md:min-h-0"
                                    >
                                        <Image
                                            src={imgSrc}
                                            alt={project.title}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>
                                );
                            })()}

                            {/* Wide Card */}
                            {(() => {
                                const project = (featuredProjects?.[3] || DUMMY_PROJECTS[3]) as (CommunityProject | DummyProject);
                                const imgSrc = 'featuredImage' in project && project.featuredImage
                                    ? urlFor(project.featuredImage).width(800).height(400).url()
                                    : (project as DummyProject).imageUrl;
                                return (
                                    <Link
                                        href={project.slug?.current === "#" ? "/community/projects" : `/community/projects/${project.slug?.current}`}
                                        className="relative col-span-1 sm:col-span-2 overflow-hidden rounded-[32px] shadow-sm hover:shadow-lg transition-all min-h-[200px] md:min-h-0"
                                    >
                                        <Image
                                            src={imgSrc}
                                            alt={project.title}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Mobile Only: View All Button */}
                    <div className="mt-12 flex justify-center md:hidden">
                        <Link
                            href="/community/projects"
                            className="flex items-center gap-2 bg-white px-8 py-4 rounded-full shadow-lg border border-neutral-100 text-primary font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            View All Projects <Icon icon="ph:arrow-right" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Community Activity Teaser (Blurred) */}
            <section className="bg-neutral-100 py-16 md:py-24 relative overflow-hidden group/teaser">
                <div className="container-wide relative z-10">
                    <SectionHeader
                        title={settings?.activityTeaserTitle || "Join conversation"}
                        subtext={settings?.activityTeaserSubtext || "See what our community members are discussing and creating."}
                        showLine
                        uppercase
                        className="mb-24"
                    />

                    <div className="relative max-w-5xl mx-auto min-h-[500px]">
                        {/* Subtle Background Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                            <Image src="/img/fans.jpg" alt="" fill className="object-cover grayscale" />
                        </div>

                        {/* Blurred Timeline Background */}
                        <div className="absolute inset-x-0 top-0 bottom-[-100px] opacity-25 group-hover/teaser:opacity-40 select-none overflow-hidden filter blur-[3px] group-hover/teaser:blur-[1px] transition-all duration-1000">
                            <div className="flex flex-col gap-8 max-w-3xl mx-auto">
                                {[
                                    { user: "Kwame B", time: "2m ago", text: "Match prediction: Bechem 2-0 Hearts. Let's go Hunters!", type: "post" },
                                    { user: "Ama S", time: "15m ago", type: "photo", text: "Ready for the weekend fixture! 💛💜" },
                                    { type: "poll", title: "Man of the Match?", options: ["Hafiz Konkoni", "Augustine Okrah"] },
                                    { user: "Official Bechem FC", time: "1h ago", text: "New training sessions update...", type: "update" },
                                    { user: "Fan Pulse", time: "2h ago", text: "Who's traveling for the away match?", type: "post" },
                                    { user: "Legacy Hunter", time: "3h ago", text: "Remember the 2016 FA Cup win? What a day!", type: "post" }
                                ].map((item, i) => {
                                    const projectImg = featuredProjects[i % featuredProjects.length]?.featuredImage;

                                    return (
                                        <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-200/50 shadow-sm relative overflow-hidden">
                                            {item.type === "photo" && projectImg && (
                                                <div className="absolute inset-0 opacity-20">
                                                    <Image src={urlFor(projectImg).width(400).url()} alt="" fill className="object-cover" />
                                                </div>
                                            )}

                                            <div className="relative z-10">
                                                {item.type !== "poll" && (
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200">
                                                            {projectImg ? (
                                                                <Image src={urlFor(projectImg).width(40).url()} alt="" fill className="object-cover" />
                                                            ) : (
                                                                <Icon icon="ph:user-circle-bold" className="text-neutral-300 w-full h-full" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="h-4 w-24 bg-neutral-200/50 rounded mb-1" />
                                                            <div className="h-3 w-16 bg-neutral-100/50 rounded" />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="space-y-2">
                                                    <div className="h-4 w-full bg-neutral-100/50 rounded" />
                                                    <div className="h-4 w-[85%] bg-neutral-100/50 rounded" />
                                                    {item.type === "poll" && (
                                                        <div className="pt-4 space-y-3">
                                                            <div className="h-10 w-full bg-primary/5 rounded-xl border border-primary/10" />
                                                            <div className="h-10 w-full bg-neutral-50 rounded-xl" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Blurred Content Overlay */}
                        <div className="relative md:absolute md:inset-0 z-20 flex flex-col items-center justify-center py-12 md:py-0 md:-top-12">
                            <div className="text-center max-w-[90%] sm:max-w-md bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border border-neutral-100 ring-1 ring-black/5 overflow-hidden hover:shadow-[0_48px_96px_-24px_rgba(63,42,120,0.15)] hover:translate-y-[-8px] transition-all duration-700 group/card cursor-default">
                                <div className="relative h-32 md:h-44 w-full overflow-hidden">
                                    <Image
                                        src={settings?.huntersHub?.image ? urlFor(settings.huntersHub.image).width(800).url() : "/img/fans.jpg"}
                                        alt=""
                                        fill
                                        className="object-cover group-hover/card:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-primary/60 backdrop-blur-[1px] group-hover/card:bg-primary/50 transition-colors duration-500" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover/card:scale-110 group-hover/card:rotate-12 transition-all duration-700">
                                            <Icon icon="ph:lock-key-duotone" className="w-8 h-8 md:w-10 md:h-10" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 sm:p-10 pt-6 md:pt-8">
                                    <h3 className="font-mona-sans font-black text-2xl md:text-3xl mb-3 md:mb-4 text-neutral-9 uppercase tracking-tight leading-none group-hover/card:text-primary transition-colors">
                                        {settings?.huntersHub?.title || "Hunters Hub"}
                                    </h3>
                                    <p className="text-neutral-5 mb-6 md:mb-10 text-sm md:text-[15px] leading-relaxed font-medium">
                                        {settings?.huntersHub?.description ||
                                            "Join our official internal community for exclusive match threads, player AMAs, and premium content."}
                                    </p>
                                    <Button
                                        fullWidth
                                        onClick={() => isAuthenticated ? router.push("/community/dashboard") : openAuthModal("signup")}
                                        buttonClassName="py-4 md:py-5 text-base md:text-lg font-black uppercase tracking-widest shadow-lg shadow-primary/20 group-hover/card:shadow-primary/30 transition-all"
                                    >
                                        {isAuthenticated ? "Go to My Dashboard" : (settings?.huntersHub?.buttonText || "Create Free Account")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Join the Hunters Pack Component */}
            <JoinHuntersPack
                settings={joinHuntersPackSettings}
                fallbackImages={featuredProjects.map(p => ({ image: p.featuredImage }))}
            />

            {/* CTA Banner */}
            <section className="py-16 md:py-28 bg-[#3F2A78] relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-[#3F2A78] to-[#25184b]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/img/cta_pattern.png')] opacity-10" />

                <div className="container-wide relative z-10 text-center">
                    <h2 className="font-mona-sans font-black text-3xl sm:text-4xl md:text-6xl text-white uppercase mb-6 max-w-4xl mx-auto leading-none">
                        {settings?.ctaTitle || "Ready to make a difference?"}
                    </h2>
                    <p className="font-montserrat text-white/80 text-base md:text-xl max-w-2xl mx-auto mb-10">
                        {settings?.ctaSubtext ||
                            "Join thousands of fans making an impact in our community today."}
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => isAuthenticated ? openPaymentModal("donate") : openAuthModal("signup")}
                        buttonClassName="!bg-white !text-[#3F2A78] border-2 border-transparent hover:!bg-[#3F2A78] hover:!text-white hover:!border-white shadow-2xl font-black uppercase tracking-widest px-10 transition-all duration-300"
                    >
                        {isAuthenticated ? "Contribute Now" : (settings?.ctaButtonText || "Get Involved Now")}
                    </Button>
                </div>
            </section>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                projectTitle="General Community Support"
                initialMode={paymentModalMode}
            />
        </div>
    );
}
