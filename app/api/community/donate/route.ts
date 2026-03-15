import { NextRequest, NextResponse } from "next/server";

// POST /api/community/donate
// Body: { name, email, amount, projectTitle, method }
//
// Integrates with Paystack to initiate a payment and return an authorization URL.
// Docs: https://paystack.com/docs/api/transaction/#initialize

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const stripHtml = (str: string) => str ? str.replace(/<[^>]*>/g, "").trim() : str;

        const name = stripHtml(body.name);
        const email = body.email;
        const amount = Number(body.amount);
        const projectTitle = stripHtml(body.projectTitle);
        const method = body.method;

        if (!name || !email || !projectTitle) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        if (!amount || !Number.isFinite(amount) || amount < 1 || amount > 1000000) {
            return NextResponse.json({ error: "Invalid donation amount. Must be between 1 and 1,000,000 GHS." }, { status: 400 });
        }

        if (!process.env.PAYSTACK_SECRET_KEY) {
            // Dev mode: return a simulated response so the modal works without real keys
            return NextResponse.json({
                success: true,
                simulated: true,
                message: "Paystack not configured. Donation logged locally.",
            });
        }

        const amountInKobo = Math.round(amount * 100); // Paystack uses kobo (100ths of GHS)

        const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                amount: amountInKobo,
                currency: "GHS",
                metadata: {
                    custom_fields: [
                        { display_name: "Donor Name", variable_name: "donor_name", value: name },
                        { display_name: "Project", variable_name: "project_title", value: projectTitle },
                        { display_name: "Payment Method", variable_name: "method", value: method },
                    ],
                },
                channels: method === "momo" ? ["mobile_money"] : ["card"],
                // Redirect back after payment
                callback_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://bufc.com"}/community?payment=success`,
            }),
        });

        const data = await paystackRes.json();

        if (!data.status) {
            return NextResponse.json({ error: data.message || "Payment initiation failed." }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            authorizationUrl: data.data?.authorization_url,
            reference: data.data?.reference,
        });
    } catch (err: unknown) {
        console.error("Donate API error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
