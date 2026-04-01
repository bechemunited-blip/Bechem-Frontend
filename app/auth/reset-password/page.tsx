"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { authService } from "@/lib/api/auth";
import Link from "next/link";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing reset token. Please request a new link.");
            return;
        }

        if (password !== confirmPassword) {
            setStatus("error");
            setMessage("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setStatus("idle");

        try {
            await authService.resetPassword({ token, newPassword: password });
            setStatus("success");
            setMessage("Your password has been reset successfully! You can now sign in with your new password.");
            setTimeout(() => router.push("/auth/sign-in"), 3000);
        } catch (err: unknown) {
            setStatus("error");
            setMessage((err as { message?: string }).message || "Failed to reset password. The link may have expired.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 md:p-10">
            <h1 className="text-2xl font-black text-[#1A1A1A] mb-2 uppercase">Reset Password</h1>
            <p className="text-neutral-500 text-sm mb-8">Please enter your new password below.</p>

            {status !== "idle" && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${status === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                    }`}>
                    {message}
                </div>
            )}

            {status !== "success" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute -top-2.5 left-4 px-1 bg-white text-[11px] font-medium text-[#3F2A78] z-10 transition-all">New Password</div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl border border-[#3F2A78] focus:border-[#3F2A78] outline-none transition-all placeholder:text-neutral-3 text-[#1A1A1A]"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-4"
                        >
                            <Icon icon={showPassword ? "ph:eye-slash-light" : "ph:eye-light"} className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative group">
                        <div className="absolute -top-2.5 left-4 px-1 bg-white text-[11px] font-medium text-[#3F2A78] z-10 transition-all">Confirm Password</div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl border border-neutral-2 focus:border-[#3F2A78] outline-none transition-all placeholder:text-neutral-3 text-[#1A1A1A]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#3F2A78] hover:bg-[#2A165F] disabled:opacity-70 text-white font-bold py-3.5 rounded-full transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
                    >
                        {isLoading && <Icon icon="line-md:loading-twotone-loop" className="w-5 h-5" />}
                        Reset Password
                    </button>
                </form>
            )}

            {status === "success" && (
                <Link
                    href="/auth/sign-in"
                    className="w-full bg-[#3F2A78] hover:bg-[#2A165F] text-white font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 mt-4"
                >
                    Go to Sign In
                </Link>
            )}

            <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                <Link href="/auth/sign-in" className="text-sm font-bold text-[#3F2A78] hover:underline">
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
