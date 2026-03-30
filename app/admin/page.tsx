"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminNavigation />
    </ProtectedRoute>
  );
}

function AdminNavigation() {
  const navigationCards = [
    {
      title: "Players",
      description: "View all Bechem United players organized by position",
      href: "/players",
      icon: "⚽",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "News",
      description: "Latest club news, match reports, and updates",
      href: "/news",
      icon: "📰",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Sanity Studio",
      description: "Manage content: Add players, news, and more",
      href: "/studio",
      icon: "✏️",
      gradient: "from-red-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in">
            Bechem United FC
          </h1>
          <p className="text-xl text-green-200 max-w-2xl mx-auto">
            Official website management dashboard. Navigate to different
            sections of the application.
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {navigationCards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              />

              <div className="relative p-8">
                {/* Icon */}
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors">
                  {card.title}
                </h2>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed">
                  {card.description}
                </p>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 text-white/50 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-8 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">GPL</div>
              <div className="text-xs text-gray-400">Ghana Premier League</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">2024</div>
              <div className="text-xs text-gray-400">Season</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">⚡</div>
              <div className="text-xs text-gray-400">The Hunters</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </div>
  );
}
