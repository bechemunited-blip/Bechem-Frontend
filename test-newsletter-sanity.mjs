import { createClient } from "@sanity/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2023-05-03",
    useCdn: false,
});

async function main() {
    const query = `*[_id == "newsletterSettings"][0]`;
    const data = await client.fetch(query);
    console.log("Newsletter Settings:", JSON.stringify(data, null, 2));
}

main().catch(console.error);
