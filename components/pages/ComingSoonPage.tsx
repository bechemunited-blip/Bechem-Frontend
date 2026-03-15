"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiArrowRight, FiCheckCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

interface ComingSoonPageProps {
    title: string;
    description: string;
    context: "tickets" | "live";
}

export default function ComingSoonPage({ title, description, context }: ComingSoonPageProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        try {
            // Simulate API call
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source: context }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setEmail("");
            } else {
                setStatus("error");
                setErrorMessage(data.message || "Something went wrong. Please try again.");
            }
        } catch {
            setStatus("error");
            setErrorMessage("Could not connect to the server. Please check your connection.");
        }
    };

    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0F0A1E]">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="container-wide relative z-10 flex flex-col items-center px-6 py-20">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
                >
                    <span className="text-primary text-xs md:text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Coming Soon
                    </span>
                </motion.div>

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center max-w-3xl mb-12"
                >
                    <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                        {title} <span className="text-primary italic">ON THE WAY</span>
                    </h1>
                    <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        {description}
                    </p>
                </motion.div>

                {/* Email Capture Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-lg"
                >
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 md:p-10 rounded-[40px] shadow-2xl">
                        <h3 className="text-white text-xl font-bold mb-6 text-center">Get notified when we launch</h3>

                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center text-center py-4"
                                >
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                        <FiCheckCircle className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h4 className="text-white text-lg font-bold">You&apos;re on the list!</h4>
                                    <p className="text-neutral-400 mt-2">We&apos;ll send you an update as soon as {context === "tickets" ? "ticketing" : "live streaming"} is ready.</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="mt-6 text-primary hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                                    >
                                        Register another email
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="relative">
                                        <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={status === "loading"}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full bg-primary hover:bg-prim-4 text-white font-bold py-4.5 rounded-2xl shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50"
                                    >
                                        {status === "loading" ? (
                                            <Icon icon="eos-icons:loading" className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                Notify Me
                                                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    {status === "error" && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-400 text-sm flex items-center gap-2 justify-center"
                                        >
                                            <FiAlertCircle className="w-4 h-4" />
                                            {errorMessage}
                                        </motion.p>
                                    )}
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12"
                >
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-neutral-500 hover:text-white transition-all font-medium"
                    >
                        <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Home pitch
                    </Link>
                </motion.div>

                {/* Progress Bar */}
                <div className="mt-20 w-full max-w-xs h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-primary shadow-[0_0_10px_rgba(63,42,120,0.8)]"
                    />
                </div>
                <p className="mt-4 text-white/20 text-[10px] font-black tracking-[0.3em] uppercase">
                    Preparation in Progress
                </p>
            </div>

            {/* Floating Logo */}
            <div className="absolute bottom-10 left-10 opacity-10 hidden lg:block">
                <Image src="/img/bufc_logo.png" alt="BUFC" width={100} height={100} className="grayscale invert" />
            </div>
        </main>
    );
}
