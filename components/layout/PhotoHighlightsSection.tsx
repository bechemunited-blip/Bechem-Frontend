"use client";

import { GalleryImage, HomePageSettings } from "@/lib/types";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Button from "../ui/Button";

interface PhotoHighlightsSectionProps {
    settings: HomePageSettings;
    images: GalleryImage[];
}

export default function PhotoHighlightsSection({
    settings,
    images,
}: PhotoHighlightsSectionProps) {
    // Use the first 7 featured images or a default slice
    const displayImages = images.slice(0, 7);

    if (displayImages.length === 0) return null;

    return (
        <section className="bg-white pt-8 pb-0 md:py-28 overflow-hidden">
            <div className="container-wide">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-8 mb-4 md:mb-16 lg:mb-24">
                    <div className="flex items-center gap-6">
                        <h2 className="text-[20px] font-bold text-[#1A1A1A] tracking-wider whitespace-nowrap uppercase">
                            {settings.photoHighlightsTitle || "PHOTO HIGHLIGHTS"}
                        </h2>
                        <span className="h-px w-24 md:w-32 lg:w-48 xl:w-64 bg-[#3F2A78]/20" />
                    </div>

                    <div className="md:max-w-md lg:max-w-lg">
                        <p className="text-[14px] lg:text-[16px] text-[#666666] leading-relaxed text-left md:text-right">
                            {settings.photoHighlightsSubtext || "Relive the best moments from recent matches, training sessions, and club events."}
                        </p>
                    </div>
                </div>

                {/* Gallery Grid - Staggered Mockup Layout */}
                <div className="relative h-[350px] md:h-[588px] w-full max-w-[957px] mx-auto">
                    <div className="grid grid-cols-4 gap-3 h-full items-center">
                        {/* Column 1 - Leftmost */}
                        <div className="h-full flex flex-col justify-center">
                            {displayImages[0] && (
                                <div className="relative w-full aspect-220/318 rounded-[10px] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.03]">
                                    <Image
                                        src={urlFor(displayImages[0].image).width(440).height(636).url()}
                                        alt={displayImages[0].altText || "Highlight"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Column 2 */}
                        <div className="h-full flex flex-col justify-center gap-3 -translate-y-8">
                            {displayImages[1] && (
                                <div className="relative w-full aspect-220/328 rounded-[10px] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.03]">
                                    <Image
                                        src={urlFor(displayImages[1].image).width(440).height(656).url()}
                                        alt={displayImages[1].altText || "Highlight"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            {displayImages[2] && (
                                <div className="relative w-full aspect-220/144 rounded-[10px] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.03]">
                                    <Image
                                        src={urlFor(displayImages[2].image).width(440).height(288).url()}
                                        alt={displayImages[2].altText || "Highlight"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Column 3 */}
                        <div className="h-full flex flex-col justify-center gap-3 translate-y-4">
                            {displayImages[3] && (
                                <div className="relative w-full aspect-220/300 rounded-[10px] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.03]">
                                    <Image
                                        src={urlFor(displayImages[3].image).width(440).height(600).url()}
                                        alt={displayImages[3].altText || "Highlight"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            {displayImages[4] && (
                                <div className="relative w-full aspect-220/214 rounded-[10px] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.03]">
                                    <Image
                                        src={urlFor(displayImages[4].image).width(440).height(428).url()}
                                        alt={displayImages[4].altText || "Highlight"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Column 4 - Rightmost */}
                        <div className="h-full flex flex-col justify-center gap-3 -translate-y-12">
                            {displayImages[5] && (
                                <div className="relative w-full aspect-220/132 rounded-[10px] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.03]">
                                    <Image
                                        src={urlFor(displayImages[5].image).width(440).height(264).url()}
                                        alt={displayImages[5].altText || "Highlight"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            {displayImages[6] && (
                                <div className="relative w-full aspect-220/368 rounded-[10px] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.03]">
                                    <Image
                                        src={urlFor(displayImages[6].image).width(440).height(736).url()}
                                        alt={displayImages[6].altText || "Highlight"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Bottom Controls */}
                <div className="mt-8 md:mt-16 flex items-center justify-end w-full max-w-[957px] mx-auto pb-12 md:pb-0">
                    <div className="flex justify-end">
                        <Button
                            href="/gallery"
                            variant="ghost"
                            size="lg"
                            rightIcon={
                                <Icon
                                    icon="ph:arrow-right-bold"
                                    className="w-5 h-5"
                                />
                            }
                            buttonClassName="!p-0 !text-[#1A1A1A] hover:!text-[#3F2A78] transition-all duration-300 font-bold"
                        >
                            {settings.photoHighlightsBtnText || "Explore Gallery"}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
