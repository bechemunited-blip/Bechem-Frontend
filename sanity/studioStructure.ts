import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Community Section
      S.listItem()
        .title("Community")
        .child(
          S.list()
            .title("Community")
            .items([
              S.listItem()
                .title("Community Projects")
                .child(
                  S.documentTypeList("communityProject").title("Community Projects")
                ),
              S.listItem()
                .title("Fan Posts")
                .child(
                  S.documentTypeList("fanPost")
                    .title("Fan Posts")
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),
              S.listItem()
                .title("Comments")
                .child(
                  S.documentTypeList("comment")
                    .title("Comments")
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),
              S.listItem()
                .title("Polls")
                .child(
                  S.documentTypeList("poll").title("Polls")
                ),
              S.listItem()
                .title("Poll Votes")
                .child(
                  S.documentTypeList("pollVote").title("Poll Votes")
                ),
              S.listItem()
                .title("Community Events")
                .child(
                  S.documentTypeList("communityEvent")
                    .title("Community Events")
                    .defaultOrdering([{ field: "eventDate", direction: "desc" }])
                ),
              S.listItem()
                .title("Event RSVPs")
                .child(
                  S.documentTypeList("eventRsvp").title("Event RSVPs")
                ),
            ])
        ),
      // Settings Section
      S.listItem()
        .title("Global Settings")
        .child(
          S.list()
            .title("Site Settings")
            .items([
              // Community Page Settings
              S.listItem()
                .title("Community Page Settings")
                .child(
                  S.document()
                    .schemaType("communityPageSettings")
                    .documentId("communityPageSettings")
                ),
              // Home Page Settings
              S.listItem()
                .title("Home Page Settings")
                .child(
                  S.document()
                    .schemaType("homePageSettings")
                    .documentId("homePageSettings")
                ),
              // Club Identity Settings
              S.listItem()
                .title("Club Identity Settings")
                .child(
                  S.document()
                    .schemaType("clubIdentitySettings")
                    .documentId("clubIdentitySettings")
                ),
              // Club Page Settings
              S.listItem()
                .title("Club Page Settings")
                .child(
                  S.document()
                    .schemaType("clubPageSettings")
                    .documentId("clubPageSettings")
                ),
              // News Page Settings
              S.listItem()
                .title("News Page Settings")
                .child(
                  S.document()
                    .schemaType("newsPageSettings")
                    .documentId("newsPageSettings")
                ),
              // Fixtures Page Settings
              S.listItem()
                .title("Fixtures Page Settings")
                .child(
                  S.document()
                    .schemaType("fixturesPageSettings")
                    .documentId("fixturesPageSettings")
                ),
              // Past Highlights Settings
              S.listItem()
                .title("Past Highlights Settings")
                .child(
                  S.document()
                    .schemaType("pastHighlightsSettings")
                    .documentId("pastHighlightsSettings")
                ),
              // Players Page Settings
              S.listItem()
                .title("Players Page Settings")
                .child(
                  S.document()
                    .schemaType("playersPageSettings")
                    .documentId("playersPageSettings")
                ),
              // Shop Page Settings
              S.listItem()
                .title("Shop Page Settings")
                .child(
                  S.document()
                    .schemaType("shopPageSettings")
                    .documentId("shopPageSettings")
                ),
              // Contact Us Settings
              S.listItem()
                .title("Contact Us Settings")
                .child(
                  S.document()
                    .schemaType("contactUsSettings")
                    .documentId("contactUsSettings")
                ),
              // Gallery Page Settings
              S.listItem()
                .title("Gallery Page Settings")
                .child(
                  S.document()
                    .schemaType("galleryPageSettings")
                    .documentId("galleryPageSettings")
                ),
              // Footer Settings
              S.listItem()
                .title("Footer Settings")
                .child(
                  S.document()
                    .schemaType("footerSettings")
                    .documentId("footerSettings")
                ),
              // Newsletter Settings
              S.listItem()
                .title("Newsletter Settings")
                .child(
                  S.document()
                    .schemaType("newsletterSettings")
                    .documentId("newsletterSettings")
                ),
              // Sponsor Settings
              S.listItem()
                .title("Sponsor Settings")
                .child(
                  S.document()
                    .schemaType("sponsorSettings")
                    .documentId("sponsorSettings")
                ),
              // Live Matches Settings
              S.listItem()
                .title("Live Matches & Replays Settings")
                .child(
                  S.document()
                    .schemaType("liveMatchesSettings")
                    .documentId("liveMatchesSettings")
                ),

            ])
        ),

      // Content Types (multiple documents allowed)
      S.listItem()
        .title("News Articles")
        .child(S.documentTypeList("news").title("News Articles")),

      S.listItem()
        .title("Players")
        .child(S.documentTypeList("player").title("Players")),

      S.listItem()
        .title("Club Identity Info")
        .child(
          S.documentTypeList("clubIdentityInfo").title("Club Identity Info")
        ),

      S.listItem()
        .title("ClubPillars")
        .child(S.documentTypeList("clubPillar").title("ClubPillars")),

      S.listItem()
        .title("History Timeline")
        .child(
          S.documentTypeList("history")
            .title("History Timeline")
            .defaultOrdering([{ field: "startYear", direction: "asc" }])
        ),

      S.listItem()
        .title("Staff & Management")
        .child(S.documentTypeList("staffMember").title("Staff & Management")),

      S.listItem()
        .title("Record Breakers")
        .child(S.documentTypeList("recordBreaker").title("Record Breakers")),

      S.listItem()
        .title("Trophies")
        .child(S.documentTypeList("trophy").title("Trophies")),
      S.listItem()
        .title("Wall of Fame")
        .child(S.documentTypeList("wallOfFame").title("Wall of Fame")),
      S.listItem()
        .title("Wall of Fame Categories")
        .child(
          S.documentTypeList("wallOfFameCategory").title(
            "Wall of Fame Categories"
          )
        ),
      S.listItem()
        .title("Facilities")
        .child(S.documentTypeList("facility").title("Facilities")),

      S.listItem()
        .title("Match Fixtures")
        .child(S.documentTypeList("matchFixture").title("Match Fixtures")),

      S.listItem()
        .title("League Standings")
        .child(S.documentTypeList("leagueStandings").title("League Standings")),

      S.listItem()
        .title("Match Highlights")
        .child(S.documentTypeList("matchHighlight").title("Match Highlights")),

      S.listItem()
        .title("Competitions")
        .child(S.documentTypeList("competition").title("Competitions")),

      S.listItem()
        .title("Shop Products")
        .child(S.documentTypeList("product").title("Shop Products")),

      S.listItem()
        .title("GPL Clubs")
        .child(S.documentTypeList("gplClub").title("GPL Clubs")),

      S.listItem()
        .title("Gallery Images")
        .child(S.documentTypeList("galleryImage").title("Gallery Images")),
    ]);
