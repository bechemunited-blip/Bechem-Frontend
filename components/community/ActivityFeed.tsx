"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/store/hooks/useAuth";
import {
    SEED_POSTS,
    REACTION_META,
    formatRelativeTime,
    getInitials,
    makeGuestAuthor,
} from "@/lib/community/data";
import { Post, Comment, ReactionType, PostAuthor } from "@/lib/community/types";
import SectionHeader from "@/components/layout/SectionHeader";

// ─── Avatar Helper ────────────────────────────────────────────────────────────
function Avatar({
    author,
    size = "md",
}: {
    author: PostAuthor;
    size?: "sm" | "md" | "lg";
}) {
    const dims = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
    const ringColor = author.role === "admin" ? "ring-primary" : "ring-neutral-200";
    return (
        <div
            className={`${dims[size]} rounded-full ring-2 ${ringColor} overflow-hidden shrink-0 flex items-center justify-center font-black bg-primary/10 text-primary`}
        >
            {author.avatar ? (
                // Avatar URLs come from the auth profile and are external — next/image fill works here
                // eslint-disable-next-line @next/next/no-img-element
                <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
            ) : (
                <span>{getInitials(author.name)}</span>
            )}
        </div>
    );
}

// ─── Badge Helper ─────────────────────────────────────────────────────────────
const BADGE_STYLES: Record<string, string> = {
    "Gold Member": "bg-amber-50 text-amber-700 border border-amber-200",
    "Silver Member": "bg-neutral-100 text-neutral-600 border border-neutral-200",
    Moderator: "bg-primary/10 text-primary border border-primary/20",
    Fan: "bg-neutral-50 text-neutral-500 border border-neutral-100",
};

