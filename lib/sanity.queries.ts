import { groq } from "next-sanity";

// GPL CLUBS
export const gplClubsQuery = groq`
  *[_type == "gplClub" && isActive == true] | order(clubName asc) {
    _id,
    clubName,
    clubLogo,
    founded,
    stadium,
    isActive
  }
`;

// Query to fetch clubs by their names (for fixtures)
export const gplClubsByNamesQuery = groq`
  *[_type == "gplClub" && clubName in $clubNames] {
    _id,
    clubName,
    clubLogo,
    founded,
    stadium,
    isActive
  }
`;

export const singleClubQuery = groq`
  *[_type == "gplClub" && _id == $clubId][0] {
    _id,
    clubName,
    clubLogo,
    founded,
    stadium,
    isActive
  }
`;

// PLAYERS
export const playersQuery = groq`
  *[_type == "player"] | order(jerseyNumber asc) {
    _id,
    fullName,
    jerseyNumber,
    position,
    positionDetail,
    photo,
    nationality
  }
`;

export const playersByPositionQuery = groq`
  *[_type == "player" && position == $position] | order(jerseyNumber asc) {
    _id,
    fullName,
    jerseyNumber,
    position,
    positionDetail,
    photo,
    nationality
  }
`;

export const singlePlayerQuery = groq`
  *[_type == "player" && jerseyNumber == $number][0] {
    _id,
    fullName,
    jerseyNumber,
    position,
    positionDetail,
    photo,
    photoBanner,
    biography,
    socialMedia,
    dateOfBirth,
    nationality,
    height,
    strongFoot,
    commonStatistics,
    goalkeeperStats,
    defenderStats,
    midfielderStats,
    forwardStats,
    careerExperience[] {
      _key,
      isGPLClub,
      gplClubReference-> {
        _id,
        clubName,
        clubLogo,
        founded,
        stadium
      },
      customClubName,
      customClubLogo,
      role,
      startYear,
      endYear,
      isCurrent,
      achievements
    }
  }
`;

export const playerRelatedNewsQuery = groq`
  *[_type == "news" && (title match $playerName || excerpt match $playerName || content[].children[].text match $playerName)] | order(publishedAt desc) [0...4] {
    _id,
    title,
    slug,
    featuredImage,
    publishedAt,
    category
  }
`;

export const playerRelatedHighlightsQuery = groq`
  *[_type == "matchHighlight" && relatedPlayer._ref == $playerId] | order(publishedAt desc) [0...4] {
    _id,
    title,
    videoUrl,
    thumbnail,
    competition-> {
      name,
      icon
    },
    publishedAt
  }
`;

// NEWS
export const newsQuery = groq`
  *[_type == "news"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    author,
    authorImage,
    readTime,
    publishedAt,
    category
  }
`;

export const singleNewsQuery = groq`
  *[_type == "news" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    content,
    featuredImage,
    author,
    authorImage,
    readTime,
    publishedAt,
    category
  }
`;

// HOME PAGE
export const homePageNewsQuery = groq`
  *[_type == "news"] | order(publishedAt desc) [0...5] {
    _id,
    title,
    slug,
    excerpt,
    author,
    authorImage,
    featuredImage,
    publishedAt
  }
`;

export const featuredNewsQuery = groq`
  *[_type == "news" && isFeatured == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    author,
    authorImage,
    featuredImage,
    publishedAt,
    category,
    readTime
  }
`;

export const latestNonFeaturedNewsQuery = groq`
  *[_type == "news" && isFeatured != true] | order(publishedAt desc) [0...5] {
    _id,
    title,
    slug,
    excerpt,
    author,
    authorImage,
    featuredImage,
    publishedAt,
    category,
    readTime
  }
`;

export const mostRecentNewsQuery = groq`
  *[_type == "news"] | order(isFeatured desc, publishedAt desc) [0] {
    _id,
    title,
    slug,
    excerpt,
    author,
    authorImage,
    featuredImage,
    publishedAt,
    category,
    readTime
  }
`;
export const nextFourRecentNewsQuery = groq`
  *[_type == "news"] | order(publishedAt desc) [1...5] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    category,
    readTime
  }
`;

