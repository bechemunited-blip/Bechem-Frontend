import { apiRequest } from "./client";

// ─── Backend Response Types ──────────────────────────────────────────────────

export interface BackendPost {
  _id: string;
  _type: string;
  _createdAt: string;
  content: string;
  authorId: string;
  authorName: string;
  imageUrl?: string | null;
  fixtureId?: string | null;
  likes: string[];
  likesCount: number;
  commentsCount: number;
  flaggedBy: string[];
  flagCount: number;
  isPinned: boolean;
  isHidden: boolean;
  status: string;
}

export interface BackendComment {
  _id: string;
  _type: string;
  _createdAt: string;
  content: string;
  authorId: string;
  authorName: string;
  entityType: string;
  entityId: string;
  parentCommentId?: string;
  likes: string[];
  likesCount: number;
  status: string;
  replies?: BackendComment[];
}

export interface BackendPoll {
  _id: string;
  _type: string;
  _createdAt: string;
  question: string;
  authorId: string;
  authorName: string;
  options: Record<string, { text: string; voteCount: number }>;
  choiceType: "single_choice" | "multiple_choice";
  status: "active" | "closed";
  endsAt?: string;
  showResultsBeforeEnd: boolean;
  totalVotes: number;
}

export interface BackendEvent {
  _id: string;
  _type: string;
  _createdAt: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  date: string;
  location: string;
  capacity?: number;
  waitlistEnabled: boolean;
  rsvpDeadline?: string;
  attendees: Array<{ userId: string; userName: string; status: string }>;
  waitlist: Array<{ userId: string; userName: string }>;
  status: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ─── Community Posts API ─────────────────────────────────────────────────────

export const communityPostsApi = {
  async list(token: string, page = 1, pageSize = 20): Promise<PaginatedResponse<BackendPost>> {
    return apiRequest<PaginatedResponse<BackendPost>>("/fan-posts", {
      method: "GET",
      token,
    });
  },

  async get(id: string, token: string): Promise<{ success: boolean; data: BackendPost }> {
    return apiRequest(`/fan-posts/${id}`, { token });
  },

  async create(data: { content: string; imageUrl?: string }, token: string) {
    return apiRequest<{ success: boolean; data: BackendPost }>("/fan-posts", {
      method: "POST",
      body: data,
      token,
    });
  },

  async update(id: string, data: { content?: string; imageUrl?: string }, token: string) {
    return apiRequest<{ success: boolean; data: BackendPost }>(`/fan-posts/${id}`, {
      method: "PATCH",
      body: data,
      token,
    });
  },

  async delete(id: string, token: string) {
    return apiRequest<{ success: boolean }>(`/fan-posts/${id}`, {
      method: "DELETE",
      token,
    });
  },

  async like(id: string, token: string) {
    return apiRequest<{ success: boolean; data: BackendPost }>(`/fan-posts/${id}/like`, {
      method: "POST",
      token,
    });
  },

  async flag(id: string, token: string) {
    return apiRequest<{ success: boolean }>(`/fan-posts/${id}/flag`, {
      method: "POST",
      token,
    });
  },
};

// ─── Comments API ────────────────────────────────────────────────────────────

export const commentsApi = {
  async list(
    entityType: string,
    entityId: string,
    token: string,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<BackendComment>> {
    return apiRequest<PaginatedResponse<BackendComment>>(
      `/comments?entityType=${entityType}&entityId=${entityId}&page=${page}&pageSize=${pageSize}`,
      { token }
    );
  },

  async create(
    data: { content: string; entityType: string; entityId: string; parentCommentId?: string },
    token: string
  ) {
    return apiRequest<{ success: boolean; data: BackendComment }>("/comments", {
      method: "POST",
      body: data,
      token,
    });
  },

  async update(id: string, data: { content: string }, token: string) {
    return apiRequest<{ success: boolean; data: BackendComment }>(`/comments/${id}`, {
      method: "PATCH",
      body: data,
      token,
    });
  },

  async delete(id: string, token: string) {
    return apiRequest<{ success: boolean }>(`/comments/${id}`, {
      method: "DELETE",
      token,
    });
  },

  async like(id: string, token: string) {
    return apiRequest<{ success: boolean; data: BackendComment }>(`/comments/${id}/like`, {
      method: "POST",
      token,
    });
  },
};

// ─── Polls API ───────────────────────────────────────────────────────────────

export const pollsApi = {
  async list(token: string): Promise<PaginatedResponse<BackendPoll>> {
    return apiRequest<PaginatedResponse<BackendPoll>>("/polls", { token });
  },

  async get(id: string, token: string): Promise<{ success: boolean; data: BackendPoll }> {
    return apiRequest(`/polls/${id}`, { token });
  },

  async vote(id: string, selectedOptions: string[], token: string) {
    return apiRequest<{ success: boolean }>(`/polls/${id}/vote`, {
      method: "POST",
      body: { selectedOptions },
      token,
    });
  },

  async results(id: string, token: string) {
    return apiRequest<{ success: boolean; data: BackendPoll }>(`/polls/${id}/results`, { token });
  },

  async myVote(id: string, token: string) {
    return apiRequest<{ success: boolean; data: { selectedOptions: string[] } | null }>(
      `/polls/${id}/my-vote`,
      { token }
    );
  },
};

// ─── Community Events API ────────────────────────────────────────────────────

export const communityEventsApi = {
  async list(token: string): Promise<PaginatedResponse<BackendEvent>> {
    return apiRequest<PaginatedResponse<BackendEvent>>("/events", { token });
  },

  async get(id: string, token: string): Promise<{ success: boolean; data: BackendEvent }> {
    return apiRequest(`/events/${id}`, { token });
  },

  async rsvp(id: string, status: string, token: string) {
    return apiRequest<{ success: boolean }>(`/events/${id}/rsvp`, {
      method: "POST",
      body: { status },
      token,
    });
  },

  async cancelRsvp(id: string, token: string) {
    return apiRequest<{ success: boolean }>(`/events/${id}/rsvp`, {
      method: "DELETE",
      token,
    });
  },
};
