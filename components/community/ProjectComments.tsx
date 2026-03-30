"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAuth } from "@/store/hooks/useAuth";
import { useUI } from "@/store/hooks/useUI";
import { getInitials, formatRelativeTime } from "@/lib/community/data";
import { commentsService, BackendComment } from "@/lib/api/community-posts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProjectComment {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    authorRole: "admin" | "fan";
    content: string;
    createdAt: string;
    likes: number;
    likedByMe: boolean;
    replies: ProjectComment[];
    showReplies: boolean;
}

// ─── Backend → Frontend Mapper ───────────────────────────────────────────────
// Backend returns raw Sanity documents with flat authorId/authorName strings.

function mapBackendComment(comment: BackendComment, currentUserId?: string): ProjectComment {
    const userLiked = currentUserId ? comment.likes?.includes(currentUserId) : false;
    return {
        id: comment._id,
        authorId: comment.authorId,
        authorName: comment.authorName,
        authorRole: "fan",
        content: comment.content,
        createdAt: comment._createdAt,
        likes: comment.likesCount ?? 0,
        likedByMe: userLiked,
        replies: (comment.replies || []).map((r) => mapBackendComment(r, currentUserId)),
        showReplies: false,
    };
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, avatar, role, size = "md" }: { name: string; avatar?: string; role: "admin" | "fan"; size?: "sm" | "md" }) {
    const dims = { sm: "w-8 h-8 text-[10px]", md: "w-10 h-10 text-xs" };
    const ring = role === "admin" ? "ring-primary" : "ring-neutral-200";
    return (
        <div className={`${dims[size]} rounded-full ring-2 ${ring} overflow-hidden shrink-0 flex items-center justify-center font-black bg-primary/10 text-primary`}>
            {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : <span>{getInitials(name)}</span>}
        </div>
    );
}