export const homePageSettingsQuery = groq`
  *[_id == "homePageSettings"][0] {
    heroHeading,
    heroSubheading,
    heroImage,
    heroCtaText,
    heroCtaLink,
    heroSecondaryCtaText,
    heroSecondaryCtaLink,
    heroNewsBtnText,
    newsSectionTitle,
    newsSectionSubtext,
    newsContentTitle,
    newsContentSubtext,
    newsContentBtnText,
    fixtureSectionTitle,
    fixtureSectionSubtext,
    moreFixturesTitle,
    moreFixturesSubtext,
    fixtureSectionBtnText,
    shopSectionTitle,
    shopSectionSubtext,
    shopSectionBtnText,
    photoHighlightsTitle,
    photoHighlightsSubtext,
    photoHighlightsBtnText
  }
`;

export const contactUsSettingsQuery = groq`
  *[_id == "contactUsSettings"][0] {
  pageTitle,
  pageBannerImage,
  contactInfoSectionTitle,
    contactInfoSectionSubtitle,
    phoneNumber,
    emailAddress,
    locationAddress,
    mapSectionTitle,
    mapSectionSubtext,
  }
`;

// FOOTER SETTINGS
export const footerSettingsQuery = groq`
  *[_id == "footerSettings"][0] {
    description,
    location,
    phone,
    email,
    socialMedia
  }
`;

// SPONSOR SETTINGS
export const sponsorSettingsQuery = groq`
  *[_id == "sponsorSettings"][0] {
    sponsorSectionTitle,
    sponsors[] {
      _key,
      name,
      logo,
      website,
      order
    } | order(order asc)
  }
`;

// LIVE MATCHES SETTINGS
export const liveMatchesSettingsQuery = groq`
  *[_id == "liveMatchesSettings"][0] {
    liveSectionTitle,
    liveSectionSubtext,
    videoThumbnail,
    videoUrl,
    isLive,
    liveSectionBtnText
  }
`;

// NEWSLETTER SETTINGS
export const newsletterSettingsQuery = groq`
  *[_id == "newsletterSettings"][0] {
    sectionTitle,
    sectionSubtext,
    inputPlaceholder,
    buttonText
  }
`;

// PRODUCTS
export const productsQuery = groq`
  *[_type == "product" && inStock == true] | order(_createdAt desc) {
    _id,
    name,
    slug,
    image,
    price,
    category
  }
`;

export const productsByCategoryQuery = groq`
  *[_type == "product" && category == $category && inStock == true] | order(_createdAt desc) {
    _id,
    name,
    slug,
    image,
    price,
    category,
    description,
    sizes
  }
`;

export const featuredProductsQuery = groq`
  *[_type == "product" && inStock == true] | order(_createdAt desc) {
    _id,
    name,
    slug,
    image,
    price,
    category
  }
`;

export const oneProductPerCategoryQuery = groq`
{
  "jerseys": *[_type == "product" && category == "jerseys" && inStock == true] | order(_createdAt desc) [0],
  "lifestyle": *[_type == "product" && category == "lifestyle" && inStock == true] | order(_createdAt desc) [0],
  "accessories": *[_type == "product" && category == "accessories" && inStock == true] | order(_createdAt desc) [0]
}
`;

export const singleProductQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    otherImages,
    price,
    category,
    productType,
    displayTitle,
    description,
    sizes,
    inStock
  }
`;

export const relatedProductsQuery = groq`
  *[_type == "product" && category == $category && _id != $productId && inStock == true] | order(_createdAt desc) [0...4] {
    _id,
    name,
    slug,
    image,
    price,
    category,
    displayTitle
  }
`;

export const threeJerseysQuery = groq`
  *[_type == "product" && category == "jerseys" && inStock == true] | order(_createdAt desc) [0...3] {
    _id,
    name,
    slug,
    image,
    price,
    category,
    productType,
    displayTitle
  }
`;

export const featuredJerseysQuery = groq`
{
  "homeJersey": *[_type == "product" && category == "jerseys" && productType == "home-jersey" && inStock == true] | order(_createdAt desc) [0] {
    _id,
    name,
    slug,
    image,
    price,
    category,
    productType,
    displayTitle
  },
  "awayJersey": *[_type == "product" && category == "jerseys" && productType == "away-jersey" && inStock == true] | order(_createdAt desc) [0] {
    _id,
    name,
    slug,
    image,
    price,
    category,
    productType,
    displayTitle
  },
  "trainingKit": *[_type == "product" && category == "jerseys" && productType == "training-kit" && inStock == true] | order(_createdAt desc) [0] {
    _id,
    name,
    slug,
    image,
    price,
    category,
    productType,
    displayTitle
  }
}
`;

// PAST HIGHLIGHTS
export const pastHighlightsSettingsQuery = groq`
  *[_type == "pastHighlightsSettings"][0] {
    pageTitle,
    pageBanner,
    sectionTitle,
    sectionSubtitle,
    viewMoreText,
    watchLiveCard {
      title,
      description,
      buttonText,
      backgroundImage
    }
  }
