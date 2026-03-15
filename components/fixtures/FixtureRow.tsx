"use client";

import { FixtureWithClubData } from "@/lib/types";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import ImageFallback from "../ui/ImageFallback";

interface FixtureRowProps {
    fixture: FixtureWithClubData;
}

export default function FixtureRow({ fixture }: FixtureRowProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Calculate an end time (assuming 2 hours match)
    const getEndTime = (startTime: string) => {
        if (!startTime) return "21:00";
        try {
            const [hours, minutes] = startTime.split(':').map(Number);
            const endHours = (hours + 2) % 24;
            return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } catch {
            return "21:00";
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-full rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl shadow-black/5 bg-white group transition-all duration-500 hover:shadow-2xl hover:shadow-black/10">
            {/* Visual Part (Left) */}
            <div className="relative w-full lg:w-[320px] xl:w-[380px] shrink-0 aspect-video lg:aspect-auto flex flex-col items-center justify-center p-8 bg-linear-to-br from-[#0B0B0B] via-[#2A165F] to-[#3F2A78] overflow-hidden">
                {/* Decorative background effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-prim-4/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex items-center justify-center gap-6 md:gap-8 w-full max-w-[280px]">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="relative w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110">
                            {fixture.homeClubData?.clubLogo ? (
                                <Image
                                    src={urlFor(fixture.homeClubData.clubLogo).width(160).height(160).url()}
                                    alt={fixture.homeTeam}
                                    fill
                                    className="object-contain"
                                />
                            ) : fixture.homeLogo ? (
                                <Image
                                    src={fixture.homeLogo}
                                    alt={fixture.homeTeam}
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <ImageFallback icon="mdi:shield-outline" width="40" height="40" className="bg-white/10 text-white rounded-full p-2" />
                            )}
                        </div>
                        <span className="text-[10px] md:text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">Home</span>
                    </div>

                    {/* VS */}
                    <div className="shrink-0 flex items-center justify-center">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 xl:w-16 xl:h-16">
                            <Image
                                src="/img/vs_logo.png"
                                alt="VS"
                                fill
                                className="object-contain brightness-0 invert opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="relative w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110">
                            {fixture.awayClubData?.clubLogo ? (
                                <Image
                                    src={urlFor(fixture.awayClubData.clubLogo).width(160).height(160).url()}
                                    alt={fixture.awayTeam}
                                    fill
                                    className="object-contain"
                                />
                            ) : fixture.awayLogo ? (
                                <Image
                                    src={fixture.awayLogo}
                                    alt={fixture.awayTeam}
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <ImageFallback icon="mdi:shield-outline" width="40" height="40" className="bg-white/10 text-white rounded-full p-2" />
                            )}
                        </div>
                        <span className="text-[10px] md:text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">Away</span>
                    </div>
                </div>

                {/* Optional Featured Badge */}
                {fixture.isFeatured && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                        <Icon icon="ph:lightning-fill" className="text-prim-4 w-3 h-3" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest">Featured</span>
                    </div>
                )}
            </div>

            {/* Info Part (Right) */}
            <div className="flex-1 flex flex-col md:flex-row items-center p-6 md:p-10 lg:pl-12">
                <div className="flex-1 flex flex-col gap-6 md:gap-8 w-full text-center md:text-left">
                    {/* Top: Badges */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-2.5 px-4 py-2 bg-neutral-100/80 rounded-full border border-neutral-200/50">
                            <Icon icon="ph:calendar-blank-bold" className="w-4 h-4 text-prim-9" />
                            <span className="text-[13px] font-bold text-neutral-600">{formatDate(fixture.date)}</span>
                        </div>
                        <div className="flex items-center gap-2.5 px-4 py-2 bg-neutral-100/80 rounded-full border border-neutral-200/50">
                            <Icon icon="ph:clock-bold" className="w-4 h-4 text-prim-9" />
                            <span className="text-[13px] font-bold text-neutral-600">
                                {fixture.time} - {getEndTime(fixture.time)}
                            </span>
                        </div>
                    </div>

                    {/* Middle: Match Heading */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[20px] md:text-[24px] font-bold text-[#1A1A1A] tracking-tight">
                            {fixture.homeTeam} <span className="text-neutral-300 mx-2">VS</span> {fixture.awayTeam}
                        </h3>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-400 group/loc">
                            <Icon icon="ph:map-pin-bold" className="w-4 h-4 group-hover/loc:text-prim-9 transition-colors" />
                            <span className="text-[15px] font-medium">{fixture.venue || "Accra Sports Stadium"}</span>
                        </div>
                    </div>
                </div>

                {/* Right Divider Section */}
                <div className="hidden md:flex items-center self-stretch py-2">
                    <div className="w-[1.5px] h-full bg-neutral-100 mx-10" />
                </div>

                {/* Competition & CTA */}
                <div className="flex flex-col items-center md:items-start gap-6 shrink-0 pt-8 md:pt-0 border-t border-neutral-100 md:border-t-0 w-full md:w-auto">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <div className="flex items-center gap-2">
                            <div className="relative w-5 h-5 shrink-0">
                                <Image
                                    src="/img/gpl_logo.png"
                                    alt="GPL"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-[14px] font-bold text-[#1A1A1A]">{fixture.competition || "Ghana Premier League"}</span>
                        </div>
                        <span className="text-[13px] font-medium text-neutral-400">Matchday {fixture.matchday || "13"}</span>
                    </div>


                </div>
            </div>
        </div>
    );
}
