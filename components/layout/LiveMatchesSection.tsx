"use client";

import { LiveMatchesSettings } from "@/lib/types";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import SectionHeader from "@/components/layout/SectionHeader";
import Button from "../ui/Button";
import { useState } from "react";

interface LiveMatchesSectionProps {
  settings: LiveMatchesSettings;
}

// Helper function to extract YouTube video ID from various YouTube URL formats
function extractYouTubeId(url: string): string {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
}

export default function LiveMatchesSection({
  settings,
}: LiveMatchesSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <section id="live" className="relative pt-8 md:pt-20 bg-neutral-1 overflow-hidden">
      <div className="relative h-auto md:h-screen container-wide section-padding py-12 md:py-0 flex flex-col items-center justify-center gap-12 md:gap-20">
        {/* Section Header */}
        <SectionHeader
          title={settings.liveSectionTitle}
          subtext={settings.liveSectionSubtext}
          showLine
          uppercase
        />

        {/* Video Player Container */}
        <div className="w-full mx-auto flex flex-col items-center gap-16 md:gap-20">
          {/* Video Thumbnail/Player */}
          <div className="relative w-full md:max-w-[700px] lg:max-w-[750px] h-[425px] md:h-[440px] rounded-[20px] md:rounded-3xl overflow-hidden group">
            {settings.videoUrl && isPlaying ? (
              <>
                {/* YouTube Embedded Player */}
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(
                    settings.videoUrl,
                  )}?autoplay=1&mute=0`}
                  title={settings.liveSectionTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </>
            ) : (
              <>
                {/* Thumbnail with gradient overlay */}
                {settings.videoThumbnail ? (
                  <>
                    <Image
                      src={urlFor(settings.videoThumbnail)
                        .width(1200)
                        .height(675)
                        .url()}
                      alt="Live Match Thumbnail"
                      fill
                      className="object-cover object-center"
                    />
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 60.4%, #2A2A2A 100%)",
                      }}
                    />
                  </>
                ) : !settings.videoThumbnail && settings.videoUrl ? (
                  <>
                    <Image
                      src="/img/fallback_thumbnail.png"
                      alt="default thumbnail"
                      fill
                      className="object-cover object-center"
                    />
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 60.4%, #2A2A2A 100%)",
                      }}
                    />
                  </>
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 60.4%, #2A2A2A 100%)",
                    }}
                  />
                )}

                {/* Badge - Live or Last Match */}
                {settings.isLive ? (
                  <>
                    <div className="absolute top-2.5 md:top-4 left-2.5 md:left-4 flex-center gap-1 px-2.5 py-1.5 bg-neutral-9/50 backdrop-blur-sm rounded-full z-10">
                      <div className="w-1.5 md:w-[7px] h-1.5 md:h-[7px] bg-[#FF0000] rounded-full animate-pulse" />

                      <span className="text-neutral-1 text-[13px] md:text-sm font-semibold uppercase">
                        Live
                      </span>
                    </div>
                  </>
                ) : settings.videoUrl && settings.videoThumbnail ? (
                  <div className="absolute top-2.5 md:top-4 left-2.5 md:left-4 flex items-center gap-1 px-2.5 py-1.5 bg-neutral-9/50 backdrop-blur-sm rounded-full z-10">
                    <span className="text-neutral-1 text-[13px] md:text-sm font-medium capitalize">
                      Last Match
                    </span>
                  </div>
                ) : null}

                {/* YouTube Icon Button or No Video Message */}
                {settings.videoUrl ? (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
                  >
                    <Icon
                      icon="logos:youtube-icon"
                      width="256"
                      height="180"
                      className="w-14 md:w-18 transition-all duration-300 group-hover/play:scale-105"
                    />
                  </button>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 md:gap-6">
                    <Icon
                      icon="mdi:video-outline"
                      width="64"
                      height="64"
                      className="w-16 md:w-20 h-16 md:h-20 text-neutral-6"
                    />
                    <p className="text-neutral-6 text-base md:text-lg font-medium px-4 text-center">
                      No video available at the moment
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <Button
            href="/pastHighlights"
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
            buttonClassName="!p-0 hover:!text-prim-6 transition-colors duration-300 ease-in-out text-base md:text-lg"
          >
            {settings.liveSectionBtnText}
          </Button>
        </div>
      </div>
      <div className="absolute -bottom-22 -right-22 sm:-bottom-30 sm:-right-30 md:-bottom-36 md:-right-36 lg:-bottom-56 lg:-right-56 xl:-bottom-70 xl:-right-65 opacity-[0.015] z-10">
        <Image
          src="/img/vector_arrow.png"
          alt="vector pattern"
          width={1000}
          height={1000}
          className="w-[150px] xs:w-[180px] sm:w-[220px] md:w-[260px] lg:w-[350px] xl:w-[450px] rotate-40"
        />
      </div>
      <div className="absolute -bottom-22 -left-22 sm:-bottom-30 sm:-left-30 md:-bottom-36 md:-left-36 lg:-bottom-56 lg:-left-56 xl:-bottom-70 xl:-left-65 opacity-[0.015] z-10">
        <Image
          src="/img/vector_arrow.png"
          alt="vector pattern"
          width={1000}
          height={1000}
          className="w-[150px] xs:w-[180px] sm:w-[220px] md:w-[260px] lg:w-[350px] xl:w-[450px] rotate-140"
        />
      </div>
    </section>
  );
}
