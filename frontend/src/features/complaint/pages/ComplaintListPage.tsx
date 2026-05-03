import { AlertTriangle, Lightbulb, MessageSquareWarning, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useComplaintListQuery } from "@/features/complaint/api/complaintQueries";
import { useOneriSikayetListQuery, useUpdateDurumCommand } from "@/features/complaint/api/oneriSikayetApi";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingState } from "@/shared/components/LoadingState";
import { SectionCard } from "@/shared/components/SectionCard";
import { StatusPill } from "@/shared/components/StatusPill";
import { formatDateTime } from "@/shared/utils/format";

const durumRengi: Record<string, string> = {
  Acik: "border-red-200 bg-red-50/60",
  Inceleniyor: "border-amber-200 bg-amber-50/60",
  Kapandi: "border-green-200 bg-green-50/60"
};

const tipConfig = {
  Otomatik: { label: "Otomatik Şikayet", icon: AlertTriangle, color: "text-red-600 bg-red-50 border-red-200" },
  Sikayet: { label: "Manuel Şikayet", icon: MessageSquareWarning, color: "text-orange-600 bg-orange-50 border-orange-200" },
  Oneri: { label: "Öneri", icon: Lightbulb, color: "text-brand-700 bg-brand-50 border-brand-200" }
};

export function ComplaintListPage() {
  const [aktifTab, setAktifTab] = useState<"otomatik" | "manuel">("otomatik");
  const [tipFilter, setTipFilter] = useState<"hepsi" | "Sikayet" | "Oneri">("hepsi");
  const updateDurum = useUpdateDurumCommand();

  // Otomatik şikayetler (düşük puan)
  const otomatikQuery = useComplaintListQuery();

  // Manuel öneri ve şikayetler
  const manuelQuery = useOneriSikayetListQuery(tipFilter === "hepsi" ? undefined : tipFilter);

  const isLoading = aktifTab === "otomatik" ? otomatikQuery.isLoading : manuelQuery.isLoading;
  if (isLoading) {
    return <LoadingState title="Kayıtlar yükleniyor..." />;
  }

  const otomatikData = otomatikQuery.data ?? [];
  const manuelData = manuelQuery.data ?? [];

  return (
    <div className="space-y-4">
      {/* Tab seçimi */}
      <div className="glass-panel flex flex-col sm:flex-row gap-2 p-3">
        <button
          type="button"
          onClick={() => setAktifTab("otomatik")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition ${
            aktifTab === "otomatik"
              ? "bg-gradient-to-r from-brand-500 to-brand-300 text-white shadow-soft"
              : "bg-white/55 hover:bg-white/85"
          }`}
        >
          <AlertTriangle size={16} />
          Otomatik Şikayetler
          {otomatikData.length > 0 && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-black ${aktifTab === "otomatik" ? "bg-white/30 text-white" : "bg-red-100 text-red-700"}`}>
              {otomatikData.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setAktifTab("manuel")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition ${
            aktifTab === "manuel"
              ? "bg-gradient-to-r from-brand-500 to-brand-300 text-white shadow-soft"
              : "bg-white/55 hover:bg-white/85"
          }`}
        >
          <Lightbulb size={16} />
          Öneri & Şikayetler
          {manuelData.length > 0 && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-black ${aktifTab === "manuel" ? "bg-white/30 text-white" : "bg-brand-100 text-brand-700"}`}>
              {manuelData.length}
            </span>
          )}
        </button>
      </div>

      {/* Otomatik Şikayetler */}
      {aktifTab === "otomatik" && (
        <SectionCard
          title="Otomatik Şikayetler"
          subtitle="Anket puanı eşik değerinin altında kalan oturumlar için sistem tarafından otomatik oluşturulan kayıtlar."
        >
          {otomatikData.length === 0 ? (
            <EmptyState title="Otomatik şikayet yok" description="Henüz düşük puanlı bir oturum kaydedilmedi." />
          ) : (
            <div className="max-h-[360px] overflow-y-auto custom-scrollbar pr-3">
              <div className="grid gap-4 md:grid-cols-2">
                {otomatikData.map((item) => (
                  <article
                    key={item.sikayetId}
                    className={`rounded-[28px] border p-5 ${durumRengi[item.durum] ?? "border-brand-100 bg-white/80"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="shrink-0 text-red-500" />
                        <div className="font-display text-lg font-bold text-night">Şikayet #{item.sikayetId}</div>
                      </div>
                      <StatusPill value={item.durum} tone={item.durum === "Kapandi" ? "success" : "warning"} />
                    </div>
                    <div className="mt-3 text-sm text-slateglass/70">Oturum No: #{item.oturumId}</div>
                    <div className="mt-3 rounded-2xl bg-white/70 p-3 text-sm text-slateglass">{item.aciklama}</div>
                    <div className="mt-3 text-xs uppercase tracking-[0.2em] text-slateglass/50">
                      {formatDateTime(item.olusturmaTarihi)}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Manuel Öneri & Şikayetler */}
      {aktifTab === "manuel" && (
        <SectionCard
          title="Öneri & Şikayetler"
          subtitle="Hastalar ve ziyaretçiler tarafından anket sonrasında manuel olarak iletilen kayıtlar."
          actions={
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              {(["hepsi", "Sikayet", "Oneri"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipFilter(t)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    tipFilter === t
                      ? "bg-brand-500 text-white"
                      : "border border-brand-100 bg-white/80 text-slateglass hover:bg-white"
                  }`}
                >
                  {t === "hepsi" ? "Tümü" : t === "Sikayet" ? "Şikayetler" : "Öneriler"}
                </button>
              ))}
            </div>
          }
        >
          {manuelData.length === 0 ? (
            <EmptyState title="Kayıt bulunamadı" description="Bu kategoride henüz gönderim yok." />
          ) : (
            <div className="max-h-[360px] overflow-y-auto custom-scrollbar pr-3">
              <div className="grid gap-4 md:grid-cols-2">
                {manuelData.map((item) => {
                  const cfg = tipConfig[item.tip as keyof typeof tipConfig] ?? tipConfig.Sikayet;
                  const Icon = cfg.icon;
                  return (
                    <article
                      key={item.sikayetId}
                      className={`rounded-[28px] border p-5 ${durumRengi[item.durum] ?? "border-brand-100 bg-white/80"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.color}`}>
                            <Icon size={13} />
                            {cfg.label}
                          </span>
                        </div>
                        <StatusPill value={item.durum} tone={item.durum === "Kapandi" ? "success" : "warning"} />
                      </div>

                      {item.gonderenAd && (
                        <div className="mt-3 text-sm font-semibold text-night">{item.gonderenAd}</div>
                      )}

                      <div className="mt-3 rounded-2xl bg-white/70 p-3 text-sm text-slateglass">{item.aciklama}</div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="text-xs uppercase tracking-[0.2em] text-slateglass/50">
                          {formatDateTime(item.olusturmaTarihi)}
                        </div>
                        {/* Durum güncelleme */}
                        {item.durum !== "Kapandi" && (
                          <button
                            type="button"
                            disabled={updateDurum.isPending}
                            onClick={() => updateDurum.mutate({
                              id: item.sikayetId,
                              durum: item.durum === "Acik" ? "Inceleniyor" : "Kapandi"
                            })}
                            className="flex items-center gap-1.5 rounded-full border border-brand-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slateglass transition hover:bg-white disabled:opacity-50"
                          >
                            <RefreshCw size={12} />
                            {item.durum === "Acik" ? "İncele" : "Kapat"}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
}
