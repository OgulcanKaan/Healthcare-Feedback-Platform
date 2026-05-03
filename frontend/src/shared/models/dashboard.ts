import type { ApiRecord } from "@/shared/models/common";
import { pickDefined } from "@/shared/utils/model";

export interface DashboardSummary {
  genelMemnuniyetOrtalamasi: number;
  toplamCevaplananAnket: number;
  toplamSikayetSayisi: number;
}

export interface UnitReportItem {
  birimAdi: string;
  ortalamaPuan: number;
  toplamAnketSayisi: number;
}

export interface ComplaintRecord {
  sikayetId: number;
  oturumId: number;
  tip: string;
  gonderenAd?: string | null;
  aciklama: string;
  durum: string;
  olusturmaTarihi: string;
}

export function toDashboardSummary(raw: ApiRecord): DashboardSummary {
  return {
    genelMemnuniyetOrtalamasi: Number(pickDefined(raw, "genelMemnuniyetOrtalamasi", "GenelMemnuniyetOrtalamasi") ?? 0),
    toplamCevaplananAnket: Number(pickDefined(raw, "toplamCevaplananAnket", "ToplamCevaplananAnket") ?? 0),
    toplamSikayetSayisi: Number(pickDefined(raw, "toplamSikayetSayisi", "ToplamSikayetSayisi") ?? 0)
  };
}

export function toUnitReportItem(raw: ApiRecord): UnitReportItem {
  return {
    birimAdi: String(pickDefined(raw, "birimAdi", "BirimAdi") ?? ""),
    ortalamaPuan: Number(pickDefined(raw, "ortalamaPuan", "OrtalamaPuan") ?? 0),
    toplamAnketSayisi: Number(pickDefined(raw, "toplamAnketSayisi", "ToplamAnketSayisi") ?? 0)
  };
}

export function toComplaintRecord(raw: ApiRecord): ComplaintRecord {
  return {
    sikayetId: Number(pickDefined(raw, "sikayetId", "SikayetId") ?? 0),
    oturumId: Number(pickDefined(raw, "oturumId", "OturumId") ?? 0),
    tip: String(pickDefined(raw, "tip", "Tip") ?? "Otomatik"),
    gonderenAd: (pickDefined(raw, "gonderenAd", "GonderenAd") as string | null | undefined) ?? null,
    aciklama: String(pickDefined(raw, "aciklama", "Aciklama") ?? ""),
    durum: String(pickDefined(raw, "durum", "Durum") ?? ""),
    olusturmaTarihi: String(pickDefined(raw, "olusturmaTarihi", "OlusturmaTarihi") ?? "")
  };
}
