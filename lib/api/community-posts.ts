import { apiRequest } from "./client";

// ─── Backend Response Types ──────────────────────────────────────────────────
// Backend stores author data as flat strings on the Sanity document (authorId,
// authorName). There is NO nested "author" object — the raw Sanity document is
// returned directly from the API without transformation.

export interface BackendFanPost {
    _id: string;
    content: string;
    imageUrl?: string;
    authorId: string;
    authorName: string;
    likes: string[];
    likesCount: number;
    commentsCount: number;
    isPinned: boolean;
    isHidden: boolean;
    status: string;
    fixtureId?: string;
    _createdAt: string;
    _updatedAt: string;
}

export interface BackendComment {
    _id: string;
    content: string;
    authorId: string;
    authorName: string;
    entityType: "fan_post" | "community_project";
    entityId: string;
    parentCommentId?: string;
    likes: string[];
    likesCount: number;
    status: string;
    _createdAt: string;
    _updatedAt: string;
    replies?: BackendComment[];
}

interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ─── Fan Posts Service ────────────────────────────────────────────────────────

export const communityPostsService = {
    async list(token: string, page = 1, pageSize = 20): Promise<PaginatedResponse<BackendFanPost>> {
        return apiRequest<PaginatedResponse<BackendFanPost>>(
            `/fan-posts?page=${page}&pageSize=${pageSize}`,
            { token }
        );
    },

    async get(token: string, id: string): Promise<{ success: boolean; data: BackendFanPost }> {
        return apiRequest(`/fan-posts/${id}`, { token });
    },

    async create(
        token: string,
        data: { content: string; imageUrl?: string }
    ): Promise<{ success: boolean; data: BackendFanPost; message: string }> {
        return apiRequest("/fan-posts", {
            method: "POST",
            body: data,
            token,
        });
    },

    async update(
        token: string,
        id: string,
        data: { content?: string; imageUrl?: string | null }
    ): Promise<{ success: boolean; data: BackendFanPost; message: string }> {
        return apiRequest(`/fan-posts/${id}`, {
            method: "PATCH",
            body: data,
            token,
        });
    },

    async delete(
        token: string,
        id: string
    ): Promise<{ success: boolean; message: string }> {
        return apiRequest(`/fan-posts/${id}`, {
            method: "DELETE",
            token,
        });
    },

    async like(
        token: string,
        id: string
    ): Promise<{ success: boolean; message: string; liked: boolean }> {
        return apiRequest(`/fan-posts/${id}/like`, {
            method: "POST",
            token,
        });
    },

    async flag(
        token: string,
        id: string
    ): Promise<{ success: boolean; message: string }> {
        return apiRequest(`/fan-posts/${id}/flag`, {
            method: "POST",
            token,
        });
    },
};

// ─── Comments Service ────────────────────────────────────────────────────────

export const commentsService = {
    async list(
        token: string,
        entityType: "fan_post" | "community_project",
        entityId: string,
        page = 1,
        pageSize = 20
    ): Promise<PaginatedResponse<BackendComment>> {
        return apiRequest<PaginatedResponse<BackendComment>>(
            `/comments?entityType=${entityType}&entityId=${entityId}&page=${page}&pageSize=${pageSize}`,
            { token }
        );
    },

    async create(
        token: string,
        data: {
            content: string;
            entityType: "fan_post" | "community_project";
            entityId: string;
            parentCommentId?: string;
        }
    ): Promise<{ success: boolean; data: BackendComment; message: string }> {
        return apiRequest("/comments", {
            method: "POST",
            body: data,
            token,
        });
    },

    async like(
        token: string,
        id: string
    ): Promise<{ success: boolean; message: string; liked: boolean }> {
        return apiRequest(`/comments/${id}/like`, {
            method: "POST",
            token,
        });
    },

    async delete(
        token: string,
        id: string
    ): Promise<{ success: boolean; message: string }> {
        return apiRequest(`/comments/${id}`, {
            method: "DELETE",
            token,
        });
    },
};
