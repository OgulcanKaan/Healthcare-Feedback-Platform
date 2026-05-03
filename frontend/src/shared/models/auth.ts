import type { ApiRecord } from "@/shared/models/common";
import { pickDefined } from "@/shared/utils/model";

export interface AuthUser {
  id: number;
  kullaniciAdi: string;
  adSoyad: string;
  rol: string;
}

export interface LoginCommand {
  kullaniciAdi: string;
  sifre: string;
}

export interface LoginResponse {
  token: string;
  kullanici: AuthUser;
}

export function toAuthUser(raw: ApiRecord): AuthUser {
  return {
    id: Number(pickDefined(raw, "id", "Id") ?? 0),
    kullaniciAdi: String(pickDefined(raw, "kullaniciAdi", "KullaniciAdi") ?? ""),
    adSoyad: String(pickDefined(raw, "adSoyad", "AdSoyad") ?? ""),
    rol: String(pickDefined(raw, "rol", "Rol") ?? "Yonetici")
  };
}

export function toLoginResponse(raw: unknown): LoginResponse {
  const payload = raw as ApiRecord;
  return {
    token: String(pickDefined(payload, "token", "Token") ?? ""),
    kullanici: toAuthUser((pickDefined(payload, "kullanici", "Kullanici") ?? {}) as ApiRecord)
  };
}
