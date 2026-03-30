import { newsType } from "./news";
import { productType } from "./product";
import { playerType } from "./player";
import { gplClubType } from "./gplCubType";
import { competitionType } from "./competition";
import { galleryImageType } from "./galleryImage";
import { homePageSettingsType } from "./homePageSettings";
import { contactUsSettingsType } from "./contactUsSettings";
import { galleryPageSettingsType } from "./galleryPageSettings";
import footerSettings from "./footerSettings";
import { sponsorSettingsType } from "./sponsorSettings";
import { liveMatchesSettingsType } from "./liveMatchesSettings";
import { newsletterSettingsType } from "./newsletterSettings";
import { clubIdentitySettingsType } from "./clubIdentitySettings";
import { clubIdentityInfoType } from "./clubIdentityInfo";
import { clubPillarType } from "./clubPillar";
import { facilityType } from "./facility";
import { staffMemberType } from "./staffMember";
import { wallOfFameType } from "./wallOfFame";
import { wallOfFameCategoryType } from "./wallOfFameCategory";
import { matchHighlightType } from "./matchHighlight";
import { matchFixtureType } from "./matchFixture";
import { newsPageSettingsType } from "./newsPageSettings";
import { clubPageSettingsType } from "./clubPageSettings";
import { fixturesPageSettingsType } from "./fixturesPageSettings";
import { pastHighlightsSettingsType } from "./pastHighlightsSettings";
import { playersPageSettingsType } from "./playersPageSettings";
import { shopPageSettingsType } from "./shopPageSettings";
import { trophyType } from "./trophy";
import { recordBreakerType } from "./recordBreaker";
import { historyType } from "./history";
import leagueStandings from "./leagueStandings";
import { communityProjectType } from "./communityProject";
import { communityPageSettingsType } from "./communityPageSettings";
import { fanPostType } from "./fanPost";
import { commentType } from "./comment";
import { pollType } from "./poll";
import { pollVoteType } from "./pollVote";
import { communityEventType } from "./communityEvent";
import { eventRsvpType } from "./eventRsvp";

export const schemaTypes = [
  // Content Types
  newsType,
  productType,
  playerType,
  gplClubType,
  competitionType,
  galleryImageType,
  facilityType,
  staffMemberType,
  wallOfFameType,
  matchHighlightType,
  matchFixtureType,
  trophyType,
  recordBreakerType,
  clubIdentityInfoType,
  clubPillarType,
  wallOfFameCategoryType,
  historyType,

  leagueStandings,
  communityProjectType,
  fanPostType,
  commentType,
  pollType,
  pollVoteType,
  communityEventType,
  eventRsvpType,

  // Settings (Singletons)
  homePageSettingsType,
  contactUsSettingsType,
  galleryPageSettingsType,
  footerSettings,
  sponsorSettingsType,
  liveMatchesSettingsType,
  newsletterSettingsType,
  clubIdentitySettingsType,
  newsPageSettingsType,
  clubPageSettingsType,
  fixturesPageSettingsType,
  pastHighlightsSettingsType,
  playersPageSettingsType,
  shopPageSettingsType,
  communityPageSettingsType,
];
