
import { createClient } from "@sanity/client";

const client = createClient({
    projectId: "u9ra5r4a",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
});

async function test() {
    const query = `*[_id == "homePageSettings"][0]`;
    const settings = await client.fetch(query);
    console.log("Settings from Sanity:", JSON.stringify(settings, null, 2));

    const newsQuery = `*[_type == "news"] | order(isFeatured desc, publishedAt desc) [0]`;
    const news = await client.fetch(newsQuery);
    console.log("Most recent news:", news?.title);
}

test();
