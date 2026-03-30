// ─── Community Hub Types ────────────────────────────────────────────────────

export type ReactionType = "like" | "fire" | "heart" | "celebrate";

export interface PostAuthor {
    id: string;
    name: string;
    avatar?: string;
    role: "admin" | "fan";
    badge?: "Gold Member" | "Silver Member" | "Fan" | "Moderator";
}

export interface PostReaction {
    type: ReactionType;
    count: number;
    reacted: boolean; // whether the current user has reacted
}

export interface Comment {
    id: string;
    author: PostAuthor;
    content: string;
    createdAt: string;
    likes: number;
    likedByMe: boolean;
}

export interface Post {
    id: string;
    author: PostAuthor;
    content: string;
    image?: string;
    createdAt: string;
    reactions: PostReaction[];
    comments: Comment[];
    commentsOpen: boolean;
    type: "post" | "poll" | "match_update" | "announcement";
    pollOptions?: { id: string; text: string; votes: number; votedByMe: boolean }[];
    pinned?: boolean;
    tags?: string[];
    commentsCount?: number;
}

export interface FeedState {
    posts: Post[];
    isLoading: boolean;
    hasMore: boolean;
    page: number;
}