`;

export const allMatchHighlightsQuery = groq`
  *[_type == "matchHighlight"] | order(publishedAt desc) {
    _id,
    videoUrl,
    title,
    description,
    competition-> {
      _id,
      name,
      shortName,
      icon,
      competitionType
    },
    matchday,
    videoType,
    thumbnail,
    publishedAt,
    channel,
    relatedPlayer-> {
      _id,
      fullName,
      jerseyNumber,
      photo
    }
  }
`;

export const featuredMatchHighlightsQuery = groq`
  *[_type == "matchHighlight"] | order(publishedAt desc) [0...6] {
    _id,
    videoUrl,
    title,
    description,
    competition-> {
      _id,
      name,
      shortName,
      icon,
      competitionType
    },
    matchday,
    videoType,
    thumbnail,
    thumbnailUrl,
    publishedAt,
    channel,
    relatedPlayer-> {
      _id,
      fullName,
      jerseyNumber,
      photo
    }
  }
`;

// NEWS PAGE SETTINGS
export const newsPageSettingsQuery = groq`
  *[_id == "newsPageSettings"][0] {
  pageTitle,
    pageBannerImage,
    featuredNewsSectionTitle,
    featuredNewsSectionSubtext,
    latestUpdatesSectionTitle,
    latestUpdatesSectionSubtext
  }
`;

// NEWS BY CATEGORY
export const newsByCategoryQuery = groq`
  *[_type == "news" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    author,
    readTime,
    publishedAt,
    category,
    isFeatured
  }
`;

// FIXTURES PAGE SETTINGS
export const fixturesPageSettingsQuery = groq`
  *[_id == "fixturesPageSettings"][0] {
    fixturesPageTitle,
    fixturesPageBannerImage,
    upcomingFixturesTitle,
    upcomingFixturesSubtext,
    resultsTitle,
    resultsSubtext,
    fixturesViewMoreText,
    watchLiveCardText,
    watchLiveCtaText,
    highlightsCtaText
  }
`;

// MATCH FIXTURES
export const upcomingFixturesQuery = groq`
  *[_type == "matchFixture" && status == "upcoming"] | order(matchDate asc) {
    _id,
    competition,
    matchday,
    homeTeam,
    awayTeam,
    matchDate,
    venue,
    status
  }
`;

export const finishedFixturesQuery = groq`
  *[_type == "matchFixture" && status == "finished"] | order(matchDate desc) {
    _id,
    competition,
    matchday,
    homeTeam,
    awayTeam,
    matchDate,
    venue,
    status,
    homeScore,
    awayScore
  }
`;

export const allFixturesQuery = groq`
  *[_type == "matchFixture"] | order(matchDate desc) {
    _id,
    competition,
    matchday,
    homeTeam,
    awayTeam,
    matchDate,
    venue,
    status,
    homeScore,
    awayScore
  }
`;

// PLAYERS PAGE SETTINGS
export const playersPageSettingsQuery = groq`
  *[_id == "playersPageSettings"][0] {
    pageTitle,
    pageBanner,
    inputPlaceholderText
  }
`;

// SHOP PAGE SETTINGS
export const shopPageSettingsQuery = groq`
  *[_id == "shopPageSettings"][0] {
    pageTitle,
    pageBanner,
    sectionTitle,
    sectionSubtext
  }
`;

// LEAGUE TABLE
export const leagueTableQuery = groq`
  *[_type == "leagueStandings"] | order(rank asc) {
    rank,
    teamName,
    teamLogo,
    played,
    won,
    drawn,
    lost,
    gf,
    ga,
    gd,
    points,
    lastFive,
    isHighlight
  }
`;

// GALLERY PAGE SETTINGS
export const galleryPageSettingsQuery = groq`
  *[_id == "galleryPageSettings"][0] {
    pageTitle,
    pageBannerImage,
    featuredSectionTitle,
    featuredSectionSubtext,
    loadMoreButtonText
  }
`;

// GALLERY IMAGES
export const galleryImagesQuery = groq`
  *[_type == "galleryImage"] | order(uploadDate desc) {
    _id,
    title,
    image,
    altText,
    uploadDate,
    category,
    isFeatured,
    featuredPriority
  }
`;

export const featuredGalleryImagesQuery = groq`
  *[_type == "galleryImage" && isFeatured == true] | order(featuredPriority asc) {
    _id,
    title,
    image,
    altText,
    uploadDate,
    category,
    isFeatured,
    featuredPriority
  }
