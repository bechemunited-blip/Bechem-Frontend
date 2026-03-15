// IMAGE TYPE (for Sanity images)
export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
  };
}

// SLUG TYPE
export interface Slug {
  _type: "slug";
  current: string;
}

// PORTABLE TEXT (Rich text content)
export interface PortableTextBlock {
  _type: "block";
  style?: string;
  children: Array<{
    _type: "span";
    text: string;
    marks?: string[];
  }>;
}

// GPL CLUB INTERFACE
export interface GPLClub {
  _id: string;
  _type: "gplClub";
  clubName: string;
  clubLogo: SanityImage;
  founded?: number;
  stadium?: string;
  isActive: boolean;
}

export interface CareerEntry {
  _key?: string;
  isGPLClub?: boolean;
  // GPL Club fields
  gplClubReference?: {
    _type?: "reference";
    _ref?: string;
    // Populated fields (from query with ->)
    _id?: string;
    clubName?: string;
    clubLogo?: SanityImage;
    founded?: number;
    stadium?: string;
    isActive?: boolean;
  };
  // Custom Club fields
  customClubName?: string;
  customClubLogo?: SanityImage;
  // Common fields
  role?: "goalkeeper" | "defender" | "midfielder" | "forward";
  startYear?: number;
  endYear?: number;
  isCurrent?: boolean;
  achievements?: string[];
}

// PLAYER INTERFACE
export interface Player {
  _id: string;
  _type: "player";
  fullName: string;
  jerseyNumber: number;
  position: "goalkeeper" | "defender" | "midfielder" | "forward";
  positionDetail?: string;
  photo?: SanityImage | null;
  photoBanner?: SanityImage | null;
  biography?: PortableTextBlock[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  dateOfBirth?: string;
  nationality: string;
  height?: number;
  strongFoot?: "Left" | "Right" | "Both";
  commonStatistics?: {
    matchesPlayed?: number;
    goalsScored?: number;
    assists?: number;
    minutesPlayed?: number;
    speedIn30Meters?: number;
    yellowCards?: number;
    redCards?: number;
  };
  goalkeeperStats?: {
    cleanSheets?: number;
    saves?: number;
    goalsConceded?: number;
  };
  defenderStats?: {
    tacklesAndInterceptions?: number;
    blocks?: number;
    clearances: number;
  };
  midfielderStats?: {
    shotsOnTarget?: number;
    tacklesAndInterceptions?: number;
    dribbles?: number;
  };
  forwardStats?: {
    shotsOnTarget?: number;
    tacklesAndInterceptions?: number;
    dribbles?: number;
  };
  careerExperience?: CareerEntry[];
}

// NEWS ARTICLE INTERFACE
export interface NewsArticle {
  _id: string;
  _type: "news";
  title: string;
  slug: Slug;
  excerpt?: string;
  featuredImage: SanityImage;
  content?: PortableTextBlock[];
  author: string;
  authorImage: SanityImage;
  readTime?: number;
  publishedAt: string;
  category: string;
  isFeatured?: boolean;
}

// NEWS PAGE SETTINGS
export interface NewsPageSettings {
  pageTitle: string;
  pageBannerImage: SanityImage;
  featuredNewsSectionTitle: string;
  featuredNewsSectionSubtext: string;
  latestUpdatesSectionTitle: string;
  latestUpdatesSectionSubtext: string;
}

// MATCH FIXTURE INTERFACE
export interface MatchFixture {
  _id: string;
  _type: "matchFixture";
  competition: string;
  matchday?: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string; // External fallback logo URL
  awayLogo?: string; // External fallback logo URL
  matchDate: string;
  venue?: string;
  status: "upcoming" | "live" | "finished" | "postponed" | "cancelled";
  homeScore?: number;
  awayScore?: number;
}

// FIXTURE TYPES
// Basic fixture data from mock/API
export interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  homeLogo?: string; // External URL from backend
  awayLogo?: string; // External URL from backend
  date: string; // ISO 8601 format (YYYY-MM-DD)
  time: string; // 24-hour format (HH:MM)
  competition: string;
  matchday: number;
  venue?: string;
  isFeatured?: boolean;
}

