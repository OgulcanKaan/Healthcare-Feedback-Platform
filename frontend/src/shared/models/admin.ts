import type { ApiRecord } from "@/shared/models/common";
import { asArray, pickDefined } from "@/shared/utils/model";

export interface UnitRecord {
  id: number;
  birimKodu: string;
  birimAdi: string;
  aktifPasif: boolean;
}

export interface UserRecord {
  id: number;
  kullaniciAdi: string;
  adSoyad: string;
  birimId: number;
  birimAdi: string;
  rolId: number;
  rolAdi: string;
  aktifPasif: boolean;
  sonGirisTarihi?: string | null;
}

export interface RoleRecord {
  id: number;
  rolAdi: string;
  aktifPasif: boolean;
}

export type QuestionType = "Likert" | "YesNo" | "MultipleChoice" | "OpenText" | "CoktanSecmeli";

export interface AnswerOptionRecord {
  id: number;
  soruId: number;
  secenekMetni: string;
  puanDegeri: number;
}

export interface QuestionBankRecord {
  id: number;
  soruTipi: QuestionType;
  soruMetni: string;
  zorunluMu: boolean;
  kategori: string;
  secenekler: AnswerOptionRecord[];
}

export interface UserLogRecord {
  id: number;
  kullaniciId: number;
  kullaniciAdi: string;
  islemZamani: string;
  ipAdresi: string;
  browserBilgisi: string;
  basariDurumu: boolean;
  hataBilgisi: string;
}

export function toUnitRecord(raw: ApiRecord): UnitRecord {
  return {
    id: Number(pickDefined(raw, "id", "Id") ?? 0),
    birimKodu: String(pickDefined(raw, "birimKodu", "BirimKodu") ?? ""),
    birimAdi: String(pickDefined(raw, "birimAdi", "BirimAdi") ?? ""),
    aktifPasif: Boolean(pickDefined(raw, "aktifPasif", "AktifPasif") ?? false)
  };
}

export function toUserRecord(raw: ApiRecord): UserRecord {
  return {
    id: Number(pickDefined(raw, "id", "Id") ?? 0),
    kullaniciAdi: String(pickDefined(raw, "kullaniciAdi", "KullaniciAdi") ?? ""),
    adSoyad: String(pickDefined(raw, "adSoyad", "AdSoyad") ?? ""),
    birimId: Number(pickDefined(raw, "birimId", "BirimId") ?? 0),
    birimAdi: String(pickDefined(raw, "birimAdi", "BirimAdi") ?? ""),
    rolId: Number(pickDefined(raw, "rolId", "RolId") ?? 0),
    rolAdi: String(pickDefined(raw, "rolAdi", "RolAdi") ?? ""),
    aktifPasif: Boolean(pickDefined(raw, "aktifPasif", "AktifPasif") ?? false),
    sonGirisTarihi: String(pickDefined(raw, "sonGirisTarihi", "SonGirisTarihi") ?? "")
  };
}

export function toRoleRecord(raw: ApiRecord): RoleRecord {
  return {
    id: Number(pickDefined(raw, "id", "Id") ?? 0),
    rolAdi: String(pickDefined(raw, "rolAdi", "RolAdi") ?? ""),
    aktifPasif: Boolean(pickDefined(raw, "aktifPasif", "AktifPasif") ?? false)
  };
}

export function toAnswerOptionRecord(raw: ApiRecord): AnswerOptionRecord {
  return {
    id: Number(pickDefined(raw, "id", "Id") ?? 0),
    soruId: Number(pickDefined(raw, "soruId", "SoruId") ?? 0),
    secenekMetni: String(pickDefined(raw, "secenekMetni", "SecenekMetni") ?? ""),
    puanDegeri: Number(pickDefined(raw, "puanDegeri", "PuanDegeri") ?? 0)
  };
}

export function toQuestionBankRecord(raw: ApiRecord): QuestionBankRecord {
  return {
    id: Number(pickDefined(raw, "id", "Id") ?? 0),
    soruTipi: String(pickDefined(raw, "soruTipi", "SoruTipi") ?? "CoktanSecmeli") as QuestionType,
    soruMetni: String(pickDefined(raw, "soruMetni", "SoruMetni") ?? ""),
    zorunluMu: Boolean(pickDefined(raw, "zorunluMu", "ZorunluMu") ?? false),
    kategori: String(pickDefined(raw, "kategori", "Kategori") ?? ""),
    secenekler: asArray<ApiRecord>(pickDefined(raw, "secenekler", "Secenekler")).map(toAnswerOptionRecord)
  };
}

export function toUserLogRecord(raw: ApiRecord): UserLogRecord {
  return {
    id: Number(pickDefined(raw, "id", "Id") ?? 0),
    kullaniciId: Number(pickDefined(raw, "kullaniciId", "KullaniciId") ?? 0),
    kullaniciAdi: String(pickDefined(raw, "kullaniciAdi", "KullaniciAdi") ?? ""),
    islemZamani: String(pickDefined(raw, "islemZamani", "IslemZamani") ?? ""),
    ipAdresi: String(pickDefined(raw, "ipAdresi", "IpAdresi") ?? "-"),
    browserBilgisi: String(pickDefined(raw, "browserBilgisi", "BrowserBilgisi") ?? "-"),
    basariDurumu: Boolean(pickDefined(raw, "basariDurumu", "BasariDurumu") ?? false),
    hataBilgisi: String(pickDefined(raw, "hataBilgisi", "HataBilgisi") ?? "")
  };
}
