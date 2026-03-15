"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

interface BreadcrumbsProps {
    onColor?: boolean;
}

export default function Breadcrumbs({ onColor = true }: BreadcrumbsProps) {
    const pathname = usePathname();

    // Split the pathname into segments and filter out empty strings
    const segments = pathname.split("/").filter((segment) => segment !== "");

    if (segments.length === 0) return null;

    return (
        <nav className={`flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider ${onColor ? "text-white/60" : "text-neutral-7"
            }`}>
            <Link
                href="/"
                className={`transition-colors flex items-center gap-1.5 ${onColor ? "hover:text-white" : "hover:text-primary"
                    }`}
            >
                <Icon icon="ph:house-fill" className="w-4 h-4" />
                Home
            </Link>

            {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;

                // Format segment name
                const label = segment.replace(/-/g, " ");

                return (
                    <div key={href} className="flex items-center gap-2">
                        <Icon
                            icon="ph:caret-right-bold"
                            className={`w-3 h-3 ${onColor ? "text-white/20" : "text-neutral-4"}`}
                        />
                        {isLast ? (
                            <span className={onColor ? "text-white" : "text-neutral-9"}>
                                {label}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className={`transition-colors whitespace-nowrap ${onColor ? "hover:text-white" : "hover:text-primary"
                                    }`}
                            >
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
