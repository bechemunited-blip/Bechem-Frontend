"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { PortableText } from "@portabletext/react";
import { CommunityProject, SanityImage } from "@/lib/types";
import { urlFor } from "@/lib/sanity.client";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/layout/SectionHeader";
import PaymentModal from "@/components/ui/PaymentModal";
import JoinHuntersPack from "@/components/layout/JoinHuntersPack";
import ProjectComments from "@/components/community/ProjectComments";

interface ProjectDetailsContentProps {
    project: CommunityProject;
    relatedProjects: CommunityProject[];
    featuredProjects?: CommunityProject[];
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

export default function ProjectDetailsContent({
    project,
    relatedProjects,
    featuredProjects = [],
    joinHuntersPackSettings,
}: ProjectDetailsContentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"volunteer" | "donate">("volunteer");

    const openModal = (mode: "volunteer" | "donate") => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F1EFF6] pb-20">
            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectTitle={project.title}
                initialMode={modalMode}
            />

            {/* Back Button */}
            <div className="container-wide pt-20 md:pt-32 pb-4 relative z-10">
                <Link
                    href="/community"
                    className="inline-flex items-center gap-2 text-neutral-text font-bold transition-all hover:translate-x-[-4px]"
                >
                    <Icon icon="ph:arrow-left-bold" className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-[10px] md:text-sm uppercase tracking-widest">Go Back</span>
                </Link>
            </div>

