"use client";

import { useState, useEffect } from "react";
import { FixtureWithClubData } from "@/lib/types";
import { getTimeUntilFixture } from "@/lib/mockFixtures";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import ImageFallback from "../ui/ImageFallback";

interface FixtureHeroProps {
    nextFixture: FixtureWithClubData;
}

export default function FixtureHero({ nextFixture }: FixtureHeroProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: false,
    });

    useEffect(() => {
        const updateCountdown = () => {
            const time = getTimeUntilFixture(nextFixture.date, nextFixture.time);
            setTimeLeft(time);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [nextFixture.date, nextFixture.time]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const day = date.getDate();
        const month = date.toLocaleDateString("en-US", { month: "short" });
        return `${dayName} ${day} ${month}`;
    };

    const getStadiumName = () => {
        return nextFixture.homeClubData?.stadium || "Nana Fosu Gyeabour Park";
    };

    return (
        <div className="relative w-full h-[470px] lg:h-[450px] flex justify-center items-end lg:items-center py-10 px-4 overflow-hidden shadow-2xl">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 ">
                <Image
                    src="/img/bufc_stadium.png"
                    alt="Stadium background"
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>
            {/* Dark overlay */}
            <div className="absolute inset-0 z-0 bg-black/60" />



            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 md:gap-10 w-full md:max-w-xl">
                {/* UP NEXT Badge */}
                <div className="flex flex-col items-center gap-2.5 ">
                    <h3 className="text-neutral-1 text-[15px] sm:text-base lg:text-lg font-bold uppercase tracking-wide">
                        UP NEXT
                    </h3>
                    {/* Location and Date */}
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-[72px] text-neutral-3">
                        <div className="flex items-center gap-1.5">
                            <Icon
                                icon="mdi:map-marker"
                                className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5"
                            />
                            <span className="text-[13.5px] md:text-sm lg:text-[15px] xl:text-base font-medium ">
                                {getStadiumName()}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Icon
                                icon="famicons:calendar"
                                className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5"
                            />
                            <span className="text-[13.5px] md:text-sm lg:text-[15px] xl:text-base font-medium ">
                                {formatDate(nextFixture.date)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Teams Display */}
                <div className="flex items-center justify-center md:gap-10 lg:gap-0 lg:justify-between w-full">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-3 max-w-auto">
                        <div
                            className="relative"
                            style={{
                                width: "clamp(64px, 8.8vw, 100px)",
                                height: "clamp(64px, 8.8vw, 100px)",
                            }}
                        >
                            {nextFixture.homeClubData?.clubLogo ? (
                                <Image
                                    src={urlFor(nextFixture.homeClubData.clubLogo)
                                        .width(256)
                                        .height(256)
                                        .url()}
                                    alt={nextFixture.homeClubData.clubName}
                                    fill
                                    className="object-contain"
                                />
                            ) : nextFixture.homeLogo ? (
                                <Image
                                    src={nextFixture.homeLogo}
                                    alt={nextFixture.homeTeam}
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <ImageFallback
                                    icon="mdi:shield-outline"
                                    width="80"
                                    height="80"
                                    className="bg-neutral-7"
                                />
                            )}
                        </div>
                        <p className="text-neutral-1 text-[13.5px] md:text-sm lg:text-base font-semibold text-center lg:whitespace-nowrap">
                            {nextFixture.homeClubData?.clubName || nextFixture.homeTeam}
                        </p>
                    </div>

                    {/* VS Divider */}
                    <Image
                        src="/img/vs_logo.png"
                        alt="VS Logo"
                        width={100}
                        height={93}
                        className="w-20 lg:w-30 h-auto object-contain"
                    />

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-3 max-w-auto">
                        <div
                            className="relative"
                            style={{
                                width: "clamp(64px, 8.8vw, 100px)",
                                height: "clamp(64px, 8.8vw, 100px)",
                            }}
                        >
                            {nextFixture.awayClubData?.clubLogo ? (
                                <Image
                                    src={urlFor(nextFixture.awayClubData.clubLogo)
                                        .width(256)
                                        .height(256)
                                        .url()}
                                    alt={nextFixture.awayClubData.clubName}
                                    fill
                                    className="object-contain"
                                />
                            ) : nextFixture.awayLogo ? (
                                <Image
                                    src={nextFixture.awayLogo}
                                    alt={nextFixture.awayTeam}
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <ImageFallback
                                    icon="mdi:shield-outline"
                                    width="80"
                                    height="80"
                                    className="bg-neutral-7"
                                />
                            )}
                        </div>
                        <p className="text-neutral-1 text-[13.5px] md:text-sm lg:text-base font-semibold text-center lg:whitespace-nowrap">
                            {nextFixture.awayClubData?.clubName || nextFixture.awayTeam}
                        </p>
                    </div>
                </div>

                {/* Countdown Timer */}
                <div className="flex flex-col items-center gap-3.5 lg:gap-4">
                    <p className="text-neutral-1 text-[15px] sm:text-base lg:text-lg font-bold uppercase tracking-wide">
                        KICKOFF IN:
                    </p>
                    <div className="flex items-center gap-3.5 xs:gap-4 md:gap-6">
                        {[
                            { value: timeLeft.days, label: "Day", pluralLabel: "Days" },
                            {
                                value: timeLeft.hours,
                                label: "Hour",
                                pluralLabel: "Hours",
                            },
                            {
                                value: timeLeft.minutes,
                                label: "Min",
                                pluralLabel: "Mins",
                            },
                            {
                                value: timeLeft.seconds,
                                label: "Sec",
                                pluralLabel: "Secs",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg md:rounded-xl px-4 py-3 md:px-5.5 md:py-4 min-w-15 lg:min-w-20"
                            >
                                <span className="text-neutral-1 text-xl lg:text-[22px] font-bold tabular-nums">
                                    {String(item.value).padStart(2, "0")}
                                </span>
                                <span className="text-neutral-1 text-xs lg:text-sm font-medium ">
                                    {item.value === 1 ? item.label : item.pluralLabel}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
