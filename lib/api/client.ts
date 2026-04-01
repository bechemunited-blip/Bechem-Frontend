const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    token?: string;
}

interface ApiError extends Error {
    status?: number;
    code?: string;
    originalError?: unknown;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {}, token } = options;
    const url = `${BASE_URL}${endpoint}`;

    const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
    };

    if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers: requestHeaders,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        const isJson = contentType && contentType.includes("application/json");

        let data;
        if (isJson) {
            data = await response.json();
        } else {
            // Handle non-JSON response (could be an error page)
            const text = await response.text();
            if (!response.ok) {
                const error = new Error(`HTTP Error ${response.status}: ${response.statusText || 'Unknown Error'}`) as ApiError;
                error.status = response.status;
                throw error;
            }
            // Return text or empty if successful but not JSON
            return text as unknown as T;
        }

        if (!response.ok) {
            throw {
                message: data.message || `API Error ${response.status}`,
                status: response.status,
                code: data.code,
            };
        }

        return data as T;
    } catch (error: unknown) {
        const err = error as ApiError;

        // If it's already an error with a status, just re-throw it
        if (err.status !== undefined) throw err;

        // Create a proper error object that stringifies well
        const connectionError = new Error(err.message || "Failed to connect to the backend API.") as ApiError;
        connectionError.status = 0;
        connectionError.originalError = error;

        throw connectionError;
    }
}
