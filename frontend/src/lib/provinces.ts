export const DEFAULT_PROVINCE = "TP. Hồ Chí Minh";

export const PROVINCES = [
  "TP. Hà Nội",
  "TP. Huế",
  "Tỉnh Lai Châu",
  "Tỉnh Điện Biên",
  "Tỉnh Sơn La",
  "Tỉnh Lạng Sơn",
  "Tỉnh Quảng Ninh",
  "Tỉnh Thanh Hóa",
  "Tỉnh Nghệ An",
  "Tỉnh Hà Tĩnh",
  "Tỉnh Cao Bằng",
  "Tỉnh Tuyên Quang",
  "Tỉnh Lào Cai",
  "Tỉnh Thái Nguyên",
  "Tỉnh Phú Thọ",
  "Tỉnh Bắc Ninh",
  "Tỉnh Hưng Yên",
  "TP. Hải Phòng",
  "Tỉnh Ninh Bình",
  "Tỉnh Quảng Trị",
  "TP. Đà Nẵng",
  "Tỉnh Quảng Ngãi",
  "Tỉnh Gia Lai",
  "Tỉnh Khánh Hòa",
  "Tỉnh Lâm Đồng",
  "Tỉnh Đắk Lắk",
  "TP. Hồ Chí Minh",
  "Tỉnh Đồng Nai",
  "Tỉnh Tây Ninh",
  "TP. Cần Thơ",
  "Tỉnh Vĩnh Long",
  "Tỉnh Đồng Tháp",
  "Tỉnh Cà Mau",
  "Tỉnh An Giang",
] as const;

export function normalizeProvince(value?: string | null) {
  if (!value) return DEFAULT_PROVINCE;
  if (value === "TP. HCM" || value === "TP.HCM") return DEFAULT_PROVINCE;
  return PROVINCES.includes(value as (typeof PROVINCES)[number]) ? value : DEFAULT_PROVINCE;
}
