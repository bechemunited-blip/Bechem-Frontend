"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/store/hooks/useAuth";
import {
    REACTION_META,
    formatRelativeTime,
    getInitials,
    makeGuestAuthor,
} from "@/lib/community/data";
import { Post, Comment, ReactionType, PostAuthor } from "@/lib/community/types";
import {
    communityPostsService,
    commentsService,
    BackendFanPost,
    BackendComment,
} from "@/lib/api/community-posts";
import SectionHeader from "@/components/layout/SectionHeader";

// ─── Backend → Frontend Mappers ──────────────────────────────────────────────
// Backend returns raw Sanity documents with flat authorId/authorName strings.
// Avatar and role are not stored on fan posts/comments, so we default role to
// "fan" here. The user's own posts will show their avatar via the currentAuthor
// prop which comes from the auth profile.

function mapPostAuthor(authorId: string, authorName: string): PostAuthor {
    return {
        id: authorId,
        name: authorName,
        role: "fan",
        badge: "Fan",
    };
}

function mapBackendPost(post: BackendFanPost, currentUserId?: string): Post {
    const userLiked = currentUserId ? post.likes?.includes(currentUserId) : false;
    return {
        id: post._id,
        author: mapPostAuthor(post.authorId, post.authorName),
        content: post.content,
        image: post.imageUrl,
        createdAt: post._createdAt,
        reactions: [
            { type: "like", count: post.likesCount ?? 0, reacted: userLiked },
            { type: "fire", count: 0, reacted: false },
            { type: "heart", count: 0, reacted: false },
            { type: "celebrate", count: 0, reacted: false },
        ],
        comments: [],
        commentsOpen: false,
        type: "post",
        pinned: post.isPinned,
        commentsCount: post.commentsCount ?? 0,
    };
}