// FIXTURES PAGE SETTINGS
export interface FixturesPageSettings {
  fixturesPageTitle: string;
  fixturesPageBannerImage: SanityImage;
  upcomingFixturesTitle: string;
  upcomingFixturesSubtext: string;
  resultsTitle: string;
  resultsSubtext: string;
  fixturesViewMoreText: string;
  watchLiveCardText: string;
  watchLiveCtaText: string;
  highlightsCtaText: string;
}

// PLAYERS PAGE SETTINGS
export interface PlayersPageSettings {
  pageTitle: string;
  pageBanner: SanityImage;
  inputPlaceholderText: string;
}

// SHOP PAGE SETTINGS
export interface ShopPageSettings {
  pageTitle: string;
  pageBanner?: SanityImage;
  sectionTitle: string;
  sectionSubtext: string;
}

// HOME PAGE SETTINGS INTERFACE
export interface HomePageSettings {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: SanityImage;
  heroCtaText: string;
  heroCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroNewsBtnText: string;
  newsSectionTitle: string;
  newsSectionSubtext: string;
  newsContentTitle: string;
  newsContentSubtext: string;
  newsContentBtnText: string;
  fixtureSectionTitle: string;
  fixtureSectionSubtext: string;
  moreFixturesTitle: string;
  moreFixturesSubtext: string;
  fixtureSectionBtnText: string;
  shopSectionTitle: string;
  shopSectionSubtext: string;
  shopSectionBtnText: string;
  photoHighlightsTitle: string;
  photoHighlightsSubtext: string;
  photoHighlightsBtnText: string;
}

export interface ContactUsSettings {
  pageTitle: string;
  pageBannerImage: SanityImage;
  contactFormTitle: string;
  contactFormSubtext: string;
  phoneNumber: number;
  emailAddress: string;
  locationAddress: string;
  mapSectionTitle: string;
  mapSectionSubtext: string;
}

// MATCH INTERFACE
// export interface Match {
//   _id: string;
//   _type: "match";
//   homeTeam: string;
//   awayTeam: string;
//   homeScore?: number;
//   awayScore?: number;
//   matchDate: string;
//   competition: "gpl" | "fa-cup" | "friendly";
//   venue: string;
//   status: "upcoming" | "live" | "completed";
//   matchday?: number;
//   season?: string;
//   videoHighlights?: string;
// }

// PRODUCT INTERFACE
export interface Product {
  _id: string;
  _type: "product";
  name: string;
  slug: Slug;
  image: SanityImage;
  otherImages?: SanityImage[];
  price: number;
  category: "jerseys" | "lifestyle" | "accessories";
  productType?: "home-jersey" | "away-jersey" | "training-kit" | "other";
  displayTitle?: string;
  description?: string;
  sizes?: string[];
  inStock: boolean;
}

// STAFF/COACH INTERFACE
// export interface Staff {
//   _id: string;
//   _type: "staff";
//   fullName: string;
//   role: "head-coach" | "assistant-coach" | "goalkeeper-coach" | "fitness-coach";
//   photo: SanityImage;
//   biography?: string;
//   achievements?: Array<{
//     title: string;
//     year: string;
//   }>;
//   joinedDate?: string;
// }

// FOOTER SETTINGS INTERFACE
export interface FooterSettings {
  description: string;
  location?: {
    location?: string;
    locationUrlOnMap?: string;
  };
  phone?: string;
  email?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
    pinterest?: string;
  };
}

// SPONSOR SETTINGS INTERFACE
export interface Sponsor {
  _key: string;
  name: string;
  logo: SanityImage;
  website?: string;
  order?: number;
}

export interface SponsorSettings {
  sponsorSectionTitle: string;
  sponsors: Sponsor[];
}

