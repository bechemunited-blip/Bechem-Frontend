
const { createClient } = require("@sanity/client");
const fs = require("fs");

const client = createClient({
    projectId: "u9ra5r4a",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
});

async function test() {
    const query = `*[_id == "homePageSettings"][0]`;
    const settings = await client.fetch(query);
    const log = [];
    log.push("Settings from Sanity: " + JSON.stringify(settings, null, 2));

    const newsQuery = `*[_type == "news"] | order(isFeatured desc, publishedAt desc) [0]`;
    const news = await client.fetch(newsQuery);
    log.push("Most recent news: " + (news ? news.title : "None"));

    fs.writeFileSync("sanity_debug.log", log.join("\n"));
    console.log("Logged to sanity_debug.log");
}

test();