// ─── Single Comment ────────────────────────────────────────────────────────────
function CommentItem({
    comment,
    currentUserId,
    onLike,
    onReply,
    onToggleReplies,
    depth = 0,
}: {
    comment: ProjectComment;
    currentUserId?: string;
    onLike: (id: string) => void;
    onReply: (id: string, content: string) => void;
    onToggleReplies: (id: string) => void;
    depth?: number;
}) {
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState("");

    const submitReply = () => {
        if (!replyText.trim()) return;
        onReply(comment.id, replyText.trim());
        setReplyText("");
        setReplying(false);
    };

    const isAdmin = comment.authorRole === "admin";

    return (
        <div className={`flex gap-3 ${depth > 0 ? "ml-10 md:ml-14" : ""}`}>
            <Avatar name={comment.authorName} avatar={comment.authorAvatar} role={comment.authorRole} size={depth > 0 ? "sm" : "md"} />
            <div className="flex-1 min-w-0">
                {/* Bubble */}
                <div className={`rounded-2xl px-4 py-3 ${isAdmin ? "bg-primary/5 border border-primary/10" : "bg-neutral-100"}`}>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-black text-neutral-900">{comment.authorName}</span>
                        {isAdmin && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                Official
                            </span>
                        )}
                        <span className="text-[10px] text-neutral-400">{formatRelativeTime(comment.createdAt)} ago</span>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed">{comment.content}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-1.5 px-1">
                    <button
                        onClick={() => onLike(comment.id)}
                        className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${comment.likedByMe ? "text-primary" : "text-neutral-400 hover:text-neutral-600"}`}
                    >
                        <Icon icon={comment.likedByMe ? "ph:thumbs-up-fill" : "ph:thumbs-up"} className="w-3 h-3" />
                        {comment.likes > 0 ? comment.likes : "Like"}
                    </button>
                    {currentUserId && depth === 0 && (
                        <button
                            onClick={() => setReplying((p) => !p)}
                            className="text-[10px] font-bold text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                            Reply
                        </button>
                    )}
                    {comment.replies.length > 0 && (
                        <button
                            onClick={() => onToggleReplies(comment.id)}
                            className="text-[10px] font-bold text-primary hover:text-primary/70 transition-colors"
                        >
                            {comment.showReplies ? "Hide" : `View ${comment.replies.length} repl${comment.replies.length !== 1 ? "ies" : "y"}`}
                        </button>
                    )}
                </div>

                {/* Reply input */}
                <AnimatePresence>
                    {replying && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex gap-2 mt-3"
                        >
                            <input
                                autoFocus
                                type="text"
                                placeholder="Write a reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && submitReply()}
                                className="flex-1 bg-neutral-100 rounded-full px-4 py-2 text-sm outline-none placeholder:text-neutral-400 font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <button
                                onClick={submitReply}
                                disabled={!replyText.trim()}
                                className={`p-2 rounded-full transition-all ${replyText.trim() ? "bg-primary text-white" : "bg-neutral-200 text-neutral-400"}`}
                            >
                                <Icon icon="ph:paper-plane-right-fill" className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Replies */}
                <AnimatePresence>
                    {comment.showReplies && comment.replies.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-4 space-y-4"
                        >
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    currentUserId={currentUserId}
                                    onLike={onLike}
                                    onReply={onReply}
                                    onToggleReplies={onToggleReplies}
                                    depth={1}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProjectComments({ projectId, projectTitle }: { projectId: string; projectTitle: string }) {
    const { user, token, isAuthenticated } = useAuth();
    const { openAuthModal } = useUI();
    const [comments, setComments] = useState<ProjectComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [sortBy, setSortBy] = useState<"newest" | "top">("newest");
    const [isLoading, setIsLoading] = useState(true);
    const [totalComments, setTotalComments] = useState(0);

    // ── Fetch comments on mount (wait for token since backend requires auth) ──
    useEffect(() => {
        if (!token) {
            setIsLoading(false);
            return;
        }
        let cancelled = false;
        async function fetchComments() {
            try {
                setIsLoading(true);
                const res = await commentsService.list(token!, "community_project", projectId);
                if (cancelled) return;
                const mapped = res.data.map((c) => mapBackendComment(c, user?.id));
                setComments(mapped);
                setTotalComments(res.total);
            } catch (err) {
                console.error("Failed to load comments:", err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        fetchComments();
        return () => { cancelled = true; };
    }, [token, projectId, user?.id]);

    // ── Add top-level comment ──
    const handleAddComment = useCallback(async () => {
        if (!newComment.trim() || !token) return;
        try {
            const res = await commentsService.create(token, {
                content: newComment.trim(),
                entityType: "community_project",
                entityId: projectId,
            });
            const mapped = mapBackendComment(res.data, user?.id);
            setComments((prev) => [mapped, ...prev]);
            setTotalComments((prev) => prev + 1);
            setNewComment("");
        } catch (err) {
            console.error("Failed to add comment:", err);
        }
    }, [newComment, token, projectId, user?.id]);

    // ── Like any comment ──
    const handleLike = useCallback(async (id: string) => {
        if (!token) return;
        try {
            const res = await commentsService.like(token, id);
            const updateLike = (list: ProjectComment[]): ProjectComment[] =>
                list.map((c) => {
                    if (c.id === id) {
                        return {
                            ...c,
                            likes: res.liked ? c.likes + 1 : c.likes - 1,
                            likedByMe: res.liked,
                        };
                    }
                    return { ...c, replies: updateLike(c.replies) };
                });
            setComments(updateLike);
        } catch {
            // Silent fail
        }
    }, [token]);

    // ── Add reply ──
    const handleReply = useCallback(async (parentId: string, content: string) => {
        if (!token) return;
        try {
            const res = await commentsService.create(token, {
                content,
                entityType: "community_project",
                entityId: projectId,
                parentCommentId: parentId,
            });
            const mapped = mapBackendComment(res.data, user?.id);
            setComments((prev) =>
                prev.map((c) =>
                    c.id === parentId
                        ? { ...c, replies: [...c.replies, mapped], showReplies: true }
                        : c
                )
            );
            setTotalComments((prev) => prev + 1);
        } catch (err) {
            console.error("Failed to add reply:", err);
        }
    }, [token, projectId, user?.id]);

    // ── Toggle replies ──
    const handleToggleReplies = useCallback((id: string) => {
        setComments((prev) =>
            prev.map((c) => c.id === id ? { ...c, showReplies: !c.showReplies } : c)
        );
    }, []);

    const sorted = [...comments].sort((a, b) =>
        sortBy === "top"
            ? b.likes - a.likes
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const displayTotal = comments.reduce((s, c) => s + 1 + c.replies.length, 0);

    return (
        <div className="mt-16 pt-8 border-t border-neutral-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h3 className="font-mona-sans font-black text-xl uppercase tracking-tight text-neutral-9 flex items-center gap-3">
                    <Icon icon="ph:chat-circle-dots-duotone" className="w-6 h-6 text-primary" />
                    Community Reactions
                    <span className="text-sm text-neutral-400 font-bold normal-case tracking-normal">
                        ({isLoading ? "..." : displayTotal})
                    </span>
                </h3>
                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-full">
                    {(["newest", "top"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setSortBy(s)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${sortBy === s ? "bg-white text-neutral-9 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
                        >
                            {s === "newest" ? "Newest" : "Top"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Compose */}
            {isAuthenticated ? (
                <div className="flex gap-3 mb-8">
                    <Avatar name={user!.name} avatar={user?.avatar} role={user!.role} />
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            placeholder={`Share your thoughts on "${projectTitle}"...`}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                            className="flex-1 bg-neutral-100 rounded-full px-5 py-3 text-sm outline-none placeholder:text-neutral-400 font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className={`p-3 rounded-full transition-all ${newComment.trim() ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90" : "bg-neutral-200 text-neutral-400"}`}
                        >
                            <Icon icon="ph:paper-plane-right-fill" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mb-8 p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon icon="ph:lock-key-duotone" className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-neutral-800 mb-0.5">Join the conversation</p>
                        <p className="text-xs text-neutral-500">Sign in or create a free account to comment, like, and react to this project.</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => openAuthModal("signin")}
                            className="px-4 py-2 rounded-full border border-primary/20 text-primary text-xs font-black uppercase tracking-wider hover:bg-primary hover:text-white transition-all"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => openAuthModal("signup")}
                            className="px-4 py-2 rounded-full bg-primary text-white text-xs font-black uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                        >
                            Join Free
                        </button>
                    </div>
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Icon icon="line-md:loading-twotone-loop" className="w-8 h-8 text-primary" />
                </div>
            )}

            {/* Comment list */}
            {!isLoading && (
                <div className="space-y-6">
                    <AnimatePresence initial={false}>
                        {sorted.map((comment) => (
                            <motion.div
                                key={comment.id}
                                layout
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                            >
                                <CommentItem
                                    comment={comment}
                                    currentUserId={user?.id}
                                    onLike={handleLike}
                                    onReply={handleReply}
                                    onToggleReplies={handleToggleReplies}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {comments.length === 0 && (
                        <div className="text-center py-12 text-neutral-400">
                            <Icon icon="ph:chat-circle-dashed-duotone" className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
                            <p className="text-sm font-medium">No comments yet.</p>
                            <p className="text-xs mt-1">Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