function AuthorBadge({ badge }: { badge?: string }) {
    if (!badge) return null;
    return (
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${BADGE_STYLES[badge] || BADGE_STYLES.Fan}`}>
            {badge}
        </span>
    );
}

// ─── Compose Box ──────────────────────────────────────────────────────────────
function ComposeBox({
    onPost,
    author,
}: {
    onPost: (content: string) => void;
    author: PostAuthor;
}) {
    const [content, setContent] = useState("");
    const [focused, setFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handlePost = () => {
        if (!content.trim()) return;
        onPost(content.trim());
        setContent("");
        setFocused(false);
    };

    const autoResize = () => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden transition-all duration-300">
            <div className="flex gap-3 p-4">
                <Avatar author={author} size="md" />
                <div className="flex-1">
                    <textarea
                        ref={textareaRef}
                        rows={focused ? 3 : 1}
                        placeholder={`What's on your mind, ${author.name.split(" ")[0]}?`}
                        value={content}
                        onChange={(e) => { setContent(e.target.value); autoResize(); }}
                        onFocus={() => setFocused(true)}
                        className="w-full resize-none outline-none text-sm text-neutral-800 placeholder:text-neutral-400 font-medium leading-relaxed pt-2 bg-transparent"
                    />
                </div>
            </div>

            <AnimatePresence>
                {(focused || content) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-neutral-100 px-4 py-3 flex items-center justify-between bg-neutral-50/50"
                    >
                        <div className="flex gap-1">
                            {[
                                { icon: "ph:image-duotone", label: "Photo", color: "text-green-600" },
                                { icon: "ph:smiley-duotone", label: "Emoji", color: "text-amber-500" },
                                { icon: "ph:tag-duotone", label: "Tag", color: "text-blue-500" },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    title={item.label}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 hover:bg-neutral-100 transition-all"
                                >
                                    <Icon icon={item.icon} className={`w-4 h-4 ${item.color}`} />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setContent(""); setFocused(false); }}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePost}
                                disabled={!content.trim()}
                                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${content.trim()
                                    ? "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                                    }`}
                            >
                                Post
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Reaction Bar ──────────────────────────────────────────────────────────────
function ReactionBar({
    reactions,
    onReact,
    totalComments,
    onCommentClick,
}: {
    reactions: Post["reactions"];
    onReact: (type: ReactionType) => void;
    totalComments: number;
    onCommentClick: () => void;
}) {
    const [showPicker, setShowPicker] = useState(false);
    const totalReactions = reactions.reduce((s, r) => s + r.count, 0);
    const topReactions = reactions.filter((r) => r.count > 0).slice(0, 3);
    const myReaction = reactions.find((r) => r.reacted);

    return (
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 mt-3">
            {/* Reaction summary */}
            <div className="flex items-center gap-3">
                {topReactions.length > 0 && (
                    <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                            {topReactions.map((r) => (
                                <span key={r.type} className="text-base leading-none">{REACTION_META[r.type].emoji}</span>
                            ))}
                        </div>
                        <span className="text-xs text-neutral-400 font-medium">{totalReactions}</span>
                    </div>
                )}
            </div>
            {totalComments > 0 && (
                <button onClick={onCommentClick} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                    {totalComments} comment{totalComments !== 1 && "s"}
                </button>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-1">
                {/* Like / React */}
                <div className="relative">
                    <button
                        onClick={() => setShowPicker((p) => !p)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:bg-neutral-100 ${myReaction ? "text-primary" : "text-neutral-500"}`}
                    >
                        <span>{myReaction ? REACTION_META[myReaction.type].emoji : "👍"}</span>
                        <span>{myReaction ? REACTION_META[myReaction.type].label : "Like"}</span>
                    </button>

                    <AnimatePresence>
                        {showPicker && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 4 }}
                                className="absolute bottom-full left-0 mb-2 flex gap-1 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-10"
                            >
                                {Object.entries(REACTION_META).map(([type, meta]) => (
                                    <button
                                        key={type}
                                        title={meta.label}
                                        onClick={() => { onReact(type as ReactionType); setShowPicker(false); }}
                                        className="w-10 h-10 flex items-center justify-center text-xl rounded-xl hover:bg-neutral-100 transition-all hover:scale-125"
                                    >
                                        {meta.emoji}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Comment */}
                <button
                    onClick={onCommentClick}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-100 transition-all"
                >
                    <Icon icon="ph:chat-circle-duotone" className="w-4 h-4" />
                    <span>Comment</span>
                </button>

                {/* Share */}
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-100 transition-all">
                    <Icon icon="ph:share-network-duotone" className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                </button>
            </div>
        </div>
    );
}

// ─── Poll Block ───────────────────────────────────────────────────────────────
function PollBlock({
    options,
    onVote,
}: {
    options: NonNullable<Post["pollOptions"]>;
    onVote: (id: string) => void;
}) {
    const totalVotes = options.reduce((s, o) => s + o.votes, 0);
    const hasVoted = options.some((o) => o.votedByMe);

    return (
        <div className="mt-4 space-y-2">
            {options.map((opt) => {
                const pct = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                return (
                    <button
                        key={opt.id}
                        onClick={() => !hasVoted && onVote(opt.id)}
                        disabled={hasVoted}
                        className={`relative w-full text-left rounded-xl overflow-hidden border transition-all ${opt.votedByMe
                            ? "border-primary bg-primary/5"
                            : hasVoted
                                ? "border-neutral-200 bg-neutral-50 cursor-default"
                                : "border-neutral-200 hover:border-primary hover:bg-primary/5 cursor-pointer"
                            }`}
                    >
                        {hasVoted && (
                            <div
                                className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-700"
                                style={{ width: `${pct}%` }}
                            />
                        )}
                        <div className="relative flex items-center justify-between px-4 py-3">
                            <span className={`text-sm font-semibold ${opt.votedByMe ? "text-primary" : "text-neutral-700"}`}>
                                {opt.votedByMe && <Icon icon="ph:check-bold" className="inline w-3 h-3 mr-1.5" />}
                                {opt.text}
                            </span>
                            {hasVoted && (
                                <span className={`text-xs font-black ${opt.votedByMe ? "text-primary" : "text-neutral-400"}`}>
                                    {pct}%
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}
            {hasVoted && (
                <p className="text-xs text-neutral-400 text-center pt-1">{totalVotes} votes total</p>
            )}
        </div>
    );
}

// ─── Comment Item ─────────────────────────────────────────────────────────────
function CommentItem({
    comment,
    onLike,
}: {
    comment: Comment;
    onLike: (id: string) => void;
}) {
    return (
        <div className="flex gap-3 group">
            <Avatar author={comment.author} size="sm" />
            <div className="flex-1">
                <div className="bg-neutral-100/80 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-neutral-900">{comment.author.name}</span>
                        <AuthorBadge badge={comment.author.badge} />
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-1.5 px-2">
                    <span className="text-[10px] text-neutral-400">{formatRelativeTime(comment.createdAt)}</span>
                    <button
                        onClick={() => onLike(comment.id)}
                        className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${comment.likedByMe ? "text-primary" : "text-neutral-400 hover:text-neutral-600"}`}
                    >
                        <Icon icon={comment.likedByMe ? "ph:thumbs-up-fill" : "ph:thumbs-up"} className="w-3 h-3" />
                        {comment.likes > 0 ? comment.likes : "Like"}
                    </button>
                    <button className="text-[10px] font-bold text-neutral-400 hover:text-neutral-600 transition-colors">
                        Reply
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Comments Section ─────────────────────────────────────────────────────────
function CommentsSection({
    post,
    currentAuthor,
    onAddComment,
    onLikeComment,
}: {
    post: Post;
    currentAuthor: PostAuthor;
    onAddComment: (postId: string, content: string) => void;
    onLikeComment: (postId: string, commentId: string) => void;
}) {
    const [newComment, setNewComment] = useState("");

    const submit = () => {
        if (!newComment.trim()) return;
        onAddComment(post.id, newComment.trim());
        setNewComment("");
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-3 overflow-hidden"
        >
            {post.comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onLike={(cId) => onLikeComment(post.id, cId)}
                />
            ))}

            {/* New comment input */}
            <div className="flex gap-3 pt-1">
                <Avatar author={currentAuthor} size="sm" />
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        placeholder="Write a comment…"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submit()}
                        className="flex-1 bg-neutral-100 rounded-full px-4 py-2 text-sm outline-none placeholder:text-neutral-400 font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button
                        onClick={submit}
                        disabled={!newComment.trim()}
                        className={`p-2 rounded-full transition-all ${newComment.trim() ? "bg-primary text-white" : "bg-neutral-200 text-neutral-400"}`}
                    >
                        <Icon icon="ph:paper-plane-right-fill" className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({
    post,
    currentAuthor,
    onReact,
    onToggleComments,
    onAddComment,
    onLikeComment,
    onVote,
}: {
    post: Post;
    currentAuthor: PostAuthor;
    onReact: (postId: string, type: ReactionType) => void;
    onToggleComments: (postId: string) => void;
    onAddComment: (postId: string, content: string) => void;
    onLikeComment: (postId: string, commentId: string) => void;
    onVote: (postId: string, optionId: string) => void;
}) {
    const isAnnouncement = post.type === "announcement";
    const isPoll = post.type === "poll";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${isAnnouncement ? "border-primary/30 ring-1 ring-primary/10" : "border-neutral-200"
                }`}
        >
            {/* Pinned indicator */}
            {post.pinned && (
                <div className="flex items-center gap-2 px-5 py-2 bg-primary/5 border-b border-primary/10">
                    <Icon icon="ph:push-pin-fill" className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pinned post</span>
                </div>
            )}

            <div className="p-5">
                {/* Author row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar author={post.author} size="md" />
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-black text-neutral-900">{post.author.name}</span>
                                <AuthorBadge badge={post.author.badge} />
                            </div>
                            <span className="text-xs text-neutral-400">{formatRelativeTime(post.createdAt)} ago</span>
                        </div>
                    </div>
                    <button className="p-2 rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-all">
                        <Icon icon="ph:dots-three-bold" className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-line mb-3">{post.content}</p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-bold text-primary/70 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Featured Image */}
                {post.image && !isPoll && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3">
                        <Image src={post.image} alt="" fill className="object-cover" />
                    </div>
                )}

                {/* Poll */}
                {isPoll && post.pollOptions && (
                    <PollBlock
                        options={post.pollOptions}
                        onVote={(optId) => onVote(post.id, optId)}
                    />
                )}

                {/* Reaction bar */}
                <ReactionBar
                    reactions={post.reactions}
                    onReact={(type) => onReact(post.id, type)}
                    totalComments={post.comments.length}
                    onCommentClick={() => onToggleComments(post.id)}
                />

                {/* Comments */}
                <AnimatePresence>
                    {post.commentsOpen && (
                        <CommentsSection
                            post={post}
                            currentAuthor={currentAuthor}
                            onAddComment={onAddComment}
                            onLikeComment={onLikeComment}
                        />
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// ─── Sidebar Widgets ──────────────────────────────────────────────────────────
function TopContributors() {
    const contributors = [
        { name: "Kwame Boateng", posts: 47, badge: "Gold Member" },
        { name: "Abena Owusu", posts: 38, badge: "Gold Member" },
        { name: "Ama Sarpong", posts: 29, badge: "Silver Member" },
        { name: "Kofi Mensah", posts: 21, badge: "Fan" },
    ];
    return (
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                <Icon icon="ph:trophy-duotone" className="w-4 h-4 text-amber-500" />
                Top Contributors
            </h4>
            <div className="space-y-3">
                {contributors.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-3">
                        <span className="text-xs font-black text-neutral-300 w-4">{i + 1}</span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary shrink-0">
                            {getInitials(c.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-neutral-800 truncate">{c.name}</p>
                            <p className="text-[10px] text-neutral-400">{c.posts} posts this month</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TrendingTopics() {
    const topics = ["#MatchDay", "#TheHunters", "#GPL2025", "#HuntersYouth", "#AwayEnd", "#FanPoll"];
    return (
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                <Icon icon="ph:trend-up-duotone" className="w-4 h-4 text-green-500" />
                Trending Topics
            </h4>
            <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                    <button
                        key={t}
                        className="text-xs font-bold text-primary bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all"
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>
    );
}

function ClubNewsSidebar() {
    const news = [
        { title: "Bechem United signs new striker ahead of second round", time: "2h" },
        { title: "Match preview: Hunters vs Kotoko – tactical breakdown", time: "5h" },
        { title: "Community project delivers 200 school bags to Bechem pupils", time: "1d" },
    ];
    return (
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                <Icon icon="ph:newspaper-duotone" className="w-4 h-4 text-blue-500" />
                Club News
            </h4>
            <div className="space-y-4">
                {news.map((n) => (
                    <div key={n.title} className="flex gap-3 group cursor-pointer">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                        <div>
                            <p className="text-xs font-semibold text-neutral-700 leading-relaxed group-hover:text-primary transition-colors">{n.title}</p>
                            <span className="text-[10px] text-neutral-400">{n.time} ago</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
const FILTERS = [
    { id: "all", label: "All Posts", icon: "ph:house-line-duotone" },
    { id: "announcements", label: "Announcements", icon: "ph:megaphone-duotone" },
    { id: "match", label: "Match Talk", icon: "ph:soccer-ball-duotone" },
    { id: "community", label: "Community", icon: "ph:users-three-duotone" },
    { id: "polls", label: "Polls", icon: "ph:chart-bar-horizontal-duotone" },
];

// ─── Main Activity Feed ───────────────────────────────────────────────────────
export default function ActivityFeed() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
    const [activeFilter, setActiveFilter] = useState("all");

    // Memoised so useCallback dependency arrays stay stable across renders
    const currentAuthor = useMemo(
        () =>
            user
                ? makeGuestAuthor(user)
                : ({ id: "guest", name: "Guest", role: "fan" as const }),
        [user]
    );

    // ── Post new ──
    const handleNewPost = useCallback((content: string) => {
        const newPost: Post = {
            id: `p-${Date.now()}`,
            author: currentAuthor,
            content,
            createdAt: new Date().toISOString(),
            reactions: [
                { type: "like", count: 0, reacted: false },
                { type: "fire", count: 0, reacted: false },
                { type: "heart", count: 0, reacted: false },
                { type: "celebrate", count: 0, reacted: false },
            ],
            comments: [],
            commentsOpen: false,
            type: "post",
        };
        setPosts((prev) => [newPost, ...prev]);
    }, [currentAuthor]);

    // ── React ──
    const handleReact = useCallback((postId: string, type: ReactionType) => {
        setPosts((prev) =>
            prev.map((p) => {
                if (p.id !== postId) return p;
                return {
                    ...p,
                    reactions: p.reactions.map((r) => {
                        if (r.type === type) {
                            return { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted };
                        }
                        // Deselect other reactions
                        return r.reacted ? { ...r, count: r.count - 1, reacted: false } : r;
                    }),
                };
            })
        );
    }, []);

    // ── Toggle comments ──
    const handleToggleComments = useCallback((postId: string) => {
        setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, commentsOpen: !p.commentsOpen } : p))
        );
    }, []);

    // ── Add comment ──
    const handleAddComment = useCallback((postId: string, content: string) => {
        const newComment: Comment = {
            id: `c-${Date.now()}`,
            author: currentAuthor,
            content,
            createdAt: new Date().toISOString(),
            likes: 0,
            likedByMe: false,
        };
        setPosts((prev) =>
            prev.map((p) => {
                if (p.id !== postId) return p;
                return { ...p, comments: [...p.comments, newComment], commentsOpen: true };
            })
        );
    }, [currentAuthor]);

    // ── Like comment ──
    const handleLikeComment = useCallback((postId: string, commentId: string) => {
        setPosts((prev) =>
            prev.map((p) => {
                if (p.id !== postId) return p;
                return {
                    ...p,
                    comments: p.comments.map((c) => {
                        if (c.id !== commentId) return c;
                        return { ...c, likes: c.likedByMe ? c.likes - 1 : c.likes + 1, likedByMe: !c.likedByMe };
                    }),
                };
            })
        );
    }, []);

    // ── Vote on poll ──
    const handleVote = useCallback((postId: string, optionId: string) => {
        setPosts((prev) =>
            prev.map((p) => {
                if (p.id !== postId) return p;
                return {
                    ...p,
                    pollOptions: p.pollOptions?.map((o) => ({
                        ...o,
                        votes: o.id === optionId ? o.votes + 1 : o.votes,
                        votedByMe: o.id === optionId,
                    })),
                };
            })
        );
    }, []);

    // ── Apply filter ──
    const filteredPosts = posts.filter((p) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "announcements") return p.type === "announcement";
        if (activeFilter === "polls") return p.type === "poll";
        if (activeFilter === "community") return p.tags?.some((t) => ["community", "youth"].includes(t));
        if (activeFilter === "match") return p.tags?.some((t) => ["match-day", "match-review", "away-game"].includes(t));
        return true;
    });

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Hunters Hub"
                subtext="Your fan community feed"
                showLine
                uppercase
            />

            <div className="flex gap-6 relative">
                {/* ── Feed Column ─────────────────────────── */}
                <div className="flex-1 min-w-0 space-y-4">
                    {/* Compose */}
                    <ComposeBox onPost={handleNewPost} author={currentAuthor} />

                    {/* Filter tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                        {FILTERS.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setActiveFilter(f.id)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all ${activeFilter === f.id
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "bg-white text-neutral-500 border border-neutral-200 hover:border-primary/30 hover:text-primary"
                                    }`}
                            >
                                <Icon icon={f.icon} className="w-3.5 h-3.5" />
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Posts */}
                    <div className="space-y-4">
                        <AnimatePresence initial={false}>
                            {filteredPosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    currentAuthor={currentAuthor}
                                    onReact={handleReact}
                                    onToggleComments={handleToggleComments}
                                    onAddComment={handleAddComment}
                                    onLikeComment={handleLikeComment}
                                    onVote={handleVote}
                                />
                            ))}
                        </AnimatePresence>

                        {filteredPosts.length === 0 && (
                            <div className="text-center py-16 text-neutral-400">
                                <Icon icon="ph:chat-slash-duotone" className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                                <p className="text-sm font-medium">No posts in this category yet.</p>
                                <p className="text-xs mt-1">Be the first to post something!</p>
                            </div>
                        )}
                    </div>

                    {/* Load more */}
                    <button className="w-full py-3 text-xs font-bold text-neutral-500 hover:text-primary border border-dashed border-neutral-200 hover:border-primary/30 rounded-xl transition-all">
                        Load older posts
                    </button>
                </div>

                {/* ── Sidebar ──────────────────────────────── */}
                <aside className="hidden xl:flex flex-col gap-4 w-72 shrink-0">
                    <TopContributors />
                    <TrendingTopics />
                    <ClubNewsSidebar />
                </aside>
            </div>
        </div>
    );
}
