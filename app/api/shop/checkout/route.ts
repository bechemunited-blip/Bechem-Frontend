import { NextRequest, NextResponse } from "next/server";

// POST /api/shop/checkout
// Body: { email, name, productId, productName, price, size }
//
// Initiates a Paystack transaction for product purchases.

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const stripHtml = (str: string) => str ? str.replace(/<[^>]*>/g, "").trim() : str;

        const email = body.email;
        const name = stripHtml(body.name);
        const productId = body.productId;
        const productName = stripHtml(body.productName);
        const price = Number(body.price);
        const size = body.size || "N/A";

        if (!email || !productName || !price) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        if (!Number.isFinite(price) || price < 1 || price > 1000000) {
            return NextResponse.json({ error: "Invalid price. Must be between 1 and 1,000,000 GHS." }, { status: 400 });
        }

        if (!process.env.PAYSTACK_SECRET_KEY) {
            return NextResponse.json({
                success: true,
                simulated: true,
                message: "Paystack not configured. Order logged locally.",
            });
        }

        const amountInPesewas = Math.round(price * 100);

        const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                amount: amountInPesewas,
                currency: "GHS",
                metadata: {
                    custom_fields: [
                        { display_name: "Customer Name", variable_name: "customer_name", value: name },
                        { display_name: "Product", variable_name: "product_name", value: productName },
                        { display_name: "Product ID", variable_name: "product_id", value: productId },
                        { display_name: "Size", variable_name: "size", value: size },
                    ],
                },
                channels: ["card", "mobile_money"],
                callback_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://bufc.com"}/shop?payment=success`,
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
        console.error("Checkout API error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
