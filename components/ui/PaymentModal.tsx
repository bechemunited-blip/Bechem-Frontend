"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useAuth } from "@/store/hooks/useAuth";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectTitle: string;
    initialMode?: "volunteer" | "donate";
}

type Mode = "volunteer" | "donate";
type PayMethod = "card" | "momo";

const DONATION_AMOUNTS = [50, 100, 200, 500, 1000];

export default function PaymentModal({
    isOpen,
    onClose,
    projectTitle,
    initialMode = "volunteer",
}: PaymentModalProps) {
    const { user } = useAuth();
    const [mode, setMode] = useState<Mode>(initialMode);
    const [step, setStep] = useState<"form" | "processing" | "success" | "error">("form");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [customAmount, setCustomAmount] = useState("");
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [payMethod, setPayMethod] = useState<PayMethod>("card");

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        skills: "",
        message: "",
    });

    // Pre-fill when user is logged in
    useEffect(() => {
        if (user) setFormData((p) => ({ ...p, name: user.name, email: user.email }));
    }, [user]);

    // Reset when mode changes
    useEffect(() => { setMode(initialMode); }, [initialMode]);

    const finalAmount = selectedAmount ?? (customAmount ? parseInt(customAmount) : 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === "donate" && finalAmount < 1) {
            setErrorMsg("Please select or enter a donation amount.");
            return;
        }
        setErrorMsg("");
        setLoading(true);
        setStep("processing");

        try {
            if (mode === "volunteer") {
                // Send volunteer registration to our API
                const res = await fetch("/api/community/volunteer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        skills: formData.skills,
                        message: formData.message,
                        projectTitle,
                    }),
                });
                if (!res.ok) throw new Error("Failed to submit registration.");
            } else {
                // Initiate Paystack payment
                const res = await fetch("/api/community/donate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        amount: finalAmount,
                        projectTitle,
                        method: payMethod,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Payment initiation failed.");

                // If Paystack returns a payment URL, open it
                if (data.authorizationUrl) {
                    window.open(data.authorizationUrl, "_blank");
                }
            }
            setStep("success");
        } catch (err: unknown) {
            setErrorMsg((err as Error).message || "Something went wrong. Please try again.");
            setStep("error");
        } finally {
            setLoading(false);
        }
    };

    const resetModal = () => {
        setStep("form");
        setMode(initialMode);
        setFormData({ name: user?.name || "", email: user?.email || "", phone: "", skills: "", message: "" });
        setSelectedAmount(null);
        setCustomAmount("");
        setErrorMsg("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={resetModal}
                        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none"
                    >
                        <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden pointer-events-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="bg-[#3F2A78] px-6 py-5 text-white text-center relative shrink-0">
                                <button
                                    onClick={resetModal}
                                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-1"
                                >
                                    <Icon icon="ph:x-bold" className="w-5 h-5" />
                                </button>
                                {/* Drag handle for mobile */}
                                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />
                                <h3 className="font-mona-sans font-bold text-xl md:text-2xl mb-1">
                                    {step === "success"
                                        ? "Thank You! 🎉"
                                        : step === "error"
                                            ? "Something went wrong"
                                            : mode === "volunteer"
                                                ? "Volunteer Registration"
                                                : "Make a Donation"}
                                </h3>
                                <p className="text-white/70 text-xs font-montserrat line-clamp-1">{projectTitle}</p>
                            </div>

                            {/* Body */}
                            <div className="p-5 md:p-8 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {/* ── Success ── */}
                                    {step === "success" && (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-6"
                                        >
                                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                                <Icon icon="ph:check-circle-fill" className="w-12 h-12" />
                                            </div>
                                            <h4 className="font-mona-sans font-bold text-2xl text-neutral-900 mb-3">
                                                {mode === "volunteer" ? "Registration Submitted!" : "Payment Initiated!"}
                                            </h4>
                                            <p className="text-neutral-500 text-sm mb-8 font-montserrat leading-relaxed max-w-sm mx-auto">
                                                {mode === "volunteer"
                                                    ? "Thank you for volunteering! We will contact you at the email provided with further details within 48 hours."
                                                    : "Your donation is being processed. A receipt will be sent to your email once confirmed."}
                                            </p>
                                            <Button onClick={resetModal} fullWidth buttonClassName="py-4">
                                                Done
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* ── Error ── */}
                                    {step === "error" && (
                                        <motion.div
                                            key="error"
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-6"
                                        >
                                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                                <Icon icon="ph:warning-circle-fill" className="w-12 h-12" />
                                            </div>
                                            <h4 className="font-mona-sans font-bold text-xl text-neutral-900 mb-3">Submission Failed</h4>
                                            <p className="text-neutral-500 text-sm mb-8">{errorMsg}</p>
                                            <div className="flex gap-3">
                                                <Button variant="outline" onClick={() => setStep("form")} fullWidth>
                                                    Try Again
                                                </Button>
                                                <Button onClick={resetModal} fullWidth>Close</Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* ── Processing ── */}
                                    {step === "processing" && (
                                        <motion.div
                                            key="processing"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-12"
                                        >
                                            <Icon icon="line-md:loading-twotone-loop" className="w-16 h-16 text-primary mx-auto mb-4" />
                                            <p className="font-bold text-neutral-700">
                                                {mode === "volunteer" ? "Submitting your registration…" : "Initiating payment…"}
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* ── Form ── */}
                                    {step === "form" && (
                                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            {/* Mode Switcher */}
                                            <div className="flex bg-neutral-100 p-1 rounded-full mb-6">
                                                {(["volunteer", "donate"] as Mode[]).map((m) => (
                                                    <button
                                                        key={m}
                                                        onClick={() => setMode(m)}
                                                        className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all capitalize ${mode === m ? "bg-white text-[#3F2A78] shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
                                                    >
                                                        {m === "volunteer" ? "🙋 Volunteer" : "💛 Donate"}
                                                    </button>
                                                ))}
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                {mode === "volunteer" ? (
                                                    <>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <Input label="Full Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your full name" required />
                                                            <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+233 XX XXX XXXX" required />
                                                        </div>
                                                        <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" required />
                                                        <Input label="Skills / Interests" name="skills" value={formData.skills} onChange={handleInputChange} placeholder="e.g. Teaching, medical, organizing…" />
                                                        <Textarea label="Message (Optional)" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us why you want to volunteer…" rows={3} />
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* Amount Picker */}
                                                        <div>
                                                            <label className="block text-sm font-bold text-neutral-700 mb-3">Select Amount (GHS)</label>
                                                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                                                                {DONATION_AMOUNTS.map(amount => (
                                                                    <button
                                                                        key={amount}
                                                                        type="button"
                                                                        onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                                                                        className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${selectedAmount === amount ? "bg-[#3F2A78] text-white border-[#3F2A78] shadow-md" : "bg-white text-neutral-600 border-neutral-200 hover:border-[#3F2A78]"}`}
                                                                    >
                                                                        {amount}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <div className="relative">
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">GHS</span>
                                                                <input
                                                                    type="number"
                                                                    min={1}
                                                                    placeholder="Custom amount"
                                                                    value={customAmount}
                                                                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                                                                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-[#3F2A78] focus:ring-2 focus:ring-[#3F2A78]/10 outline-none transition-all placeholder:text-neutral-400 font-bold text-neutral-900"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <Input label="Full Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name as on payment" required />
                                                            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Receipt email" required />
                                                        </div>

                                                        {/* Payment Method */}
                                                        <div>
                                                            <label className="block text-sm font-bold text-neutral-700 mb-2">Payment Method</label>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {([
                                                                    { id: "card" as const, icon: "ph:credit-card-duotone", label: "Card" },
                                                                    { id: "momo" as const, icon: "ph:device-mobile-camera-duotone", label: "Mobile Money" },
                                                                ]).map((pm) => (
                                                                    <button
                                                                        key={pm.id}
                                                                        type="button"
                                                                        onClick={() => setPayMethod(pm.id)}
                                                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm transition-all ${payMethod === pm.id ? "border-[#3F2A78] bg-[#3F2A78]/5 text-[#3F2A78]" : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300"}`}
                                                                    >
                                                                        <Icon icon={pm.icon} className="w-5 h-5" />
                                                                        {pm.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Amount summary */}
                                                        {finalAmount > 0 && (
                                                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center justify-between">
                                                                <span className="text-sm font-bold text-neutral-600">Total Donation</span>
                                                                <span className="text-2xl font-black text-primary">GHS {finalAmount.toLocaleString()}</span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {errorMsg && (
                                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{errorMsg}</div>
                                                )}

                                                <div className="pt-2">
                                                    <Button
                                                        type="submit"
                                                        fullWidth
                                                        loading={loading}
                                                        buttonClassName="py-4 text-base bg-[#3F2A78] hover:bg-[#2A165F] shadow-lg shadow-[#3F2A78]/20"
                                                    >
                                                        {mode === "volunteer" ? "Submit Registration" : `Donate GHS ${finalAmount > 0 ? finalAmount : "..."} via ${payMethod === "momo" ? "MoMo" : "Card"}`}
                                                    </Button>
                                                </div>

                                                {/* Powered by Paystack badge */}
                                                {mode === "donate" && (
                                                    <p className="text-center text-[10px] text-neutral-400 flex items-center justify-center gap-1.5 pt-1">
                                                        <Icon icon="ph:lock-key-fill" className="w-3 h-3" />
                                                        Secured by Paystack • PCI DSS Compliant
                                                    </p>
                                                )}
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
