import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getWelcomeEmailHtml } from "@/components/emails/WelcomeEmail";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
    try {
        const { email, source } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { success: false, message: "Valid email is required" },
                { status: 400 }
            );
        }

        // LOGGING (As requested in Issue 2, Step 3)
        console.log(`[Newsletter Signup] Email: ${email}, Source: ${source || "footer"}`);

        // If Resend is configured, try sending a real welcome email
        if (resend) {
            try {
                const { data, error } = await resend.emails.send({
                    from: "BUFC Newsletter <onboarding@resend.dev>",
                    to: [email],
                    subject: "Welcome to the Hunters Pack! 🦁",
                    html: getWelcomeEmailHtml(email),
                });

                if (error) {
                    console.error("[Resend Error]:", error);
                    return NextResponse.json(
                        { success: false, message: error.message },
                        { status: 400 }
                    );
                }

                console.log("[Resend Success]: Email sent successfully", data?.id);
                return NextResponse.json({
                    success: true,
                    message: "Subscription successful — check your inbox for a welcome email!"
                });
            } catch (err) {
                console.error("[Email Sending Exception]:", err);
                return NextResponse.json(
                    { success: false, message: "Failed to send welcome email. Please try again later." },
                    { status: 500 }
                );
            }
        }

        // FALLBACK: Simulation Mode (If no API key is provided)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (email.includes("error")) {
            return NextResponse.json(
                { success: false, message: "Email service connection timed out. Please try again later." },
                { status: 502 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Successfully subscribed! (Admin: Add RESEND_API_KEY to .env.local for real emails)",
            debugEmail: email
        });

    } catch (error) {
        console.error("[Newsletter API Error]:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
