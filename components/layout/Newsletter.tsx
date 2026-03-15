"use client";

import { NewsletterSettings } from "@/lib/types";
import { useState } from "react";
import Button from "../ui/Button";
import Image from "next/image";
import { Icon } from "@iconify/react";

interface NewsletterProps {
  settings: NewsletterSettings;
}

export default function Newsletter({ settings }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setSuccessMessage(data.message || "Subscription successful — check your inbox.");
        setEmail("");
        // Reset to idle after 8 seconds to give more time to read
        setTimeout(() => setStatus("idle"), 8000);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Service unavailable. Please try again later.");
    }
  };

  return (
    <section className="relative min-h-[450px] px-5 overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="/img/newsletter_bg.jpeg"
        alt="Soccer pitch"
        fill
        className="object-cover object-[50%_61%]"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <div className="relative z-10 w-full container-wide">
        <div className="flex flex-col items-center mx-auto text-center">
          {/* Title */}
          <h2 className="text-neutral-1 text-2xl xs:text-3xl md:text-4xl font-semibold mb-4">
            {settings.sectionTitle}
          </h2>

          {/* Subtext */}
          <p className="max-w-[300px] md:max-w-[360px] text-neutral-5 font-medium text-sm md:text-base mb-8 leading-relaxed">
            {settings.sectionSubtext}
          </p>

          {/* Email Form */}
          <form
            onSubmit={handleSubmit}
            className="focus-within:border-primary-hover transition-colors duration-300 ease-in-out flex justify-between gap-2 border border-neutral-5 rounded-full overflow-hidden w-full max-w-xl py-1.5 pr-1.5 bg-black/30 mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={settings.inputPlaceholder}
              required
              disabled={status === "loading" || status === "success"}
              className="text-sm w-full pl-5 py-3 text-neutral-1 placeholder:text-neutral-5 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={status === "loading" || status === "success"}
              buttonClassName="!px-6 xs:!px-8 whitespace-nowrap"
            >
              {status === "loading" && (
                <Icon
                  icon="eos-icons:loading"
                  className="w-5 h-5 animate-spin"
                />
              )}
              {status === "success" && (
                <Icon icon="mdi:check-circle" className="w-5 h-5" />
              )}
              {status === "idle" && settings.buttonText}
              {status === "error" && "Try Again"}
            </Button>
          </form>

          {/* Success Message */}
          {status === "success" && (
            <p className="text-prim-4 text-sm mt-4 animate-fade-in">
              {successMessage}
            </p>
          )}

          {/* Error Message (Issue 2, Step 3) */}
          {status === "error" && (
            <p className="text-red-400 text-sm mt-4 animate-fade-in flex items-center gap-2">
              <Icon icon="mdi:alert-circle" />
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
