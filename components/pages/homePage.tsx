"use client";

import {
  NewsArticle,
  HomePageSettings,
  SponsorSettings,
  Product,
  LiveMatchesSettings,
  NewsletterSettings,
  FixtureWithClubData,
  GalleryImage,
} from "@/lib/types";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import Button from "../ui/Button";
import { Icon } from "@iconify/react";
import SectionHeader from "@/components/layout/SectionHeader";
import ImageFallback from "../ui/ImageFallback";
import SponsorSection from "../layout/SponsorSection";
import ProductCard from "../ui/ProductCard";
import LiveMatchesSection from "../layout/LiveMatchesSection";
import Newsletter from "../layout/Newsletter";
import UpcomingFixtures from "../layout/UpcomingFixtures";
import PhotoHighlightsSection from "../layout/PhotoHighlightsSection";

interface HomePageProps {
  heroNews: NewsArticle;
  nextFourRecentNews: NewsArticle[];
  settings: HomePageSettings;
  sponsorSettings: SponsorSettings;
  featuredProducts: Product[];
  liveMatchesSettings: LiveMatchesSettings;
  newsletterSettings: NewsletterSettings;
  nextFixture: FixtureWithClubData;
  upcomingFixtures: FixtureWithClubData[];
  highlights: GalleryImage[];
}