            <article className="container-wide">
                {/* Main Content Card */}
                <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-sm p-6 md:p-12 lg:p-16 relative mb-20">
                    {/* Header Section */}
                    <header className="flex flex-col items-center text-center mb-10 md:mb-14">
                        {/* Status/Category */}
                        <div className="flex flex-col items-center gap-2 mb-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${project.status === "Ongoing"
                                ? "bg-green-50 text-green-600 border-green-100"
                                : project.status === "Completed"
                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                    : "bg-primary/5 text-primary border-primary/10"
                                }`}>
                                {project.status || project.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-neutral-text mb-6 max-w-4xl leading-tight uppercase">
                            {project.title}
                        </h1>

                        {/* Social Sharing - Mobile */}
                        <div className="flex lg:hidden gap-3 mb-8">
                            {[
                                { icon: "fa6-brands:instagram", color: "text-[#E1306C]" },
                                { icon: "fa6-brands:facebook-f", color: "text-[#1877F2]" },
                                { icon: "fa6-brands:x-twitter", color: "text-neutral-10" },
                                { icon: "fa6-solid:link", color: "text-neutral-6" },
                            ].map((social, idx) => (
                                <button
                                    key={idx}
                                    className="w-10 h-10 rounded-full bg-neutral-1 flex items-center justify-center shadow-sm border border-neutral-2"
                                >
                                    <Icon icon={social.icon} className={`w-4 h-4 ${social.color}`} />
                                </button>
                            ))}
                        </div>

                        {/* Meta */}
                        <div className="flex items-center justify-center gap-3 text-neutral-5 text-[10px] md:text-xs font-bold uppercase tracking-widest font-montserrat">
                            <span className="flex items-center gap-1.5">
                                <Icon icon="ph:tag-bold" className="w-3.5 h-3.5" />
                                {project.category}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-3" />
                            <span className="flex items-center gap-1.5">
                                <Icon icon="ph:calendar-bold" className="w-3.5 h-3.5" />
                                {project.startDate ? new Date(project.startDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                }) : "Ongoing Initiative"}
                            </span>
                        </div>
                    </header>

                    <div className="relative flex flex-col md:flex-row gap-10 lg:gap-16">
                        {/* Social Sharing - Desktop Vertical */}
                        <div className="hidden lg:flex flex-col gap-4 absolute right--4 xl:right--8 top-0">
                            {[
                                { icon: "fa6-brands:instagram", color: "text-[#E1306C]" },
                                { icon: "fa6-brands:facebook-f", color: "text-[#1877F2]" },
                                { icon: "fa6-brands:x-twitter", color: "text-neutral-10" },
                                { icon: "fa6-solid:link", color: "text-neutral-6" },
                            ].map((social, idx) => (
                                <button
                                    key={idx}
                                    className="w-10 h-10 rounded-full bg-neutral-1 flex items-center justify-center shadow-sm border border-neutral-2 hover:bg-neutral-2 transition-colors"
                                >
                                    <Icon icon={social.icon} className={`w-5 h-5 ${social.color}`} />
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 max-w-3xl mx-auto">
                            {/* Featured Image */}
                            {project.featuredImage && (
                                <div className="relative w-full aspect-video rounded-[32px] overflow-hidden mb-12 shadow-md">
                                    <Image
                                        src={urlFor(project.featuredImage).width(1200).height(675).url()}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}

                            {/* Impact Metrics Quick View (New feature icons) */}
                            {project.impactMetrics && (
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                                    {project.impactMetrics.peopleBenefited && (
                                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 flex flex-col items-center text-center">
                                            <Icon icon="ph:users-three-fill" className="text-primary w-6 h-6 mb-2" />
                                            <div className="text-lg font-black text-neutral-9">{project.impactMetrics.peopleBenefited}</div>
                                            <div className="text-[8px] font-black uppercase tracking-widest text-neutral-4">Beneficiaries</div>
                                        </div>
                                    )}
                                    {project.impactMetrics.fundsRaised && (
                                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 flex flex-col items-center text-center">
                                            <Icon icon="ph:currency-circle-dollar-fill" className="text-green-600 w-6 h-6 mb-2" />
                                            <div className="text-lg font-black text-neutral-9">{project.impactMetrics.fundsRaised}</div>
                                            <div className="text-[8px] font-black uppercase tracking-widest text-neutral-4">Funds Raised</div>
                                        </div>
                                    )}
                                    {project.impactMetrics.volunteerHours && (
                                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 flex flex-col items-center text-center">
                                            <Icon icon="ph:heart-fill" className="text-red-500 w-6 h-6 mb-2" />
                                            <div className="text-lg font-black text-neutral-9">{project.impactMetrics.volunteerHours}</div>
                                            <div className="text-[8px] font-black uppercase tracking-widest text-neutral-4">Volunteer Hours</div>
                                        </div>
                                    )}
                                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex flex-col items-center text-center">
                                        <Icon icon="ph:rocket-fill" className="text-primary w-6 h-6 mb-2" />
                                        <div className="text-lg font-black text-primary">{project.status}</div>
                                        <div className="text-[8px] font-black uppercase tracking-widest text-primary/60">Status</div>
                                    </div>
                                </div>
                            )}

                            {/* Story Content */}
                            <div className="prose prose-neutral max-w-none">
                                <div className="text-neutral-8 leading-relaxed">
                                    <PortableText
                                        value={project.description || []}
                                        components={{
                                            block: {
                                                h2: ({ children }) => (
                                                    <h2 className="text-xl md:text-2xl font-black text-neutral-text mt-12 mb-6 uppercase tracking-tight">
                                                        {children}
                                                    </h2>
                                                ),
                                                normal: ({ children }) => (
                                                    <p className="text-sm md:text-base text-neutral-7 mb-6 leading-relaxed">
                                                        {children}
                                                    </p>
                                                ),
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Call to Action Section (Matching News Sidebar colors) */}
                            <div className="mt-16 p-8 md:p-12 rounded-[32px] bg-neutral-9 text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-tight">Support This Initiative</h3>
                                    <p className="text-white/60 text-sm md:text-base mb-8 max-w-xl">
                                        Our community projects are made possible through the support of fans like you.
                                        Join our mission to create a lasting positive impact in Bechem and beyond.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            onClick={() => openModal("volunteer")}
                                            buttonClassName="!bg-white !text-neutral-9 border-2 border-transparent hover:!bg-[#3F2A78] hover:!text-white hover:!border-white px-8 py-4 font-bold uppercase tracking-widest text-xs transition-all duration-300"
                                        >
                                            Volunteer Now
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => openModal("donate")}
                                            buttonClassName="!border-white/20 !text-white hover:!bg-[#3F2A78] hover:!text-white hover:!border-white px-8 py-4 font-bold uppercase tracking-widest text-xs transition-all duration-300"
                                        >
                                            Donate Funds
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Community Reactions & Comments */}
                    <ProjectComments projectId={project._id} projectTitle={project.title} />

                </div>

                {/* Related Projects Section (Matching News Style) */}
                {relatedProjects.length > 0 && (
                    <div className="mt-10">
                        <div className="mb-10">
                            <SectionHeader
                                title="Continue Exploring"
                                subtext="Discover more significant initiatives led by the Bechem United community."
                                showLine
                                uppercase
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProjects.map((p) => (
                                <Link
                                    key={p._id}
                                    href={`/community/projects/${p.slug.current}`}
                                    className="group flex flex-col"
                                >
                                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-[24px] mb-5 shadow-sm">
                                        {p.featuredImage ? (
                                            <Image
                                                src={urlFor(p.featuredImage).width(600).height(450).url()}
                                                alt={p.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-2 flex items-center justify-center">
                                                <Icon icon="ph:image-fill" className="w-12 h-12 text-neutral-4" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-neutral-9">
                                                {p.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-neutral-text text-[15px] font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug uppercase tracking-tight">
                                            {p.title}
                                        </h4>
                                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${p.status === "Ongoing" ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-neutral-5 uppercase tracking-wider">
                                                {p.startDate ? new Date(p.startDate).getFullYear() : "Current"}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Join the Hunters Pack Section */}
                <div className="mt-20">
                    <JoinHuntersPack
                        settings={joinHuntersPackSettings}
                        fallbackImages={featuredProjects.map(p => ({ image: p.featuredImage }))}
                    />
                </div>
            </article>
        </div>
    );
}
