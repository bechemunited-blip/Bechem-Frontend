import { NextRequest, NextResponse } from "next/server";

// POST /api/community/volunteer
// Body: { name, email, phone, skills, message, projectTitle }
// TODO: when ready to send emails, run `npm install resend` and uncomment the email block below.

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const stripHtml = (str: string) => str ? str.replace(/<[^>]*>/g, "").trim() : str;

        const name = stripHtml(body.name);
        const email = body.email;
        const phone = body.phone;
        const projectTitle = stripHtml(body.projectTitle);
        const skills = stripHtml(body.skills || "");
        const message = stripHtml(body.message || "");

        if (!name || !email || !phone || !projectTitle) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        // ── Email sending (requires `npm install resend` + RESEND_API_KEY in env) ──
        // Uncomment when resend is installed:
        //
        // if (process.env.RESEND_API_KEY) {
        //     const { Resend } = await import("resend");
        //     const resend = new Resend(process.env.RESEND_API_KEY);
        //     try {
        //         await resend.emails.send({
        //             from: "BUFC Community <noreply@bufc.com>",
        //             to: email,
        //             subject: `Volunteer Registration Confirmed — ${projectTitle}`,
        //             html: `
        //                 <h2>Thank you for volunteering, ${name}!</h2>
        //                 <p>We received your registration for <strong>${projectTitle}</strong>.</p>
        //                 <p>Our team will reach out within 48 hours at this email or on ${phone}.</p>
        //                 ${skills ? `<p><strong>Skills:</strong> ${skills}</p>` : ""}
        //                 ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
        //                 <p>Thank you for supporting the Bechem United community! 💛</p>
        //             `,
        //         });
        //     } catch (emailErr) {
        //         console.error("Email send failed (non-blocking):", emailErr);
        //     }
        // }

        // ── Optional: persist to DB / Sanity ─────────────────────────────────────
        // await sanityClient.create({ _type: "volunteerApplication", name, email, phone, skills, message, projectTitle });

        console.log("[Volunteer] Registration received:", { name, email, phone, projectTitle, skills, message });

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        console.error("Volunteer API error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
