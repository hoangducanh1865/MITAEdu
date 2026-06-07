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
export async function getMediaUrl(mediaId: string): Promise<MediaUrl> {
  const res = await api.get<ApiResponse<MediaUrl>>(`/api/media/${mediaId}/url`);
  return res.data.data;
}