// LIVE MATCHES SETTINGS INTERFACE
export interface LiveMatchesSettings {
  liveSectionTitle: string;
  liveSectionSubtext: string;
  videoThumbnail?: SanityImage;
  videoUrl?: string;
  isLive: boolean;
  liveSectionBtnText: string;
}

// NEWSLETTER SETTINGS INTERFACE
export interface NewsletterSettings {
  sectionTitle: string;
  sectionSubtext: string;
  inputPlaceholder: string;
  buttonText: string;
}

// PAST HIGHLIGHTS SETTINGS INTERFACE
export interface PastHighlightsSettings {
  pageTitle: string;
  pageBanner?: SanityImage;
  sectionTitle: string;
  sectionSubtitle: string;
  viewMoreText: string;
  watchLiveCard: {
    title: string;
    description: string;
    buttonText: string;
    backgroundImage?: SanityImage;
  };
}

// COMPETITION INTERFACE
export interface Competition {
  _id: string;
  _type: "competition";
  name: string;
  shortName: string;
  icon: SanityImage;
  competitionType: "league" | "cup" | "friendly" | "tournament";
  season?: string;
  isActive: boolean;
}

// MATCH HIGHLIGHT INTERFACE
export interface MatchHighlight {
  _id: string;
  _type: "matchHighlight";
  videoUrl: string;
  title: string;
  description?: string;
  competition?: {
    _type: "reference";
    _ref: string;
    // Populated fields (from query with ->)
    _id?: string;
    name?: string;
    shortName?: string;
    icon?: SanityImage;
    competitionType?: string;
  };
  matchday?: string;
  videoType?: "matchHighlight" | "playerHighlight";
  thumbnail?: SanityImage;
  thumbnailUrl?: string;
  publishedAt?: string;
  channel?: string;
  relatedPlayer?: {
    _type: "reference";
    _ref: string;
    // Populated fields (from query with ->)
    _id?: string;
    fullName?: string;
    jerseyNumber?: number;
    photo?: SanityImage;
  };
}

// HOMEPAGE INTERFACE
// export interface Homepage {
//   _id: string;
//   _type: "homepage";
//   heroSection: {
//     mainHeading: string;
//     subHeading: string;
//     heroImage: SanityImage;
//     ctaButton: {
//       text: string;
//       link: string;
//     };
//   };
//   featuredNewsSection: {
//     sectionTitle: string;
//     sectionDescription: string;
//     featuredArticles: NewsArticle[];
//   };
//   upcomingFixturesSection: {
//     sectionTitle: string;
//     description: string;
//     showNextMatch: boolean;
//   };
//   storeSection: {
//     sectionTitle: string;
//     description: string;
//     featuredProducts: Product[];
//   };
//   newsletterSection: {
//     heading: string;
//     description: string;
//     buttonText: string;
//   };
// }

// Fixture enriched with club data from Sanity
export interface FixtureWithClubData extends Fixture {
  homeClubData?: GPLClub | null;
  awayClubData?: GPLClub | null;
}

// GALLERY IMAGE INTERFACE
export interface GalleryImage {
  _id: string;
  _type: "galleryImage";
  title: string;
  image: SanityImage;
  altText: string;
  uploadDate: string;
  category:
  | "match-day"
  | "team-photos"
  | "trophy-moments"
  | "our-fans"
  | "training-session"
  | "behind-the-scenes";
  isFeatured?: boolean;
  featuredPriority?: number;
  caption?: string;
}

// GALLERY PAGE SETTINGS
export interface GalleryPageSettings {
  pageTitle: string;
  pageBannerImage?: SanityImage;
  featuredSectionTitle: string;
  featuredSectionSubtext: string;
  loadMoreButtonText: string;
}
// CLUB PAGE SETTINGS
export interface ClubPageSettings {
  clubNameOnBanner: string;
  clubSloganOnBanner: string;
  clubPageBannerImage: SanityImage;
  sections: {
    clubIdentityTitle: string;
    clubIdentitySubtitle: string;
    pillarsTitle: string;
    pillarsSubtitle: string;
    managementTitle: string;
    managementSubtitle: string;
    historyTitle: string;
    historySubtitle: string;
    facilitiesTitle: string;
    facilitiesSubtitle: string;
    trophiesTitle: string;
    trophiesSubtitle: string;
    wallOfFameTitle: string;
    wallOfFameSubtitle: string;
  };
  joinHuntersPack: {
    title: string;
    description: string;
    buttonText: string;
    images: Array<{
      image: SanityImage;
      order: number;
    }>;
  };
}

