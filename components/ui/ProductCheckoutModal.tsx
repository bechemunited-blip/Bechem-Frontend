"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/store/hooks/useAuth";

interface ProductCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productId: string;
    price: number;
    selectedSize: string;
}

type PayMethod = "card" | "momo";

export default function ProductCheckoutModal({
    isOpen,
    onClose,
    productName,
    productId,
    price,
    selectedSize,
}: ProductCheckoutModalProps) {
    const { user } = useAuth();
    const [step, setStep] = useState<"form" | "processing" | "success" | "error">("form");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [payMethod, setPayMethod] = useState<PayMethod>("card");
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) {
            setErrorMsg("Please fill in all required fields.");
            return;
        }
        setErrorMsg("");
        setLoading(true);
        setStep("processing");

        try {
            const res = await fetch("/api/shop/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    name,
                    productId,
                    productName,
                    price,
                    size: selectedSize,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Payment initiation failed.");

            if (data.authorizationUrl) {
                window.open(data.authorizationUrl, "_blank");
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
        setName(user?.name || "");
        setEmail(user?.email || "");
        setErrorMsg("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={resetModal}
                        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none"
                    >
                        <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden pointer-events-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="bg-primary px-6 py-5 text-white text-center relative shrink-0">
                                <button
                                    onClick={resetModal}
                                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-1"
                                >
                                    <Icon icon="ph:x-bold" className="w-5 h-5" />
                                </button>
                                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />
                                <h3 className="font-mona-sans font-bold text-xl md:text-2xl mb-1">
                                    {step === "success"
                                        ? "Order Initiated!"
                                        : step === "error"
                                            ? "Something went wrong"
                                            : "Complete Purchase"}
                                </h3>
                                <p className="text-white/70 text-xs font-montserrat line-clamp-1">{productName}</p>
                            </div>

                            {/* Body */}
                            <div className="p-5 md:p-8 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {step === "success" && (
                                        <motion.div key="success" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
                                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                                <Icon icon="ph:check-circle-fill" className="w-12 h-12" />
                                            </div>
                                            <h4 className="font-mona-sans font-bold text-2xl text-neutral-900 mb-3">Payment Initiated!</h4>
                                            <p className="text-neutral-500 text-sm mb-8 font-montserrat leading-relaxed max-w-sm mx-auto">
                                                Complete your payment in the Paystack window. A confirmation will be sent to your email once the transaction is verified.
                                            </p>
                                            <Button onClick={resetModal} fullWidth buttonClassName="py-4">Done</Button>
                                        </motion.div>
                                    )}

                                    {step === "error" && (
                                        <motion.div key="error" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
                                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                                <Icon icon="ph:warning-circle-fill" className="w-12 h-12" />
                                            </div>
                                            <h4 className="font-mona-sans font-bold text-xl text-neutral-900 mb-3">Checkout Failed</h4>
                                            <p className="text-neutral-500 text-sm mb-8">{errorMsg}</p>
                                            <div className="flex gap-3">
                                                <Button variant="outline" onClick={() => setStep("form")} fullWidth>Try Again</Button>
                                                <Button onClick={resetModal} fullWidth>Close</Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === "processing" && (
                                        <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                                            <Icon icon="line-md:loading-twotone-loop" className="w-16 h-16 text-primary mx-auto mb-4" />
                                            <p className="font-bold text-neutral-700">Initiating payment...</p>
                                        </motion.div>
                                    )}

                                    {step === "form" && (
                                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            {/* Order Summary */}
                                            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 mb-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-bold text-neutral-600">{productName}</span>
                                                    <span className="text-lg font-black text-primary">GH₵ {price.toFixed(2)}</span>
                                                </div>
                                                {selectedSize && (
                                                    <p className="text-xs text-neutral-400">Size: <span className="font-bold text-neutral-600">{selectedSize}</span></p>
                                                )}
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
                                                    <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Receipt email" required />
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
                                                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm transition-all ${payMethod === pm.id ? "border-primary bg-primary/5 text-primary" : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300"}`}
                                                            >
                                                                <Icon icon={pm.icon} className="w-5 h-5" />
                                                                {pm.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {errorMsg && (
                                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{errorMsg}</div>
                                                )}

                                                <div className="pt-2">
                                                    <Button
                                                        type="submit"
                                                        fullWidth
                                                        loading={loading}
                                                        buttonClassName="py-4 text-base shadow-lg shadow-primary/20"
                                                    >
                                                        Pay GH₵ {price.toFixed(2)} via {payMethod === "momo" ? "MoMo" : "Card"}
                                                    </Button>
                                                </div>

                                                <p className="text-center text-[10px] text-neutral-400 flex items-center justify-center gap-1.5 pt-1">
                                                    <Icon icon="ph:lock-key-fill" className="w-3 h-3" />
                                                    Secured by Paystack
                                                </p>
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
