import api from "./api";
import type { ApiResponse } from "@/types";

export interface MediaUrl {
  url: string;
  contentType?: string;
  title?: string;
  expiresInSeconds: number;
}

/**
 * Lấy presigned URL ngắn hạn cho một media (video/PDF) từ backend.
 * Endpoint yêu cầu đăng nhập - token được api interceptor tự gắn vào.
 */
export async function getMediaUrl(mediaId: string, options?: { download?: boolean }): Promise<MediaUrl> {
  const res = await api.get<ApiResponse<MediaUrl>>(`/api/media/${mediaId}/url`, {
    params: options?.download ? { download: true } : undefined,
  });
  return res.data.data;
}
