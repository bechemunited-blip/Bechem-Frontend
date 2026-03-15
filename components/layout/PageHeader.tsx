"use client";

import { SanityImage } from "@/lib/types";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface Tab {
  id: string;
  label: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: SanityImage;
  staticImage?: string;
  tabs?: Tab[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  variant?: "large" | "standard";
  showBreadcrumbs?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  backgroundImage,
  staticImage,
  tabs,
  activeTabId,
  onTabChange,
  variant = "standard",
  showBreadcrumbs = true,
}: PageHeaderProps) {
  // Height classes based on variant
  const heightClass = variant === "large"
    ? "h-[300px] xs:h-[400px] md:h-[500px] lg:h-[650px]"
    : "h-[300px] md:h-[415px]";

  const imageHeight = variant === "large" ? 650 : 415;

  return (
    <div className="w-full">
      <section className={`relative ${heightClass} w-full overflow-hidden`}>
        {/* Background Image */}
        {backgroundImage || staticImage ? (
          <div className="absolute inset-0">
            <Image
              src={
                backgroundImage
                  ? urlFor(backgroundImage).width(1728).height(imageHeight).url()
                  : (staticImage as string)
              }
              alt={title}
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay with stronger bottom gradient to make text pop */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/20" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary via-prim-7 to-prim-9" />
        )}

        {/* Content Container */}
        <div className="relative h-full container-wide flex flex-col justify-end pb-10 md:pb-12 pt-24">
          <div className="flex items-end justify-between">
            {/* Left Side: Title & Subtitle */}
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-3xl md:text-5xl lg:text-[64px] font-black leading-tight tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/80 text-sm md:text-base lg:text-lg font-medium tracking-wide">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Right Side: Tabs (Bottom Aligned) */}
            {tabs && tabs.length > 0 && (
              <div className="hidden md:flex items-center gap-8 lg:gap-12">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id)}
                    className={`relative py-2 transition-all duration-300 whitespace-nowrap font-medium text-xs lg:text-sm tracking-wide ${activeTabId === tab.id
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                      }`}
                  >
                    {tab.label}
                    {activeTabId === tab.id && (
                      <div className="absolute -bottom-[10px] left-0 right-0 h-[3px] bg-white rounded-t-full shadow-[0_-2px_6px_rgba(255,255,255,0.3)]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Tabs */}
          {tabs && tabs.length > 0 && (
            <div className="md:hidden absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10 flex items-center justify-center gap-4 py-2 px-4 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`relative py-1 px-2 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest ${activeTabId === tab.id ? "text-white" : "text-white/50"
                    }`}
                >
                  {tab.label}
                  {activeTabId === tab.id && (
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-white" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Breadcrumb Bar - Beneath the Banner */}
      {showBreadcrumbs && (
        <div className="bg-neutral-2 border-b border-neutral-3 relative z-10 shadow-xs">
          <div className="container-wide py-3 md:py-4 flex items-center">
            <Breadcrumbs onColor={false} />
          </div>
        </div>
      )}
    </div>
  );
}
