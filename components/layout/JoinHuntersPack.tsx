"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { urlFor } from "@/lib/sanity.client";
import { SanityImage } from "@/lib/types";

interface JoinHuntersPackProps {
    settings?: {
        title: string;
        description: string;
        buttonText: string;
        images: Array<{
            image: SanityImage;
            order: number;
        }>;
    };
    fallbackImages?: Array<{ image: SanityImage }>;
}

import { useUI } from "@/store/hooks/useUI";
import { useAuth } from "@/store/hooks/useAuth";
import Link from "next/link";

export default function JoinHuntersPack({ settings, fallbackImages }: JoinHuntersPackProps) {
    const { openAuthModal } = useUI();
    const { isAuthenticated } = useAuth();

    const displayTitle = settings?.title || "Join The Hunters Pack";
    const displayDesc = settings?.description || "Be part of something special. Join thousands of passionate fans supporting Bechem United FC at home and away.";
    const displayButton = settings?.buttonText || "Become A Member";
    const images = settings?.images?.sort((a, b) => a.order - b.order) || [];

    return (
        <section className="py-12 md:py-20 px-4 md:px-6 flex justify-center">
            <div className="w-full max-w-[1240px] bg-white rounded-[32px] md:rounded-[40px] p-6 sm:p-10 lg:p-[50px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-neutral-100 hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-[30px]">

                    {/* Left Column: Text + 1 Large Image */}
                    <div className="lg:col-span-4 flex flex-col gap-8 md:gap-10">
                        <div className="space-y-4 md:space-y-6">
                            <h2 className="text-xl sm:text-[22px] font-bold text-neutral-900 leading-[120%] lg:leading-[100%] tracking-normal font-montserrat uppercase">
                                {displayTitle}
                            </h2>
                            <p className="text-neutral-500 text-sm md:text-base font-medium leading-relaxed max-w-sm">
                                {displayDesc}
                            </p>
                        </div>

                        <div className="relative aspect-square sm:aspect-3/4 rounded-[24px] md:rounded-[32px] overflow-hidden group">
                            {images[0]?.image ? (
                                <Image
                                    src={urlFor(images[0].image).width(600).url()}
                                    alt=""
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : fallbackImages?.[0]?.image ? (
                                <Image
                                    src={urlFor(fallbackImages[0].image).width(600).url()}
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
                                    <Icon icon="ph:image-square-duotone" className="w-12 h-12 text-neutral-3" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Column: 2 Stacked Images */}
                    <div className="md:col-span-1 lg:col-span-3 flex flex-col gap-6 md:gap-8 justify-center">
                        <div className="relative aspect-square sm:aspect-4/5 rounded-[24px] md:rounded-[32px] overflow-hidden group">
                            {images[1]?.image ? (
                                <Image
                                    src={urlFor(images[1].image).width(600).url()}
                                    alt=""
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : fallbackImages?.[1]?.image ? (
                                <Image
                                    src={urlFor(fallbackImages[1].image).width(600).url()}
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-neutral-100" />
                            )}
                        </div>
                        <div className="relative aspect-square sm:aspect-4/5 rounded-[24px] md:rounded-[32px] overflow-hidden group">
                            {images[2]?.image ? (
                                <Image
                                    src={urlFor(images[2].image).width(600).url()}
                                    alt=""
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : fallbackImages?.[2]?.image ? (
                                <Image
                                    src={urlFor(fallbackImages[2].image).width(600).url()}
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-neutral-100" />
                            )}
                        </div>
                    </div>

                    {/* Right Column: 1 Large Image + Button */}
                    <div className="md:col-span-2 lg:col-span-5 flex flex-col gap-8 md:gap-10">
                        <div className="relative aspect-square sm:aspect-3/4 rounded-[24px] md:rounded-[32px] overflow-hidden group flex-1">
                            {images[3]?.image ? (
                                <Image
                                    src={urlFor(images[3].image).width(800).url()}
                                    alt=""
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : fallbackImages?.[3]?.image ? (
                                <Image
                                    src={urlFor(fallbackImages[3].image).width(800).url()}
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-neutral-100" />
                            )}
                        </div>

                        {isAuthenticated ? (
                            <Link
                                href="/community/dashboard"
                                className="w-full py-5 md:py-6 rounded-full border-2 border-primary bg-primary text-white font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all duration-300 shadow-lg shadow-primary/10 text-sm md:text-base flex items-center justify-center"
                            >
                                Visit My Dashboard
                            </Link>
                        ) : (
                            <button
                                onClick={() => openAuthModal("signup")}
                                className="w-full py-5 md:py-6 rounded-full border-2 border-primary-active text-primary-active font-black uppercase tracking-widest hover:bg-primary-active hover:text-white hover:border-white transition-all duration-300 shadow-lg shadow-primary-active/10 text-sm md:text-base"
                            >
                                {displayButton}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
