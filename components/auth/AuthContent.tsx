"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import NextImage from "next/image";
import { useAuth } from "@/store/hooks/useAuth";
import { authService } from "@/lib/api/auth";

interface AuthContentProps {
    initialState?: "signin" | "signup";
    onSuccess?: () => void;
}

// ── Error message mapper ───────────────────────────────────────────────────────
// Translates raw backend messages into friendly, actionable copy.
function friendlyError(raw: string, isSignIn: boolean): string {
    const r = raw.toLowerCase();

    // Duplicate account / existing email
    if (
        r.includes("already exists") ||
        r.includes("already registered") ||
        r.includes("duplicate") ||
        r.includes("parameters validation error") ||
        r.includes("email is already") ||
        r.includes("user already")
    ) {
        return isSignIn
            ? "Incorrect email or password. Please try again."
            : "An account with this email already exists. Try signing in instead.";
    }

    // Email not verified
    if (r.includes("verify") || r.includes("verification") || r.includes("not verified")) {
        return "Please verify your email before logging in. Check your inbox for the verification link.";
    }

    // Wrong password / invalid credentials
    if (
        r.includes("invalid credentials") ||
        r.includes("invalid password") ||
        r.includes("incorrect password") ||
        r.includes("wrong password") ||
        r.includes("unauthorized")
    ) {
        return "Incorrect email or password. Please try again.";
    }

    // User not found
    if (r.includes("not found") || r.includes("no account") || r.includes("user does not exist")) {
        return "No account found with that email. Would you like to sign up?";
    }

    // Network / server down
    if (r.includes("failed to connect") || r.includes("network") || r.includes("fetch")) {
        return "Unable to reach the server. Please check your connection and try again.";
    }

    // Weak password
    if (r.includes("password") && (r.includes("short") || r.includes("weak") || r.includes("length"))) {
        return "Your password is too short. Please use at least 8 characters.";
    }

    // Generic validation
    if (r.includes("validation") || r.includes("invalid") || r.includes("parameters")) {
        return isSignIn
            ? "Invalid email or password format. Please check your details and try again."
            : "Please check all fields. Make sure your email is valid and password is at least 8 characters.";
    }

    // Fallback — return original if nothing matched, or a generic message if empty
    return raw || "Something went wrong. Please try again.";
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AuthContent({ initialState = "signin", onSuccess }: AuthContentProps) {
    const { login } = useAuth();
    const [isSignIn, setIsSignIn] = useState(initialState === "signin");
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
    const [resendEmail, setResendEmail] = useState("");
    const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");

    // Form fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setNeedsVerification(false);
        setIsDuplicateEmail(false);

        try {
            if (isSignIn) {
                const response = await authService.login({ email, password });
                login(response.token, response.user);
            } else {
                const response = await authService.register({ name, email, password });
                if (response.token) {
                    login(response.token, response.user);
                } else {
                    setError("Registration successful! Please check your email to verify your account before logging in.");
                    setIsLoading(false);
                    return;
                }
            }
            if (onSuccess) onSuccess();
        } catch (err: unknown) {
            const raw = (err as { message?: string }).message ?? "";
            const friendly = friendlyError(raw, isSignIn);
            const r = raw.toLowerCase();

            // Flag specific states for contextual UI
            if (r.includes("verify") || r.includes("verification") || r.includes("not verified")) {
                setNeedsVerification(true);
                setResendEmail(email);
                // Auto-send the verification email immediately — no need for the user to click Resend
                setResendStatus("sending");
                fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/auth/resend-verification`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                    }
                )
                    .then(() => setResendStatus("sent"))
                    .catch(() => setResendStatus("idle"));
            }
            if (
                !isSignIn &&
                (r.includes("already exists") || r.includes("duplicate") ||
                    r.includes("parameters validation error") || r.includes("already registered"))
            ) {
                setIsDuplicateEmail(true);
            }

            setError(friendly);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await authService.forgotPassword(email);
            setError(res.message || "Reset link sent! Check your inbox.");
        } catch (err: unknown) {
            setError((err as { message?: string }).message || "Failed to send reset link.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setResendStatus("sending");
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/auth/resend-verification`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: resendEmail }),
                }
            );
            setResendStatus("sent");
        } catch {
            setResendStatus("idle");
        }
    };

    const switchMode = () => {
        setIsSignIn(!isSignIn);
        setIsForgotPassword(false);
        setError(null);
        setNeedsVerification(false);
        setIsDuplicateEmail(false);
        setResendStatus("idle");
    };

    const toggleForgotPassword = () => {
        setIsForgotPassword(!isForgotPassword);
        setError(null);
    };

    const isSuccessMessage = error?.toLowerCase().includes("successful") || error?.toLowerCase().includes("sent!");

    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-white rounded-[32px] overflow-hidden shadow-2xl">
            {/* Left Side: Form */}
            <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center overflow-y-auto scrollbar-hide">
                <div className="max-w-[420px] w-full mx-auto">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3 mb-6">
                        <NextImage
                            src="/img/bufc_logo.png"
                            alt="BUFC Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                        <span className="font-montserrat font-bold text-[18px] tracking-tight text-[#1A1A1A]">BUFC</span>
                    </div>

                    <h2 className="text-[36px] font-bold text-[#1A1A1A] mb-1 leading-tight">
                        {isSignIn ? "Sign in" : "Sign up"}
                    </h2>
                    <p className="text-[15px] text-[#666666] mb-6">
                        {isSignIn
                            ? "Please log in to continue to your account"
                            : "Create an account to join the Hunters family"}
                    </p>

                    {/* Error / Success Banner */}
                    {error && (
                        <div
                            className={`p-4 rounded-xl mb-4 text-sm font-medium ${isSuccessMessage
                                ? "bg-green-50 text-green-700 border border-green-100"
                                : "bg-red-50 text-red-600 border border-red-100"
                                }`}
                        >
                            {error}

                            {/* Resend verification flow */}
                            {needsVerification && (
                                <div className="mt-3 pt-3 border-t border-red-100">
                                    {resendStatus === "sent" ? (
                                        <p className="text-green-600 font-bold flex items-center gap-1.5">
                                            <Icon icon="ph:check-circle-fill" className="w-4 h-4" />
                                            Verification email sent! Check your inbox.
                                        </p>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleResendVerification}
                                            disabled={resendStatus === "sending"}
                                            className="flex items-center gap-1.5 text-[#3F2A78] font-bold hover:underline disabled:opacity-60"
                                        >
                                            {resendStatus === "sending" ? (
                                                <><Icon icon="line-md:loading-twotone-loop" className="w-4 h-4" /> Sending…</>
                                            ) : (
                                                <><Icon icon="ph:envelope-simple-duotone" className="w-4 h-4" /> Resend verification email</>
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Duplicate email — nudge to sign in */}
                            {isDuplicateEmail && (
                                <div className="mt-3 pt-3 border-t border-red-100">
                                    <button
                                        type="button"
                                        onClick={switchMode}
                                        className="flex items-center gap-1.5 text-[#3F2A78] font-bold hover:underline"
                                    >
                                        <Icon icon="ph:sign-in-duotone" className="w-4 h-4" />
                                        Sign in to your existing account
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {isForgotPassword ? (
                        <form className="space-y-6" onSubmit={handleForgotPassword}>
                            <p className="text-sm text-neutral-500 leading-relaxed">
                                Enter your email address and we&apos;ll send you a link to reset your password.
                            </p>
                            <div className="relative group">
                                <div className="absolute -top-2.5 left-4 px-1 bg-white text-[11px] font-medium text-[#3F2A78] z-10">Email</div>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl border border-[#3F2A78] focus:border-[#3F2A78] outline-none placeholder:text-neutral-3 text-[#1A1A1A]"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#3F2A78] hover:bg-[#2A165F] disabled:opacity-70 text-white font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading && <Icon icon="line-md:loading-twotone-loop" className="w-5 h-5" />}
                                Send Reset Link
                            </button>
                            <button
                                type="button"
                                onClick={toggleForgotPassword}
                                className="w-full text-sm font-bold text-[#3F2A78] hover:underline"
                            >
                                Back to Sign in
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Name Field (Sign Up Only) */}
                            {!isSignIn && (
                                <div className="relative group">
                                    <div className="absolute -top-2.5 left-4 px-1 bg-white text-[11px] font-medium text-[#3F2A78] z-10 transition-all">Name</div>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl border border-[#3F2A78] focus:border-[#3F2A78] outline-none transition-all placeholder:text-neutral-3 text-[#1A1A1A]"
                                        required
                                    />
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="relative group">
                                <div className="absolute -top-2.5 left-4 px-1 bg-white text-[11px] font-medium text-[#3F2A78] z-10 transition-all">Email</div>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl border border-[#3F2A78] focus:border-[#3F2A78] outline-none transition-all placeholder:text-neutral-3 text-[#1A1A1A]"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="relative group">
                                <div className="absolute -top-2.5 left-4 px-1 bg-white text-[11px] font-medium text-[#3F2A78] z-10 transition-all">Password</div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl border border-neutral-2 focus:border-[#3F2A78] outline-none transition-all placeholder:text-neutral-3 text-[#1A1A1A]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-4"
                                >
                                    <Icon icon={showPassword ? "ph:eye-slash-light" : "ph:eye-light"} className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Remember Me / Forgot Password */}
                            <div className="flex items-center justify-between py-0.5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-neutral-3 text-[#3F2A78] focus:ring-[#3F2A78]" />
                                    <span className="text-[13px] text-[#1A1A1A] font-medium">Keep me logged in</span>
                                </label>
                                {isSignIn && (
                                    <button
                                        type="button"
                                        onClick={toggleForgotPassword}
                                        className="text-[13px] font-semibold text-[#3F2A78] hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#3F2A78] hover:bg-[#2A165F] disabled:opacity-70 text-white font-bold py-3.5 rounded-full transition-all duration-300 shadow-xl shadow-purple-900/10 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isLoading && <Icon icon="line-md:loading-twotone-loop" className="w-5 h-5" />}
                                {isSignIn ? "Sign in" : "Sign up"}
                            </button>
                        </form>
                    )}

                    {!isForgotPassword && (
                        <p className="mt-6 text-center text-[#666666] text-[13.5px]">
                            {isSignIn ? "Need an account?" : "Already have an account?"}{" "}
                            <button onClick={switchMode} className="text-[#3F2A78] font-bold hover:underline">
                                {isSignIn ? "Create one" : "Sign in here"}
                            </button>
                        </p>
                    )}
                </div>
            </div>

            {/* Right Side: Decorative Image */}
            <div className="hidden md:block w-1/2 relative">
                <NextImage
                    src="/img/auth_modal_bg.png"
                    alt="Decorative Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-white/5" />
            </div>
        </div>
    );
}
