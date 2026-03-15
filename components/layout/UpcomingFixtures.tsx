"use client";

import { useState, useEffect, useRef } from "react";
import { FixtureWithClubData, HomePageSettings } from "@/lib/types";
import { getTimeUntilFixture } from "@/lib/mockFixtures";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import FixtureCard from "../ui/FixtureCard";
import ImageFallback from "../ui/ImageFallback";
import Button from "../ui/Button";
import SectionHeader from "@/components/layout/SectionHeader";
import { FiArrowUpRight } from "react-icons/fi";

interface UpcomingFixturesProps {
  // The very next fixture to be displayed prominently
  nextFixture: FixtureWithClubData;
  // Additional upcoming fixtures to display in cards
  upcomingFixtures: FixtureWithClubData[];
  settings: HomePageSettings;
}

/**
 * UpcomingFixtures Component
 * Displays the fixtures section on the home page with:
 * - Large "UP NEXT" featured card with countdown timer
 * - Carousel of smaller fixture cards showing "What's ahead"
 * - Responsive design for mobile and desktop
 */
export default function UpcomingFixtures({
  nextFixture,
  upcomingFixtures,
  settings,
}: UpcomingFixturesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Adjust scroll distance
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  // State for countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  // Update countdown every second
  useEffect(() => {
    // Initial calculation
    const updateCountdown = () => {
      const time = getTimeUntilFixture(nextFixture.date, nextFixture.time);
      setTimeLeft(time);
    };

    updateCountdown();

    // Set up interval to update every second
    const interval = setInterval(updateCountdown, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [nextFixture.date, nextFixture.time]);

  // Format date for display (e.g., "Sun 20 Jan")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return `${dayName} ${day} ${month}`;
  };

  // Get stadium name - use home team's stadium if available
  const getStadiumName = () => {
    return nextFixture.homeClubData?.stadium || "Stadium TBA";
  };

  return (
    <section
      className="flex flex-col items-start gap-2.5 self-stretch"
      style={{
        background:
          "linear-gradient(180deg, var(--primary, #3F2A78) 0%, #0B0B0B 72.08%)",
      }}
    >
      <div className="container-wide w-full section-padding  overflow-hidden flex flex-col items-center gap-12 md:gap-16">
        {/* Section Header */}
        <SectionHeader
          title={settings.fixtureSectionTitle}
          subtext={settings.fixtureSectionSubtext}
          onColor
          showLine
          uppercase
        />

        {/* UP NEXT Featured Card */}
        <div className="relative w-full xxs:w-[90%] lg:max-w-[1200px] h-[470px] lg:h-[450px] flex justify-center items-end lg:items-center py-10 px-4 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0 ">
            <Image
              src="/img/bufc_stadium.png"
              alt="Stadium background"
              fill
              className="object-cover object-center"
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
                width={1000}
                height={1000}
                className="w-20 lg:w-30 h-[93px] object-cover object-center"
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

        {/* What's Ahead Section */}
        <div className=" w-full xxs:w-[90%] lg:max-w-[1200px] flex flex-col items-start gap-6 md:gap-8">
          {/* Section Title */}
          {/* Section Title & Arrows */}
          <div className="w-full flex items-end justify-between mb-2">
            <div className="flex flex-col gap-2">
              <h2 className="text-[24px] font-bold text-white tracking-tight">
                What&apos;s ahead
              </h2>
              <p className="text-[16px] font-medium text-white/60">
                Mark your calendar for these upcoming clashes
              </p>
            </div>

            {/* Navigation Arrows - Desktop only */}
            <div className="hidden md:flex items-center gap-4 py-2 shrink-0">
              <button
                onClick={() => scrollCarousel("left")}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 hover:border-white/50 bg-transparent text-white transition-all duration-300 active:scale-95"
                aria-label="Previous fixtures"
              >
                <Icon
                  icon="ph:arrow-left"
                  className="w-5 h-5"
                />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 hover:border-white/50 bg-transparent text-white transition-all duration-300 active:scale-95"
                aria-label="Next fixtures"
              >
                <Icon
                  icon="ph:arrow-right"
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>

          {/* Fixtures Carousel */}
          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-4 md:gap-6 pb-4">
              {upcomingFixtures.map((fixture) => (
                <FixtureCard
                  key={fixture.id}
                  fixture={fixture}
                  hideFeaturedBadge
                  variant="minimal"
                />
              ))}
            </div>
          </div>

          {/* Full Schedule Link */}
          <div className="w-full flex justify-end">
            <Button
              href="/fixtures"
              variant="ghost"
              size="lg"
              rightIcon={
                <Icon
                  icon="icons8:chevron-right-round"
                  width="none"
                  height="none"
                  className="w-5 h-5 lg:w-6 lg:h-6"
                />
              }
              buttonClassName="!p-0 !text-neutral-1 hover:!text-primary-hover transition-colors duration-300 ease-in-out text-base md:text-lg"
            >
              {settings.fixtureSectionBtnText || "Full Schedule"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
