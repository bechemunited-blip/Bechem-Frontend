import { FixtureWithClubData } from "@/lib/types";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import ImageFallback from "./ImageFallback";
import { Icon } from "@iconify/react";

interface FixtureCardProps {
  fixture: FixtureWithClubData;
  hideFeaturedBadge?: boolean;
  variant?: "detailed" | "minimal";
}

/**
 * FixtureCard Component
 * Displays a premium fixture card with a split design:
 * - Top: Dark gradient matchup section with logos (200px)
 * - Bottom: Detailed match info (competition, stadium, date) with overlap
 */
export default function FixtureCard({
  fixture,
  hideFeaturedBadge = false,
  variant = "detailed"
}: FixtureCardProps) {
  // Format the date for display (e.g., "Wed, Dec 17 - 2025")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const year = date.getFullYear();
    return `${formattedDate} - ${year}`;
  };

  // Format the time for display (e.g., "15:00" -> "3pm")
  const formatTime = (timeString: string) => {
    if (!timeString) return "2pm";
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'pm' : 'am';
    const displayHours = h % 12 || 12;

    if (minutes === '00' || !minutes) {
      return `${displayHours}${ampm}`;
    }
    return `${displayHours}:${minutes}${ampm}`;
  };

  if (variant === "minimal") {
    const isFeatured = fixture.isFeatured && !hideFeaturedBadge;

    return (
      <div className={`relative flex flex-col w-[340px] h-[200px] bg-[#0B0B0B] border shadow-2xl overflow-hidden shrink-0 rounded-[28px] p-[20px_32px] font-montserrat group transition-all duration-300 ${isFeatured ? 'border-[#3F2A78]' : 'border-white/10'
        }`}>
        {/* Top Row: Date | Year and Time */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2 transition-opacity duration-300 group-hover:opacity-80">
            <span className="text-[14px] font-semibold opacity-90">{new Date(fixture.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <span className="h-4 w-px bg-white/30" />
            <span className="text-[14px] font-semibold opacity-90">{new Date(fixture.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <span className="text-[16px] font-bold tracking-tight">{fixture.time || "19:00"}</span>
        </div>

        {/* Matchup Section */}
        <div className="flex-1 flex items-center justify-between">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="relative w-14 h-14 drop-shadow-[0_8px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110">
              {fixture.homeClubData?.clubLogo ? (
                <Image
                  src={urlFor(fixture.homeClubData.clubLogo).width(120).height(120).url()}
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
                <ImageFallback icon="mdi:shield-outline" width="40" height="40" className="bg-white/10" />
              )}
            </div>
            <span className="text-[12px] font-bold text-white/70 uppercase tracking-widest mt-1">Home</span>
          </div>

          {/* VS Divider */}
          <div className="relative w-12 h-10 shrink-0 opacity-80">
            <Image
              src="/img/vs_logo.png"
              alt="VS"
              fill
              className="object-contain brightness-200"
            />
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="relative w-14 h-14 drop-shadow-[0_8px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110">
              {fixture.awayClubData?.clubLogo ? (
                <Image
                  src={urlFor(fixture.awayClubData.clubLogo).width(120).height(120).url()}
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
                <ImageFallback icon="mdi:shield-outline" width="40" height="40" className="bg-white/10" />
              )}
            </div>
            <span className="text-[12px] font-bold text-white/70 uppercase tracking-widest mt-1">Away</span>
          </div>
        </div>

        {/* Bottom Featured Tag */}
        {isFeatured && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-1.5 text-[#A891E7]">
            <Icon icon="material-symbols:electric-bolt-rounded" className="w-4 h-4" />
            <span className="text-[12px] font-bold uppercase tracking-wider">Featured</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-[381px] h-[460px] bg-white shadow-2xl group overflow-hidden shrink-0 rounded-[14px] border border-neutral-2/50 font-montserrat">
      {/* Detailed Variant JSX - Retaining existing code */}
      {/* ... previous content ... */}
      {/* Top Section: Matchup */}
      <div className="relative h-[216px] bg-linear-to-b from-[#000000] via-[#050505] to-[#2A165F] pt-8 px-4 pb-8 flex items-center justify-between gap-[12px]">
        <div className="flex flex-col items-center justify-center h-full flex-1 relative z-10 gap-3">
          <p className="text-[12px] font-semibold text-white text-center line-clamp-1 w-full px-1">
            {fixture.homeClubData?.clubName || fixture.homeTeam}
          </p>
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative w-16 h-16 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-110">
              {fixture.homeClubData?.clubLogo ? (
                <Image
                  src={urlFor(fixture.homeClubData.clubLogo).width(200).height(200).url()}
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
                <ImageFallback icon="mdi:shield-outline" width="50" height="50" className="bg-white/10" />
              )}
            </div>
            <span className="text-[12px] font-semibold text-white">Home</span>
          </div>
        </div>

        {/* VS Divider */}
        <div className="relative w-12 h-12 shrink-0 z-10 opacity-90">
          <Image
            src="/img/vs_logo.png"
            alt="VS"
            fill
            className="object-contain brightness-200"
          />
        </div>

        <div className="flex flex-col items-center justify-center h-full flex-1 relative z-10 gap-3">
          <p className="text-[12px] font-semibold text-white text-center line-clamp-1 w-full px-1">
            {fixture.awayClubData?.clubName || fixture.awayTeam}
          </p>
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative w-16 h-16 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-110">
              {fixture.awayClubData?.clubLogo ? (
                <Image
                  src={urlFor(fixture.awayClubData.clubLogo).width(200).height(200).url()}
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
                <ImageFallback icon="mdi:shield-outline" width="50" height="50" className="bg-white/10" />
              )}
            </div>
            <span className="text-[12px] font-semibold text-white">Away</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 bg-linear-to-t from-[#2A165F]/40 to-transparent" />
      </div>

      {/* Bottom Section: Details */}
      <div className="relative flex-1 bg-white -mt-8 rounded-t-[14px] p-6 flex flex-col border-t border-neutral-1 z-20">
        <div className="flex-1 space-y-6">
          {/* Competition row */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 relative shrink-0">
                  <Image
                    src="/img/gpl_logo.png"
                    alt="GPL"
                    fill
                    className="object-contain"
                  />
                </div>
                <h4 className="text-[16px] font-semibold text-[#1A1A1A] leading-none tracking-tight whitespace-nowrap">
                  {fixture.competition || "Ghana Premier League"}
                </h4>
                {fixture.isFeatured && !hideFeaturedBadge && (
                  <span className="bg-yellow-400 text-black text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-[2px] flex items-center gap-0.5 shadow-sm shrink-0">
                    <Icon icon="mdi:star" className="w-2.5 h-2.5" />
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[#3F2A78]">
                <Icon icon="ph:clock" className="w-5 h-5" />
                <span className="text-[16px] font-semibold leading-none">{formatTime(fixture.time)}</span>
              </div>
            </div>
            <p className="text-[14px] font-medium text-neutral-5 ml-8 tracking-wide leading-none">
              Matchday {fixture.matchday || "13"}
            </p>
          </div>

          {/* Location and Date rows */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icon icon="ph:map-pin" className="text-[#3F2A78] w-5 h-5 shrink-0" />
              <span className="text-[14px] font-normal text-neutral-6 tracking-tight line-clamp-1 leading-none">
                {fixture.homeClubData?.stadium || "Accra Sports Stadium"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Icon icon="ph:calendar-blank" className="text-[#3F2A78] w-5 h-5 shrink-0" />
              <span className="text-[14px] font-normal text-neutral-6 tracking-tight leading-none">
                {formatDate(fixture.date)}
              </span>
            </div>
          </div>
        </div>


      </div>

    </div>
  );
}
