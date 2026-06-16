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
 * Media học thử được mở công khai; media khóa học đầy đủ vẫn cần token/quyền truy cập.
 */
export async function getMediaUrl(mediaId: string, options?: { download?: boolean }): Promise<MediaUrl> {
  const res = await api.get<ApiResponse<MediaUrl>>(`/api/media/${mediaId}/url`, {
    params: options?.download ? { download: true } : undefined,
  });
  return res.data.data;
}
