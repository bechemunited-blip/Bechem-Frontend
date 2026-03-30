"use client";

import { useAuth } from "@/store/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "admin" | "fan";
    fallbackUrl?: string;
}

export default function ProtectedRoute({
    children,
    requiredRole,
    fallbackUrl = "/",
}: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        const shouldRedirect =
            !isAuthenticated || (requiredRole && user?.role !== requiredRole);

        if (shouldRedirect) {
            setIsRedirecting(true);
            router.replace(fallbackUrl);
        }
    }, [isLoading, isAuthenticated, user, requiredRole, router, fallbackUrl]);

    // Show full-screen loader while checking auth OR while redirecting
    // This covers the layout so you never see empty navbar+footer
    if (isLoading || isRedirecting || !isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-1">
                <Icon icon="line-md:loading-twotone-loop" className="w-12 h-12 text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}
