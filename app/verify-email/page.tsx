"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import NextImage from "next/image";
import Link from "next/link";
import { authService } from "@/lib/api/auth";
import { useAuth } from "@/store/hooks/useAuth";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();

    const token = searchParams.get("token");
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [message, setMessage] = useState("");

    const friendlyError = (raw: string): string => {
        const r = raw.toLowerCase();
        if (r.includes("parameters validation error") || r.includes("validation") || r.includes("invalid token")) {
            return "The verification link is invalid or has already been used.";
        }
        if (r.includes("expired")) {
            return "The verification link has expired. Please sign in to request a new one.";
        }
        return raw || "Email verification failed. Please try again.";
    };

    useEffect(() => {
        if (!token) {
            // Defers to next tick to avoid lint warning about sync state updates in effects
            setTimeout(() => {
                setStatus("error");
                setMessage("No verification token found in the link. Please check your email and try again.");
            }, 0);
            return;
        }

        authService
            .verifyEmail(token)
            .then((res) => {
                if (res.token && res.user) {
                    login(res.token, res.user);
                }
                setStatus("success");
                setMessage("Your email has been verified successfully!");
                setTimeout(() => router.push("/community/dashboard"), 2500);
            })
            .catch((err: unknown) => {
                const raw = (err as { message?: string }).message || "";
                setStatus("error");
                setMessage(friendlyError(raw));
            });
    }, [token, login, router]);

    return (
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
                <NextImage src="/img/bufc_logo.png" alt="BUFC" width={40} height={40} className="object-contain" />
                <span className="font-montserrat font-bold text-xl text-neutral-900">BUFC</span>
            </div>

            {status === "verifying" && (
                <>
                    <Icon icon="line-md:loading-twotone-loop" className="w-16 h-16 text-primary mx-auto mb-5" />
                    <h1 className="text-2xl font-black text-neutral-900 mb-2">Verifying your email…</h1>
                    <p className="text-neutral-500 text-sm">Just a moment, please hang on.</p>
                </>
            )}

            {status === "success" && (
                <>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Icon icon="ph:check-circle-fill" className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-black text-neutral-900 mb-2">Email Verified! 🎉</h1>
                    <p className="text-neutral-500 text-sm mb-4">{message}</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                        <Icon icon="line-md:loading-twotone-loop" className="w-4 h-4" />
                        Redirecting you to the community…
                    </div>
                </>
            )}

            {status === "error" && (
                <>
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Icon icon="ph:warning-circle-fill" className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-neutral-900 mb-2">Verification Failed</h1>
                    <p className="text-neutral-500 text-sm mb-6">{message}</p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/auth/sign-in"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3F2A78] text-white rounded-full text-sm font-bold hover:bg-[#2A165F] transition-all"
                        >
                            <Icon icon="ph:sign-in-duotone" className="w-4 h-4" />
                            Back to Sign In
                        </Link>
                        <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
                            Go to Homepage
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

function VerifyingFallback() {
    return (
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
            <Icon icon="line-md:loading-twotone-loop" className="w-16 h-16 text-primary mx-auto mb-5" />
            <h1 className="text-2xl font-black text-neutral-900 mb-2">Loading…</h1>
            <p className="text-neutral-500 text-sm">Please wait.</p>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
            <Suspense fallback={<VerifyingFallback />}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