`;

// CLUB PROFILE PAGE QUERIES
export const clubPageSettingsQuery = groq`
  *[_type == "clubPageSettings"][0] {
    clubNameOnBanner,
    clubSloganOnBanner,
    clubPageBannerImage,
    sections,
    joinHuntersPack {
      title,
      description,
      buttonText,
      images[] {
        image,
        order
      } | order(order asc)
    }
  }
`;

export const clubIdentitySettingsQuery = groq`
  *[_type == "clubIdentitySettings"][0] {
    clubName,
    nickname,
    slogan,
    tagline,
    founded,
    location,
    colors,
    whoWeAre,
    huntersMentality,
    vision,
    mission,
    commitment,
    historyEras
  }
`;

export const clubPillarsQuery = groq`
  *[_type == "clubPillar"] | order(order asc) {
    _id,
    title,
    subtext,
    icon,
    order
  }
`;

export const facilitiesQuery = groq`
  *[_type == "facility"] | order(name asc) {
    _id,
    name,
    tag,
    description,
    image,
    features,
    additionalSpecifications
  }
`;

export const staffMembersQuery = groq`
  *[_type == "staffMember"] | order(order asc) {
    _id,
    name,
    role,
    customRole,
    image,
    bio,
    socialMediaLinks,
    order
  }
`;

export const trophiesQuery = groq`
  *[_type == "trophy"] | order(year desc) {
    _id,
    name,
    tag,
    year,
    image,
    description
  }
`;

export const wallOfFameQuery = groq`
  *[_type == "wallOfFameCategory"] | order(order asc) {
    _id,
    title,
    subtext,
    slug,
    "members": *[_type == "wallOfFame" && references(^._id)] | order(order asc) {
      _id,
      name,
      period,
      image,
      description
    }
  }
`;

export const recordBreakersQuery = groq`
  *[_type == "recordBreaker"] | order(year asc) {
    _id,
    title,
    recordType,
    player,
    customSubtext,
    year
  }
`;
// GLOBAL SEARCH
export const globalSearchQuery = groq`
{
  "news": *[_type == "news" && (title match $searchTerm || excerpt match $searchTerm || content[].children[].text match $searchTerm)] {
    _id,
    _type,
    title,
    slug,
    featuredImage,
    publishedAt,
    category
  },
  "players": *[_type == "player" && (fullName match $searchTerm || jerseyNumber == $queryInt)] {
    _id,
    _type,
    fullName,
    jerseyNumber,
    position,
    photo
  },
  "products": *[_type == "product" && (name match $searchTerm || description match $searchTerm || displayTitle match $searchTerm)] {
    _id,
    _type,
    name,
    slug,
    image,
    price,
    category
  }
}
`;

// COMMUNITY PAGE
export const communityPageSettingsQuery = groq`
  *[_id == "communityPageSettings"][0] {
    heroTitle,
    heroSubtitle,
    heroImage,
    heroVideoUrl,
    joinButtonText,
    signinButtonText,
    statsTitle,
    statsSubtext,
    featuredProjectsTitle,
    featuredProjectsSubtext,
    activityTeaserTitle,
    activityTeaserSubtext,
    benefitsTitle,
    benefitsSubtext,
    ctaTitle,
    ctaSubtext,
    ctaButtonText,
    projectsPageTitle,
    projectsPageSubtitle,
    projectsPageImage,
    statistics,
    huntersHub
  }
`;

export const communityProjectsQuery = groq`
  *[_type == "communityProject"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    status,
    category,
    featuredImage,
    description,
    startDate,
    location,
    impactMetrics,
    isFeatured
  }
`;

export const featuredCommunityProjectsQuery = groq`
  *[_type == "communityProject" && isFeatured == true] | order(_createdAt desc) [0...4] {
    _id,
    title,
    slug,
    status,
    category,
    featuredImage,
    description,
    startDate,
    location,
    impactMetrics,
    isFeatured
  }
`;

export const singleCommunityProjectQuery = groq`
  *[_type == "communityProject" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    status,
    category,
    featuredImage,
    gallery,
    description,
    startDate,
    endDate,
    location,
    partners,
    impactMetrics,
    isFeatured
  }
`;

export const relatedCommunityProjectsQuery = groq`
  *[_type == "communityProject" && category == $category && _id != $projectId] | order(_createdAt desc) [0...3] {
    _id,
    title,
    slug,
    status,
    category,
    featuredImage
  }
`;
