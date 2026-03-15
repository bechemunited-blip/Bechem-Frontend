import { client, urlFor } from "@/lib/sanity.client";
import { singleNewsQuery, newsQuery } from "@/lib/sanity.queries";
import { NewsArticle } from "@/lib/types";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/layout/SectionHeader";
import { Icon } from "@iconify/react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

// Revalidate every 60 seconds
export const revalidate = 60;

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsArticlePage({
  params,
}: NewsArticlePageProps) {
  const resolvedParams = await params;

  const [article, allNews] = await Promise.all([
    client.fetch<NewsArticle>(singleNewsQuery, {
      slug: resolvedParams.slug,
    }),
    client.fetch<NewsArticle[]>(newsQuery),
  ]);

  // Filter out current article and take latest 3 for "Other News"
  const otherNews = allNews
    .filter((n) => n.slug.current !== resolvedParams.slug)
    .slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-screen bg-prim-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-neutral-text mb-2">
            Article not found
          </h1>
          <p className="text-neutral-7 mb-6">
            The article you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/news"
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Back to News
          </Link>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-[#F1EFF6]">
      {/* Back Button & Breadcrumbs */}
      <div className="container-wide pt-24 md:pt-32 pb-4 relative z-10 flex flex-col gap-4">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-neutral-text font-bold transition-all hover:translate-x-[-4px]"
        >
          <Icon icon="lucide:circle-arrow-left" className="w-6 h-6" />
          <span className="text-sm uppercase tracking-widest">Go Back</span>
        </Link>
        <div className="pt-4 border-t border-neutral-3">
          <Breadcrumbs onColor={false} />
        </div>
      </div>

      <article className="container-wide pb-20">
        {/* Main Content Card */}
        <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-sm p-6 md:p-12 lg:p-16 relative mb-20 lg:mb-28">
          {/* Header Section */}
          <header className="flex flex-col items-center text-center mb-10 md:mb-14">
            {/* Author */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-full bg-neutral-2 flex items-center justify-center">
                <Icon icon="ph:user-circle-fill" className="w-8 h-8 text-neutral-4" />
              </div>
              <div className="text-center">
                <p className="text-neutral-text font-black text-sm uppercase tracking-tight">
                  {article.author}
                </p>
                <p className="text-neutral-5 text-[10px] uppercase font-bold tracking-widest">
                  Author
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-neutral-text mb-6 max-w-4xl leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center justify-center gap-3 text-neutral-5 text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Icon icon="lucide:clock" className="w-3.5 h-3.5" />
                {article.readTime} Mins Read
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-3" />
              <span className="flex items-center gap-1.5">
                <Icon icon="lucide:calendar" className="w-3.5 h-3.5" />
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>

          <div className="relative flex flex-col md:flex-row gap-10 lg:gap-16">
            {/* Social Sharing - Desktop Vertical */}
            <div className="hidden lg:flex flex-col gap-4 absolute right-6 top-0">
              {[
                { icon: "fa6-brands:instagram", color: "text-[#E1306C]" },
                { icon: "fa6-brands:facebook-f", color: "text-[#1877F2]" },
                { icon: "fa6-brands:x-twitter", color: "text-neutral-10" },
                { icon: "fa6-solid:link", color: "text-neutral-6" },
              ].map((social, idx) => (
                <button
                  key={idx}
                  className="w-10 h-10 rounded-full bg-neutral-1 flex items-center justify-center shadow-sm border border-neutral-2 hover:bg-neutral-2 transition-colors"
                >
                  <Icon icon={social.icon} className={`w-5 h-5 ${social.color}`} />
                </button>
              ))}
            </div>

            <div className="flex-1 max-w-3xl mx-auto">
              {/* Content Intro Text */}
              {article.excerpt && (
                <div className="mb-8">
                  <p className="text-neutral-7 text-sm md:text-[15px] leading-relaxed italic">
                    {article.excerpt}
                  </p>
                </div>
              )}

              {/* Featured Image */}
              {article.featuredImage && (
                <div className="relative w-full aspect-video rounded-[24px] overflow-hidden mb-12 shadow-md">
                  <Image
                    src={urlFor(article.featuredImage).width(1200).height(675).url()}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Article Content Body */}
              <div className="prose prose-neutral max-w-none">
                <div className="text-neutral-8 leading-relaxed">
                  <PortableText
                    value={article.content || []}
                    components={{
                      block: {
                        h2: ({ children }) => (
                          <h2 className="text-xl md:text-2xl font-black text-neutral-text mt-10 mb-4">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg md:text-xl font-black text-neutral-text mt-8 mb-3">
                            {children}
                          </h3>
                        ),
                        normal: ({ children }) => (
                          <p className="text-sm md:text-base text-neutral-7 mb-6 leading-relaxed">
                            {children}
                          </p>
                        ),
                        blockquote: ({ children }) => (
                          <div className="pl-6 border-l-2 border-neutral-3 italic text-neutral-7 my-10 text-sm md:text-base">
                            {children}
                          </div>
                        ),
                      },
                      marks: {
                        strong: ({ children }) => (
                          <strong className="font-bold text-neutral-text">
                            {children}
                          </strong>
                        ),
                        link: ({ children, value }) => (
                          <a
                            href={value?.href}
                            className="text-primary hover:underline font-bold transition-all"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other News Section */}
        {otherNews.length > 0 && (
          <div className="mt-10">
            <div className="mb-10">
              <SectionHeader
                title="Other News Articles"
                subtext="Browse additional articles, announcements, and club updates."
                showLine
                uppercase
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherNews.map((news) => (
                <Link
                  key={news._id}
                  href={`/news/${news.slug.current}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-[20px] mb-5">
                    {news.featuredImage ? (
                      <Image
                        src={urlFor(news.featuredImage).width(600).height(450).url()}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-2 flex items-center justify-center">
                        <Icon icon="ph:image-fill" className="w-12 h-12 text-neutral-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-neutral-text text-[15px] font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug uppercase tracking-tight">
                      {news.title}
                    </h4>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-neutral-2 flex items-center justify-center">
                          <Icon icon="ph:user-fill" className="w-3 h-3 text-neutral-5" />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-5 uppercase tracking-wider">
                          {news.author}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-5 uppercase tracking-wider">
                        {new Date(news.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