export default function HomePage({
  heroNews,
  nextFourRecentNews,
  settings,
  sponsorSettings,
  featuredProducts,
  liveMatchesSettings,
  newsletterSettings,
  nextFixture,
  upcomingFixtures,
  highlights,
}: HomePageProps) {
  return (
    <main>
      {/* Hero Section - Elite Stadium Identity */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0c] flex flex-col justify-end">
        {/* === LAYER 0: IMMERSIVE STATIUM CANVAS === */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/img/hero_v4.png"
            alt="Sold-out Stadium Arena"
            fill
            className="object-cover opacity-40 contrast-[1.1] brightness-[0.4] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-primary/10 mix-blend-color" />
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-linear-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-radial-[circle_at_50%_0%] from-transparent via-black/10 to-black/80" />
        </div>

        {/* === LAYER 1: BRAND ECHO === */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <h2 className="text-primary text-[20vw] sm:text-[15vw] font-black uppercase tracking-[-0.08em] opacity-[0.08] select-none leading-none whitespace-nowrap translate-y-[10%] sm:translate-y-[15%]">
            WELCOME
          </h2>
        </div>



        {/* === LAYER 4: VERTICAL NAVIGATION HUD === */}
        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-6 py-6 transition-opacity duration-500">
          <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] text-white font-black uppercase tracking-[0.6em] select-none">BECHEM UNITED FC</span>
          <div className="w-px h-12 bg-primary" />
          <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] text-white font-black uppercase tracking-[0.6em] select-none">HUNT SINCE 1966</span>
        </div>

        {/* === LAYER 5: ACTION BAR & INSIGHTS === */}
        <div className="relative z-40 container-wide pb-12 lg:pb-16 flex flex-col lg:flex-row items-end justify-between gap-16">
          {/* CTA Group */}
          <div className="flex flex-col gap-8 max-w-3xl animate-in fade-in slide-in-from-left duration-1000 delay-300">
            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-primary" />
              <span className="text-[10px] md:text-xs text-white uppercase tracking-[0.5em] font-black italic">Bechem United Online Portal</span>
            </div>

            <div className="flex flex-col gap-1 sm:gap-0">
              <h1 className="text-prim-3 text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-[0.85] drop-shadow-sm">
                WELCOME TO
              </h1>
              <h1 className="text-white text-4xl sm:text-6xl md:text-8xl lg:text-[10vw] font-black italic tracking-tighter uppercase leading-[0.8] drop-shadow-sm -mt-1 sm:-mt-2">
                THE HUNTERS.
              </h1>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto">
              <Link href="/shop" className="group relative overflow-hidden bg-primary text-white border border-primary px-8 sm:px-10 py-4 sm:py-5 font-black uppercase text-[10px] sm:text-xs tracking-[0.25em] transition-all w-full sm:min-w-[180px] lg:min-w-[200px] text-center">
                <span className="relative z-10">Visit Store</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link href="/clubs" className="px-8 sm:px-10 py-4 sm:py-5 border-2 border-primary text-white font-black uppercase text-[10px] sm:text-xs tracking-[0.25em] hover:bg-primary transition-all w-full sm:min-w-[180px] lg:min-w-[200px] text-center">
                Club Identity
              </Link>
            </div>
          </div>

          {/* Featured Sliders */}
          <div className="flex flex-col sm:flex-row items-end gap-6 animate-in fade-in slide-in-from-right duration-1000 delay-500 w-full lg:w-auto">
            {nextFixture && (
              <Link
                href="/fixtures"
                className="group relative w-full sm:w-72 md:w-80 h-44 sm:h-48 overflow-hidden rounded-4xl sm:rounded-[2.5rem] border border-white/10 backdrop-blur-md bg-white/3 transition-all hover:border-primary/40 hover:bg-primary/5 shadow-2xl"
              >
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors" />
                <div className="absolute inset-5 sm:inset-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
                      <span className="text-[7px] sm:text-[8px] text-white/50 uppercase tracking-[0.3em] font-black italic">Next Hunt</span>
                    </div>
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary text-[7px] sm:text-[8px] text-white uppercase tracking-[0.2em] font-black shadow-lg">
                      {nextFixture.competition || "GPL"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5 sm:gap-1">
                    <span className="text-[8px] sm:text-[10px] text-white/40 uppercase tracking-widest font-bold">vs Opponent</span>
                    <h3 className="text-xl sm:text-2xl text-white font-black leading-tight uppercase group-hover:text-primary transition-colors truncate">
                      {nextFixture.awayTeam === "Bechem United" ? nextFixture.homeTeam : nextFixture.awayTeam}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[8px] text-white/30 uppercase font-bold">Match Day</span>
                      <span className="text-[10px] sm:text-xs text-white font-black">{nextFixture.date}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[7px] sm:text-[8px] text-white/30 uppercase font-bold">Venue</span>
                      <span className="text-[10px] sm:text-xs text-white font-black truncate max-w-[80px] sm:max-w-[100px]">{nextFixture.venue || "TBA"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <Link
              href="/pastHighlights"
              className="group relative w-full sm:w-48 md:w-56 h-32 sm:h-48 overflow-hidden rounded-4xl sm:rounded-[2.5rem] bg-white/3 border border-white/10 backdrop-blur-md flex flex-row sm:flex-col items-center justify-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-all shadow-2xl px-6 sm:px-0"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-500 shadow-lg shrink-0">
                <Icon icon="ph:play-duotone" className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-left sm:text-center">
                <span className="block text-[10px] sm:text-[11px] text-white font-black uppercase tracking-[0.2em]">Match</span>
                <span className="block text-[10px] sm:text-[11px] text-white/40 uppercase tracking-[0.2em] font-medium group-hover:text-white transition-colors">Replay</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Ambient Blurs */}
        <div className="absolute top-0 right-[20%] w-[50%] h-[50%] bg-primary/20 blur-[180px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-primary/10 blur-[150px] rounded-full pointer-events-none z-0" />
      </section>


      {/* Latest From Hunters Section */}
      {
        nextFourRecentNews?.length >= 4 && (
          <section className="container-wide min-h-screen py-16 md:py-28">
            <div className="flex flex-col gap-15 2xlg:gap-30 justify-between h-full">
              {/* Section Header */}
              <SectionHeader
                title={settings.newsSectionTitle}
                subtext={settings.newsSectionSubtext}
                showLine
                uppercase
              />

              {/* News Grid */}
              <div className="max-w-[1000px] 2xlg:max-w-fit mx-auto flex flex-col 2xlg:flex-row gap-2.5 w-full">
                {/* First Featured News Card */}
                <div className="group 2xlg:w-1/3">
                  <Link
                    href={`/news/${nextFourRecentNews[0].slug.current}`}
                    className="block h-full"
                  >
                    <div className="relative h-[400px] 2xlg:h-[460px] rounded-[20px] overflow-hidden">
                      {nextFourRecentNews[0].featuredImage ? (
                        <Image
                          src={urlFor(nextFourRecentNews[0].featuredImage)
                            .width(800)
                            .height(600)
                            .url()}
                          alt={nextFourRecentNews[0].title || "News"}
                          fill
                          className="object-cover group-hover:scale-[102%] transition-transform duration-300 ease-in-out"
                        />
                      ) : (
                        <ImageFallback
                          icon="material-symbols:news"
                          width="80"
                          height="80"
                        />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

                      {/* Content Overlay */}
                      <div className="text-neutral-1 absolute bottom-0 left-0 right-0 px-5 sm:px-7.5 py-6">
                        <h3 className="uppercase text-[15px] sm:text-base md:text-lg font-bold mb-2 leading-tight line-clamp-2">
                          {nextFourRecentNews[0].title || "Untitled Article"}
                        </h3>
                        {nextFourRecentNews[0].excerpt && (
                          <p className="text-neutral-3 text-[13px] xs:text-sm line-clamp-2">
                            {nextFourRecentNews[0].excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="flex flex-col xlg:flex-row gap-2.5 w-full 2xlg:w-2/3">
                  {/* News & Updates Info Card */}
                  <div className="bg-[#252424] rounded-[20px] px-8 xs:px-12 sm:px-16 py-10 md:py-12 xlg:w-1/2 flex flex-col justify-between xlg:h-[420px] 2xlg:h-[460px]">
                    <div>
                      <h3 className="text-neutral-1 font-medium text-xl lg:text-2xl mb-4">
                        {settings.newsContentTitle}
                      </h3>
                      <p className="text-neutral-4 text-sm xl:text-[15px] leading-relaxed whitespace-pre-line">
                        {settings.newsContentSubtext}
                      </p>
                    </div>
                    <Button
                      href="/news"
                      variant="ghost"
                      size="lg"
                      textClassName="font-normal underline"
                      buttonClassName="!text-sm md:!text-base mt-6 !p-0 text-prim-3 hover:!text-prim-6 !justify-end"
                      fullWidth={true}
                      rightIcon={<FiArrowUpRight className="w-5 h-5" />}
                    >
                      {settings.newsContentBtnText || "Discover More"}
                    </Button>
                  </div>

                  {/* Image Gallery - 2nd, 3rd & 4th news items */}
                  <div className="grid grid-cols-2 grid-rows-[40%_1fr] xlg:w-1/2 gap-2.5 h-[400px] xlg:h-[420px] 2xlg:h-[460px]">
                    {/* Top two cards */}
                    {nextFourRecentNews.slice(1, 3).map((newsItem) => (
                      <Link
                        key={newsItem._id}
                        href={`/news/${newsItem.slug.current}`}
                        className="relative rounded-[20px] overflow-hidden group"
                      >
                        {newsItem.featuredImage ? (
                          <>
                            <Image
                              src={urlFor(newsItem.featuredImage)
                                .width(600)
                                .height(400)
                                .url()}
                              alt={newsItem.title || "News"}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 group-hover:bg-linear-to-t from-black/80 via-black/20 to-transparent transition-all duration-300" />

                            {/* Title overlay - appears on hover */}
                            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                              <h4 className="text-white text-xs font-semibold line-clamp-2 leading-tight">
                                {newsItem.title}
                              </h4>
                            </div>
                          </>
                        ) : (
                          <ImageFallback
                            icon="material-symbols:news"
                            width="40"
                            height="40"
                          />
                        )}
                      </Link>
                    ))}

                    {/* Bottom full-width card */}
                    <Link
                      href={`/news/${nextFourRecentNews[3].slug.current}`}
                      className="col-span-2 relative rounded-[20px] overflow-hidden group"
                    >
                      {nextFourRecentNews[3].featuredImage ? (
                        <>
                          <Image
                            src={urlFor(nextFourRecentNews[3].featuredImage)
                              .width(600)
                              .height(400)
                              .url()}
                            alt={nextFourRecentNews[3].title || "News"}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 group-hover:bg-linear-to-t from-black/80 via-black/20 to-transparent transition-all duration-300" />

                          {/* Title overlay - appears on hover */}
                          <div className="absolute bottom-0 left-0 right-0 px-5 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                            <h4 className="text-white text-sm font-semibold line-clamp-2 leading-tight">
                              {nextFourRecentNews[3].title}
                            </h4>
                          </div>
                        </>
                      ) : (
                        <ImageFallback
                          icon="material-symbols:news"
                          width="50"
                          height="50"
                        />
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      }

      {/* Sponsor Section */}
      {sponsorSettings && <SponsorSection settings={sponsorSettings} />}

      {/* Upcoming Fixtures Section */}
      {
        nextFixture && upcomingFixtures && (
          <UpcomingFixtures
            nextFixture={nextFixture}
            upcomingFixtures={upcomingFixtures}
            settings={settings}
          />
        )
      }

      {/* Shop Section */}
      {
        featuredProducts.length > 0 && (
          <section className="min-h-screen container-wide py-16 md:py-20 lg:py-28 flex flex-col gap-15  justify-between">
            <SectionHeader
              title={settings.shopSectionTitle}
              subtext={settings.shopSectionSubtext}
              showLine
              uppercase
            />
            <div className="flex flex-col gap-8 md:gap-12">
              {/* Featured Products Grid */}
              <div className="flex-center flex-wrap gap-5">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {/* Visit Store Link */}
              <div className="flex justify-end">
                <Button
                  href="/shop"
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
                  {settings.shopSectionBtnText || "Visit Store"}
                </Button>
              </div>
            </div>
          </section>
        )
      }

      {/* Photo Highlights Section */}
      {
        highlights && highlights.length > 0 && (
          <PhotoHighlightsSection settings={settings} images={highlights} />
        )
      }

      {/* Live Matches & Replays Section */}
      {
        liveMatchesSettings && (
          <LiveMatchesSection settings={liveMatchesSettings} />
        )
      }

      {/* Newsletter Section */}
      {newsletterSettings && <Newsletter settings={newsletterSettings} />}
    </main >
  );
}
