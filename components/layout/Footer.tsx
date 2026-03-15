import Image from "next/image";
import Link from "next/link";
import { FooterSettings } from "@/lib/types";
import { Icon } from "@iconify/react";

interface FooterProps {
  settings?: FooterSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerContactInfo = [
    {
      type: "location",
      icon: "ic:round-place",
      value: settings?.location?.location,
      href: settings?.location?.locationUrlOnMap,
    },
    {
      type: "phone",
      icon: "ic:round-phone",
      value: settings?.phone,
      href: `tel:${settings?.phone?.replace(/\s/g, "")}`,
    },
    {
      type: "email",
      icon: "ic:round-email",
      value: settings?.email,
      href: `mailto:${settings?.email}`,
    },
  ];

  const footerLinks = [
    {
      title: "CLUB",
      links: [
        { label: "Club Profile", href: "/clubs" },
        { label: "Partners", href: "/clubs#partners" },
      ],
    },
    {
      title: "TEAM",
      links: [
        { label: "Players", href: "/players" },
        { label: "Managers & Staff", href: "/clubs#management" },
      ],
    },
    {
      title: "FIXTURES",
      links: [
        { label: "Fixtures & Results", href: "/fixtures" },
        { label: "Live", href: "/#live" },
        { label: "Highlights", href: "/pastHighlights" },
        { label: "GPL Table", href: "/fixtures?tab=table" },
        { label: "Gallery", href: "/gallery" },
      ],
    },
    {
      title: "FANS",
      links: [
        { label: "News", href: "/news" },
        { label: "Shop", href: "/shop" },
        { label: "Tickets", href: "/fixtures" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  ];

  const socialMediaLinks = [
    {
      key: "facebook",
      href: settings?.socialMedia?.facebook,
      icon: "f7:logo-facebook",
      iconSize: "w-7 h-7",
    },
    {
      key: "youtube",
      href: settings?.socialMedia?.youtube,
      icon: "mdi:youtube",
    },
    {
      key: "pinterest",
      href: settings?.socialMedia?.pinterest,
      icon: "mdi:pinterest",
    },
    {
      key: "instagram",
      href: settings?.socialMedia?.instagram,
      icon: "mdi:instagram",
      label: "Follow us on Instagram",
    },
    {
      key: "twitter",
      href: settings?.socialMedia?.twitter,
      icon: "ri:twitter-x-line",
    },
  ];

  return (
    <footer className="bg-neutral-1 border-t border-neutral-3">
      <div className="container-wide py-12 md:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="flex flex-col xlg:flex-row items-center justify-between gap-8 xl:gap-0">
          {/* Logo and Description Section */}
          <div className="flex items-start gap-4">
            <Link href="/" className="inline-block shrink-0">
              <Image
                src="/img/bufc_logo.png"
                alt="Bechem United FC"
                width={200}
                height={200}
                className="w-9 xs:w-10 lg:w-11 object-contain shrink-0"
                unoptimized
              />
            </Link>

            <div className=" max-w-[85%] xlg:max-w-[440px]">
              <p className="text-neutral-text text-sm md:text-[15px] leading-relaxed mb-6">
                {settings?.description}
              </p>

              {/* Contact Information */}
              <div className="space-y-4">
                {footerContactInfo.map((info, index: number) => (
                  <div key={index} className="flex items-start gap-2.5">
                    {settings?.[info.type as keyof FooterSettings] && (
                      <>
                        <Icon
                          icon={info.icon}
                          width="18"
                          height="18"
                          color="#3f2a78"
                          className="shrink-0"
                        />
                        <a
                          href={info.href}
                          className={`${info.type === "location" ? "capitalize" : ""} text-neutral-8 text-sm md:text-[15px] hover:text-primary transition-colors lg:max-w-[280px]`}
                        >
                          {info.value}
                        </a>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links - 4 Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-7.5 xs:gap-10 lg:gap-10">
            {footerLinks.map((section) => (
              <div key={section.title} className="">
                <h3 className="text-neutral-text font-semibold text-[15px] uppercase mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-neutral-7 text-sm lg:text-[15px] hover:text-primary transition-colors w-full"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-15">
          {/* Social Media Section */}
          <div className="flex flex-col xs:flex-row justify-center items-center gap-2 xs:gap-7">
            <p className="text-neutral-text text-sm lg:text-[15px] font-medium">
              Follow the{" "}
              <span className="font-semibold text-primary uppercase">
                HUNTERS
              </span>
            </p>
            <p className="w-0.5 h-7 bg-neutral-3 rotate-90 xs:rotate-none"></p>
            <div className="flex-center gap-5 md:gap-7">
              {socialMediaLinks.map((link) =>
                link.href ? (
                  <Link
                    key={link.key}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover transition-all duration-300"
                  >
                    <Icon
                      icon={link.icon}
                      width="none"
                      height="none"
                      className={`w-5.5 h-5.5 md:w-6 md:h-6 ${link.key === "youtube" ? "w-6.5 h-6.5 md:w-7 md:h-7" : ""}`}
                    />
                  </Link>
                ) : null
              )}
            </div>
          </div>
          <div className="mt-10 border-t pt-4 border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-neutral-7 text-xs text-center sm:text-left">
              Copyright © {currentYear} Bechem United Football Club. All rights
              reserved
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy-policy"
                className="text-neutral-7 text-xs hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/disclaimer"
                className="text-neutral-7 text-xs hover:text-primary transition-colors"
              >
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
