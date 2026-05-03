import type { ApiRecord } from "@/shared/models/common";
import type { QuestionType, UnitRecord } from "@/shared/models/admin";
import { asArray, pickDefined } from "@/shared/utils/model";

export interface SurveySummary {
  id: number;
  anketAdi: string;
  durum: string;
  baslangicTarihi: string;
  bitisTarihi?: string | null;
  karsilamaMesaji: string;
  tesekkurMesaji: string;
  olusturanKullaniciId: number;
}

export interface SurveyOption {
  id: number;
  soruId: number;
  secenekMetni: string;
  puanDegeri: number;
}

export interface SurveyQuestion {
  soruId: number;
  siraNo: number;
  soruTipi: QuestionType;
  soruMetni: string;
  zorunluMu: boolean;
  kategori: string;
  secenekler: SurveyOption[];
}

export interface SurveyDetail extends SurveySummary {
  sorular: SurveyQuestion[];
}

export interface SurveyFormValues {
  anketAdi: string;
  durum: string;
  baslangicTarihi: string;
  bitisTarihi: string;
  karsilamaMesaji: string;
  tesekkurMesaji: string;
  olusturanKullaniciId: number;
}

export interface SessionStartCommand {
  anketId: number;
  hastaId?: number | null;
  birimId: number;
  randevuId?: number | null;
  kanal: string;
  kvkkOnayDurumu: boolean;
  ipAdresi?: string;
  cihazBilgisi?: string;
}

export interface AnswerSubmission {
  soruId: number;
  secenekId?: number | null;
  acikCevap?: string | null;
}

export interface SubmitSurveyCommand {
  anketId: number;
  hastaId?: number | null;
  kvkkOnayDurumu: boolean;
  cevaplar: AnswerSubmission[];
}

export interface SessionStartResult {
  oturumId: number;
  baslamaZamani: string;
  durum: string;
}

export interface SurveyResult {
  oturumId: number;
  durum: string;
  toplamPuan: number;
  ortalamaPuan: number;
  kvkkOnayDurumu: boolean;
  birimId: number;
  hastaId?: number | null;
  randevuId?: number | null;
}

export function toSurveySummary(raw: ApiRecord): SurveySummary {
  return {
    id: Number(pickDefined(raw, "id", "Id") ?? 0),
    anketAdi: String(pickDefined(raw, "anketAdi", "AnketAdi") ?? ""),
    durum: String(pickDefined(raw, "durum", "Durum") ?? ""),
    baslangicTarihi: String(pickDefined(raw, "baslangicTarihi", "BaslangicTarihi") ?? ""),
    bitisTarihi: String(pickDefined(raw, "bitisTarihi", "BitisTarihi") ?? ""),
    karsilamaMesaji: String(pickDefined(raw, "karsilamaMesaji", "KarsilamaMesaji") ?? ""),
    tesekkurMesaji: String(pickDefined(raw, "tesekkurMesaji", "TesekkurMesaji") ?? ""),
    olusturanKullaniciId: Number(pickDefined(raw, "olusturanKullaniciId", "OlusturanKullaniciId") ?? 0)
  };
}

export function toSurveyOption(raw: ApiRecord): SurveyOption {
  return {
    id: Number(pickDefined(raw, "id", "Id") ?? 0),
    soruId: Number(pickDefined(raw, "soruId", "SoruId") ?? 0),
    secenekMetni: String(pickDefined(raw, "secenekMetni", "SecenekMetni") ?? ""),
    puanDegeri: Number(pickDefined(raw, "puanDegeri", "PuanDegeri") ?? 0)
  };
}

export function toSurveyQuestion(raw: ApiRecord): SurveyQuestion {
  return {
    soruId: Number(pickDefined(raw, "soruId", "SoruId") ?? 0),
    siraNo: Number(pickDefined(raw, "siraNo", "SiraNo") ?? 0),
    soruTipi: String(pickDefined(raw, "soruTipi", "SoruTipi") ?? "CoktanSecmeli") as QuestionType,
    soruMetni: String(pickDefined(raw, "soruMetni", "SoruMetni") ?? ""),
    zorunluMu: Boolean(pickDefined(raw, "zorunluMu", "ZorunluMu") ?? false),
    kategori: String(pickDefined(raw, "kategori", "Kategori") ?? ""),
    secenekler: asArray<ApiRecord>(pickDefined(raw, "secenekler", "Secenekler")).map(toSurveyOption)
  };
}

export function toSurveyDetail(raw: ApiRecord): SurveyDetail {
  return {
    ...toSurveySummary(raw),
    sorular: asArray<ApiRecord>(pickDefined(raw, "sorular", "Sorular")).map(toSurveyQuestion)
  };
}

export function toSurveyFormValues(survey?: SurveySummary | SurveyDetail | null): SurveyFormValues {
  return {
    anketAdi: survey?.anketAdi ?? "",
    durum: survey?.durum ?? "Aktif",
    baslangicTarihi: survey?.baslangicTarihi ?? new Date().toISOString(),
    bitisTarihi: survey?.bitisTarihi ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    karsilamaMesaji: survey?.karsilamaMesaji ?? "Hoş geldiniz",
    tesekkurMesaji: survey?.tesekkurMesaji ?? "Katılımınız için teşekkür ederiz.",
    olusturanKullaniciId: survey?.olusturanKullaniciId ?? 1
  };
}

export function toSessionStartResult(raw: ApiRecord): SessionStartResult {
  return {
    oturumId: Number(pickDefined(raw, "oturumId", "OturumId") ?? 0),
    baslamaZamani: String(pickDefined(raw, "baslamaZamani", "BaslamaZamani") ?? ""),
    durum: String(pickDefined(raw, "durum", "Durum") ?? "")
  };
}

export function toSurveyResult(raw: ApiRecord): SurveyResult {
  return {
    oturumId: Number(pickDefined(raw, "oturumId", "OturumId") ?? 0),
    durum: String(pickDefined(raw, "durum", "Durum") ?? ""),
    toplamPuan: Number(pickDefined(raw, "toplamPuan", "ToplamPuan") ?? 0),
    ortalamaPuan: Number(pickDefined(raw, "ortalamaPuan", "OrtalamaPuan") ?? 0),
    kvkkOnayDurumu: Boolean(pickDefined(raw, "kvkkOnayDurumu", "KvkkOnayDurumu") ?? false),
    birimId: Number(pickDefined(raw, "birimId", "BirimId") ?? 0),
    hastaId: Number(pickDefined(raw, "hastaId", "HastaId") ?? 0),
    randevuId: Number(pickDefined(raw, "randevuId", "RandevuId") ?? 0)
  };
}

export interface SurveyFlowState {
  units: UnitRecord[];
  survey: SurveyDetail;
}
