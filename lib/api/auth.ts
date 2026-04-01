import { apiRequest } from "./client";
import { AuthResponse, User } from "./types";

interface LoginData { email: string; password: string; }
interface RegisterData { name: string; email: string; password: string; }
interface ResetPasswordData { token: string; newPassword: string; }
interface ChangePasswordData { currentPassword: string; newPassword: string; }
interface GenericResponse { success: boolean; message: string; }

export const authService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        return apiRequest<AuthResponse>("/auth/register", {
            method: "POST",
            body: data,
        });
    },

    async login(data: LoginData): Promise<AuthResponse> {
        return apiRequest<AuthResponse>("/auth/login", {
            method: "POST",
            body: data,
        });
    },

    async verifyEmail(token: string): Promise<AuthResponse> {
        return apiRequest<AuthResponse>("/auth/verify-email", {
            method: "POST",
            body: { token },
        });
    },

    async resendVerification(email: string): Promise<GenericResponse> {
        return apiRequest<GenericResponse>("/auth/resend-verification", {
            method: "POST",
            body: { email },
        });
    },

    async forgotPassword(email: string): Promise<GenericResponse> {
        return apiRequest<GenericResponse>("/auth/forgot-password", {
            method: "POST",
            body: { email },
        });
    },

    async resetPassword(data: ResetPasswordData): Promise<GenericResponse> {
        return apiRequest<GenericResponse>("/auth/reset-password", {
            method: "POST",
            body: data,
        });
    },

    async verifyToken(token: string): Promise<User> {
        return apiRequest<User>("/auth/verify-token", {
            method: "POST",
            body: { token },
        });
    },

    async getProfile(token: string): Promise<User> {
        const res = await apiRequest<{ success: boolean; user: User }>("/user/profile", {
            method: "GET",
            token,
        });
        return res.user;
    },

    async updateProfile(token: string, data: Partial<User>): Promise<User> {
        const res = await apiRequest<{ success: boolean; message: string; user: User }>("/user/profile", {
            method: "PATCH",
            body: data,
            token,
        });
        return res.user;
    },

    async changePassword(token: string, data: ChangePasswordData): Promise<GenericResponse> {
        return apiRequest<GenericResponse>("/user/change-password", {
            method: "POST",
            body: data,
            token,
        });
    },

    async logout(token: string): Promise<void> {
        return apiRequest("/user/logout", {
            method: "POST",
            token,
        });
    },
};