// CLUB IDENTITY SETTINGS
export interface ClubHistoryEra {
  title: string;
  period: string;
  description: string;
  icon?: string;
  keyAchievements: string[];
}

export interface ClubIdentitySettings {
  clubName: string;
  nickname: string;
  slogan: string;
  tagline: string;
  founded: number;
  location: string;
  colors: {
    primary: string;
    secondary: string;
    description: string;
  };
  whoWeAre: string;
  huntersMentality: string;
  vision: string;
  mission: string;
  commitment: string;
  historyEras: ClubHistoryEra[];
}

// CLUB PILLAR
export interface ClubPillar {
  _id: string;
  title: string;
  subtext: string;
  icon: string;
  order: number;
}

// FACILITY
export interface Facility {
  _id: string;
  name: string;
  tag: string;
  description: string;
  image: SanityImage;
  features?: {
    since?: number;
    location?: string;
    capacity?: number;
  };
  additionalSpecifications?: Array<{
    title: string;
    value: string;
  }>;
}

// STAFF MEMBER
export interface StaffMember {
  _id: string;
  name: string;
  role: string;
  customRole?: string;
  image: SanityImage;
  bio: PortableTextBlock[];
  socialMediaLinks?: {
    linkedIn?: string;
    email?: string;
    phone?: string;
  };
  order: number;
}

// TROPHY
export interface Trophy {
  _id: string;
  name: string;
  tag?: string;
  year: string;
  image: SanityImage;
  description?: string;
}

// RECORD BREAKER
export interface RecordBreaker {
  _id: string;
  title: string;
  recordType: "individual" | "team" | "season";
  player?: string;
  customSubtext?: string;
  year: number;
}

// WALL OF FAME
export interface WallOfFameMember {
  _id: string;
  name: string;
  period: string;
  image: SanityImage;
  description: string;
}

export interface WallOfFameCategory {
  _id: string;
  title: string;
  subtext: string;
  slug: Slug;
  members: WallOfFameMember[];
}

// COMMUNITY PROJECT INTERFACE
export interface CommunityProject {
  _id: string;
  _type: "communityProject";
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: Slug;
  status: "Ongoing" | "Completed" | "Upcoming";
  category: "Education" | "Health" | "Youth Development" | "Infrastructure" | "Environment" | "Other";
  featuredImage: SanityImage;
  description?: PortableTextBlock[];
  gallery?: SanityImage[];
  startDate?: string;
  endDate?: string;
  location?: string;
  partners?: string[];
  impactMetrics?: {
    peopleBenefited?: string;
    fundsRaised?: string;
    volunteerHours?: string;
    customMetric?: string;
    customValue?: string;
  };
  isFeatured?: boolean;
}

// COMMUNITY PAGE SETTINGS INTERFACE
export interface CommunityPageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: SanityImage;
  heroVideoUrl?: string;
  joinButtonText: string;
  signInButtonText: string;
  statsTitle: string;
  statsSubtext: string;
  featuredProjectsTitle: string;
  featuredProjectsSubtext: string;
  activityTeaserTitle: string;
  activityTeaserSubtext: string;
  benefitsTitle: string;
  benefitsSubtext: string;
  ctaTitle: string;
  ctaSubtext: string;
  ctaButtonText: string;
  projectsPageTitle?: string;
  projectsPageSubtitle?: string;
  projectsPageImage?: SanityImage;
  statistics?: Array<{
    label: string;
    value: string;
  }>;
  huntersHub?: {
    title: string;
    description: string;
    buttonText: string;
    image?: SanityImage;
  };
}
