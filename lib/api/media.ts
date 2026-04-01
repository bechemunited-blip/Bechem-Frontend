const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface MediaFile {
    id: string;
    url: string;
    format: string;
    resourceType: string;
    size: number;
}

export interface MediaUploadResponse {
    success: boolean;
    file: MediaFile;
}

export interface MediaDeleteResponse {
    success: boolean;
    message: string;
}

export interface MediaInfoResponse {
    success: boolean;
    file: {
        id: string;
        url: string;
        format: string;
        resourceType: string;
        size: number;
        width?: number;
        height?: number;
        createdAt?: string;
    };
}

/**
 * Upload a file to Cloudinary via the backend media service.
 * Uses multipart/form-data (NOT base64 in JSON).
 */
export async function uploadMedia(
    file: File,
    params: {
        type?: "image" | "video" | "document" | "audio";
        entityType: string;
        category: string;
        subcategory?: string;
        public_id?: string;
    },
    token: string
): Promise<MediaUploadResponse> {
    const formData = new FormData();

    // Text fields MUST come before the file field (backend requirement)
    formData.append("type", params.type || "image");
    formData.append("entityType", params.entityType);
    formData.append("category", params.category);
    if (params.subcategory) formData.append("subcategory", params.subcategory);
    if (params.public_id) formData.append("public_id", params.public_id);

    // File field must be named "file"
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/media/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            // Do NOT set Content-Type — browser sets it with boundary automatically
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Upload failed (${response.status})`);
    }

    // Moleculer's multipart handler wraps the service response in an array
    // (one entry per uploaded file). Unwrap it to get the actual response.
    // Backend service returns: { success: true, file: { id, url, format, ... } }
    // Gateway returns: [{ success: true, file: { id, url, format, ... } }]
    const result = Array.isArray(data) ? data[0] : data;

    if (!result?.file?.url) {
        console.error("[Media Upload] Unexpected response shape:", result);
        throw new Error("Upload succeeded but no file URL returned");
    }

    return result as MediaUploadResponse;
}

/**
 * Delete a file from Cloudinary.
 */
export async function deleteMedia(
    publicId: string,
    token: string,
    resourceType: "image" | "video" | "raw" = "image"
): Promise<MediaDeleteResponse> {
    const response = await fetch(`${BASE_URL}/media/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ publicId, resourceType }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Delete failed");
    }

    return data;
}

/**
 * Get file info from Cloudinary.
 */
export async function getMediaInfo(
    publicId: string,
    token: string,
    resourceType: string = "image"
): Promise<MediaInfoResponse> {
    const response = await fetch(`${BASE_URL}/media/info`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ publicId, resourceType }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to get file info");
    }

    return data;
}