function mapBackendComment(comment: BackendComment, currentUserId?: string): Comment {
    const userLiked = currentUserId ? comment.likes?.includes(currentUserId) : false;
    return {
        id: comment._id,
        author: mapPostAuthor(comment.authorId, comment.authorName),
        content: comment.content,
        createdAt: comment._createdAt,
        likes: comment.likesCount ?? 0,
        likedByMe: userLiked,
    };
}

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
    isSubmitting,
}: {
    onPost: (content: string, imageUrl?: string) => void;
    author: PostAuthor;
    isSubmitting: boolean;
}) {
    const { token } = useAuth();
    const [content, setContent] = useState("");
    const [focused, setFocused] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePost = async () => {
        if ((!content.trim() && !imageFile) || isSubmitting || isUploading) return;

        let uploadedUrl: string | undefined;

        // Upload image first if one was selected
        if (imageFile && token) {
            setIsUploading(true);
            try {
                const { uploadMedia } = await import("@/lib/api/media");
                const res = await uploadMedia(
                    imageFile,
                    { type: "image", entityType: "fan_post", category: "community" },
                    token
                );
                uploadedUrl = res.file.url;
            } catch (err) {
                console.error("Image upload failed:", err);
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        onPost(content.trim(), uploadedUrl);
        setContent("");
        setImageFile(null);
        setImagePreview(null);
        setFocused(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type and size (max 5MB)
        if (!file.type.startsWith("image/")) return;
        if (file.size > 5 * 1024 * 1024) return;

        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const autoResize = () => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        }
    };

    const canPost = (content.trim() || imageFile) && !isSubmitting && !isUploading;

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

            {/* Image preview */}
            {imagePreview && (
                <div className="px-4 pb-2">
                    <div className="relative inline-block rounded-xl overflow-hidden border border-neutral-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Upload preview" className="max-h-48 rounded-xl object-cover" />
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
                        >
                            <Icon icon="ph:x-bold" className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            <AnimatePresence>
                {(focused || content || imageFile) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-neutral-100 px-4 py-3 flex items-center justify-between bg-neutral-50/50"
                    >
                        <div className="flex gap-1">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                title="Upload a photo"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 hover:bg-neutral-100 transition-all"
                            >
                                <Icon icon="ph:image-duotone" className="w-4 h-4 text-green-600" />
                                <span className="hidden sm:inline">Photo</span>
                            </button>
                        </div>
                        <div className="flex gap-2 items-center">
                            {isUploading && (
                                <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                                    <Icon icon="line-md:loading-twotone-loop" className="w-3.5 h-3.5" />
                                    Uploading...
                                </span>
                            )}
                            <button
                                onClick={() => { setContent(""); setFocused(false); removeImage(); }}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePost}
                                disabled={!canPost}
                                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${canPost
                                    ? "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                                    }`}
                            >
                                {isSubmitting ? "Posting..." : isUploading ? "Uploading..." : "Post"}
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
    isLoadingComments,
}: {
    post: Post;
    currentAuthor: PostAuthor;
    onAddComment: (postId: string, content: string) => void;
    onLikeComment: (postId: string, commentId: string) => void;
    isLoadingComments: boolean;
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
            {isLoadingComments ? (
                <div className="flex items-center justify-center py-4">
                    <Icon icon="line-md:loading-twotone-loop" className="w-5 h-5 text-neutral-400" />
                </div>
            ) : (
                post.comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onLike={(cId) => onLikeComment(post.id, cId)}
                    />
                ))
            )}

            {/* New comment input */}
            <div className="flex gap-3 pt-1">
                <Avatar author={currentAuthor} size="sm" />
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        placeholder="Write a comment..."
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
    isLoadingComments,
}: {
    post: Post;
    currentAuthor: PostAuthor;
    onReact: (postId: string, type: ReactionType) => void;
    onToggleComments: (postId: string) => void;
    onAddComment: (postId: string, content: string) => void;
    onLikeComment: (postId: string, commentId: string) => void;
    isLoadingComments: boolean;
}) {
    const isAnnouncement = post.type === "announcement";

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

                {/* Featured Image — external URLs from user uploads */}
                {post.image && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.image} alt="" className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Reaction bar */}
                <ReactionBar
                    reactions={post.reactions}
                    onReact={(type) => onReact(post.id, type)}
                    totalComments={post.commentsCount ?? post.comments.length}
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
                            isLoadingComments={isLoadingComments}
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
        { title: "Match preview: Hunters vs Kotoko - tactical breakdown", time: "5h" },
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
    { id: "pinned", label: "Pinned", icon: "ph:push-pin-duotone" },
];

// ─── Main Activity Feed ───────────────────────────────────────────────────────
export default function ActivityFeed() {
    const { user, token } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadingCommentsFor, setLoadingCommentsFor] = useState<string | null>(null);

    const currentAuthor = useMemo(
        () =>
            user
                ? makeGuestAuthor(user)
                : ({ id: "guest", name: "Guest", role: "fan" as const }),
        [user]
    );

    // ── Fetch posts on mount (wait for token since backend requires auth) ──
    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        async function fetchPosts() {
            try {
                setIsLoading(true);
                setError(null);
                const res = await communityPostsService.list(token!, 1, 20);
                if (cancelled) return;
                const mapped = res.data.map((p) => mapBackendPost(p, user?.id));
                setPosts(mapped);
                setHasMore(res.page < res.totalPages);
                setPage(res.page);
            } catch (err: unknown) {
                if (cancelled) return;
                const e = err as { message?: string };
                setError(e.message || "Failed to load posts");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        fetchPosts();
        return () => { cancelled = true; };
    }, [token, user?.id]);

    // ── Load more posts ──
    const handleLoadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore || !token) return;
        setIsLoadingMore(true);
        try {
            const nextPage = page + 1;
            const res = await communityPostsService.list(token!, nextPage, 20);
            const mapped = res.data.map((p) => mapBackendPost(p, user?.id));
            setPosts((prev) => [...prev, ...mapped]);
            setPage(res.page);
            setHasMore(res.page < res.totalPages);
        } catch {
            // Silent fail for load more
        } finally {
            setIsLoadingMore(false);
        }
    }, [isLoadingMore, hasMore, page, token, user?.id]);

    // ── Post new ──
    const handleNewPost = useCallback(async (content: string, imageUrl?: string) => {
        if (!token) return;
        setIsSubmitting(true);
        try {
            const body: { content: string; imageUrl?: string } = { content };
            if (imageUrl) body.imageUrl = imageUrl;
            const res = await communityPostsService.create(token, body);
            const newPost = mapBackendPost(res.data, user?.id);
            setPosts((prev) => [newPost, ...prev]);
        } catch (err: unknown) {
            const e = err as { message?: string };
            console.error("Failed to create post:", e.message);
        } finally {
            setIsSubmitting(false);
        }
    }, [token, user?.id]);

    // ── Like (syncs with backend) ──
    const handleReact = useCallback(async (postId: string, type: ReactionType) => {
        // Only "like" type syncs with backend; other reaction types are client-only visual
        if (type === "like" && token) {
            try {
                const res = await communityPostsService.like(token, postId);
                setPosts((prev) =>
                    prev.map((p) => {
                        if (p.id !== postId) return p;
                        return {
                            ...p,
                            reactions: p.reactions.map((r) => {
                                if (r.type === "like") {
                                    return { ...r, count: res.liked ? r.count + 1 : r.count - 1, reacted: res.liked };
                                }
                                return r;
                            }),
                        };
                    })
                );
                return;
            } catch {
                // Fall through to optimistic update
            }
        }

        // Optimistic client-side update for non-like reactions
        setPosts((prev) =>
            prev.map((p) => {
                if (p.id !== postId) return p;
                return {
                    ...p,
                    reactions: p.reactions.map((r) => {
                        if (r.type === type) {
                            return { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted };
                        }
                        return r.reacted ? { ...r, count: r.count - 1, reacted: false } : r;
                    }),
                };
            })
        );
    }, [token]);

    // ── Toggle comments (fetch from API on first open) ──
    const handleToggleComments = useCallback(async (postId: string) => {
        const post = posts.find((p) => p.id === postId);
        if (!post) return;

        if (post.commentsOpen) {
            // Just close
            setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, commentsOpen: false } : p)));
            return;
        }

        // Open and fetch comments if not already loaded
        if (post.comments.length === 0 && (post.commentsCount ?? 0) > 0) {
            setLoadingCommentsFor(postId);
            try {
                const res = await commentsService.list(token!, "fan_post", postId);
                const mapped = res.data.map((c) => mapBackendComment(c, user?.id));
                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === postId ? { ...p, comments: mapped, commentsOpen: true } : p
                    )
                );
            } catch {
                // Open with empty comments on error
                setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, commentsOpen: true } : p)));
            } finally {
                setLoadingCommentsFor(null);
            }
        } else {
            setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, commentsOpen: true } : p)));
        }
    }, [posts, user?.id]);

    // ── Add comment ──
    const handleAddComment = useCallback(async (postId: string, content: string) => {
        if (!token) return;
        try {
            const res = await commentsService.create(token, {
                content,
                entityType: "fan_post",
                entityId: postId,
            });
            const newComment = mapBackendComment(res.data, user?.id);
            setPosts((prev) =>
                prev.map((p) => {
                    if (p.id !== postId) return p;
                    return {
                        ...p,
                        comments: [...p.comments, newComment],
                        commentsOpen: true,
                        commentsCount: (p.commentsCount ?? p.comments.length) + 1,
                    };
                })
            );
        } catch (err: unknown) {
            const e = err as { message?: string };
            console.error("Failed to add comment:", e.message);
        }
    }, [token, user?.id]);

    // ── Like comment ──
    const handleLikeComment = useCallback(async (postId: string, commentId: string) => {
        if (!token) return;
        try {
            const res = await commentsService.like(token, commentId);
            setPosts((prev) =>
                prev.map((p) => {
                    if (p.id !== postId) return p;
                    return {
                        ...p,
                        comments: p.comments.map((c) => {
                            if (c.id !== commentId) return c;
                            return {
                                ...c,
                                likes: res.liked ? c.likes + 1 : c.likes - 1,
                                likedByMe: res.liked,
                            };
                        }),
                    };
                })
            );
        } catch {
            // Silent fail
        }
    }, [token]);

    // ── Apply filter ──
    const filteredPosts = posts.filter((p) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "pinned") return p.pinned;
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
                    {/* Compose (only for authenticated users) */}
                    {user && (
                        <ComposeBox onPost={handleNewPost} author={currentAuthor} isSubmitting={isSubmitting} />
                    )}

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

                    {/* Loading state */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Icon icon="line-md:loading-twotone-loop" className="w-10 h-10 text-primary" />
                            <p className="text-sm text-neutral-400 font-medium">Loading posts...</p>
                        </div>
                    )}

                    {/* Error state */}
                    {error && !isLoading && (
                        <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
                            <Icon icon="ph:warning-circle-duotone" className="w-10 h-10 mx-auto mb-3 text-red-400" />
                            <p className="text-sm font-medium text-red-600">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-3 px-4 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Posts */}
                    {!isLoading && !error && (
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
                                        isLoadingComments={loadingCommentsFor === post.id}
                                    />
                                ))}
                            </AnimatePresence>

                            {filteredPosts.length === 0 && (
                                <div className="text-center py-16 text-neutral-400">
                                    <Icon icon="ph:chat-slash-duotone" className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                                    <p className="text-sm font-medium">No posts yet.</p>
                                    <p className="text-xs mt-1">Be the first to post something!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Load more */}
                    {!isLoading && !error && hasMore && (
                        <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="w-full py-3 text-xs font-bold text-neutral-500 hover:text-primary border border-dashed border-neutral-200 hover:border-primary/30 rounded-xl transition-all"
                        >
                            {isLoadingMore ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Icon icon="line-md:loading-twotone-loop" className="w-4 h-4" />
                                    Loading...
                                </span>
                            ) : (
                                "Load older posts"
                            )}
                        </button>
                    )}
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
