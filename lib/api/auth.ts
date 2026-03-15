import { apiRequest } from "./client";
import { AuthResponse, User } from "./types";

interface LoginData { email: string; password: string; }
interface RegisterData { name: string; email: string; password: string; }
interface ResetPasswordData { token: string; newPassword: string; }
interface ChangePasswordData { currentPassword: string; newPassword: string; }
interface GenericResponse { success: boolean; message: string; }

export const authService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        console.log(`[Auth] 📝 REGISTER called with:`, { name: data.name, email: data.email, password: '***' });
        const res = await apiRequest<AuthResponse>("/auth/register", {
            method: "POST",
            body: data,
        });
        console.log(`[Auth] 📝 REGISTER response:`, res);
        return res;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        console.log(`[Auth] 🔐 LOGIN called with:`, { email: data.email, password: '***' });
        const res = await apiRequest<AuthResponse>("/auth/login", {
            method: "POST",
            body: data,
        });
        console.log(`[Auth] 🔐 LOGIN response:`, { token: res.token ? '✅ received' : '❌ missing', user: res.user });
        return res;
    },

    async verifyEmail(token: string): Promise<AuthResponse> {
        console.log(`[Auth] ✉️ VERIFY EMAIL called with token:`, token.substring(0, 20) + '...');
        const res = await apiRequest<AuthResponse>("/auth/verify-email", {
            method: "POST",
            body: { token },
        });
        console.log(`[Auth] ✉️ VERIFY EMAIL response:`, res);
        return res;
    },

    async resendVerification(email: string): Promise<GenericResponse> {
        console.log(`[Auth] 🔄 RESEND VERIFICATION called for:`, email);
        const res = await apiRequest<GenericResponse>("/auth/resend-verification", {
            method: "POST",
            body: { email },
        });
        console.log(`[Auth] 🔄 RESEND VERIFICATION response:`, res);
        return res;
    },

    async forgotPassword(email: string): Promise<GenericResponse> {
        console.log(`[Auth] 🔑 FORGOT PASSWORD called for:`, email);
        const res = await apiRequest<GenericResponse>("/auth/forgot-password", {
            method: "POST",
            body: { email },
        });
        console.log(`[Auth] 🔑 FORGOT PASSWORD response:`, res);
        return res;
    },

    async resetPassword(data: ResetPasswordData): Promise<GenericResponse> {
        console.log(`[Auth] 🔒 RESET PASSWORD called with token:`, data.token.substring(0, 20) + '...');
        const res = await apiRequest<GenericResponse>("/auth/reset-password", {
            method: "POST",
            body: data,
        });
        console.log(`[Auth] 🔒 RESET PASSWORD response:`, res);
        return res;
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
