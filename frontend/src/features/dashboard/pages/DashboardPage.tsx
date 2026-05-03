import { Link } from "react-router-dom";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, AlertTriangle, CheckCircle, ClipboardList, Download, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useComplaintListQuery } from "@/features/complaint/api/complaintQueries";
import { useDashboardQuery, useUnitReportsQuery } from "@/features/dashboard/api/dashboardQueries";
import { setDateRange } from "@/features/dashboard/store/dashboardFiltersSlice";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingState } from "@/shared/components/LoadingState";
import { MetricCard } from "@/shared/components/MetricCard";
import { SectionCard } from "@/shared/components/SectionCard";
import { formatPercent } from "@/shared/utils/format";

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.dashboardFilters);
  const dashboardQuery = useDashboardQuery(filters.startDate, filters.endDate);
  const unitReportsQuery = useUnitReportsQuery(filters.startDate, filters.endDate);
  const complaintsQuery = useComplaintListQuery();

  if (dashboardQuery.isLoading || unitReportsQuery.isLoading || complaintsQuery.isLoading) {
    return <LoadingState title="Dashboard verileri yükleniyor..." variant="dashboard" />;
  }

  const dashboard = dashboardQuery.data;
  const unitReports = unitReportsQuery.data ?? [];
  const complaints = complaintsQuery.data ?? [];
  const recentComplaints = complaints.slice(0, 5);
  const criticalComplaints = complaints.filter((complaint) => complaint.durum !== "Kapandi").slice(0, 3);
  const hasUnitData = unitReports.length > 0;

  return (
    <div className="space-y-4">
      <SectionCard
        title="Filtreler"
        subtitle="Tarih aralığı dashboard, raporlar ve birim analizlerinde ortak kullanılır."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/anketler/yeni" className="action-button-primary !rounded-xl !px-4 !py-2.5">
              <Plus size={17} className="mr-2" />
              Yeni Anket
            </Link>
            <button type="button" className="action-button-secondary !rounded-xl !px-4 !py-2.5" onClick={() => window.print()}>
              <Download size={17} className="mr-2" />
              Rapor İndir
            </button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slateglass/75 dark:text-slate-300">Başlangıç Tarihi</span>
            <input
              type="date"
              className="glass-input"
              value={filters.startDate}
              onChange={(event) => dispatch(setDateRange({ ...filters, startDate: event.target.value }))}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slateglass/75 dark:text-slate-300">Bitiş Tarihi</span>
            <input
              type="date"
              className="glass-input"
              value={filters.endDate}
              onChange={(event) => dispatch(setDateRange({ ...filters, endDate: event.target.value }))}
            />
          </label>
          <button
            type="button"
            className="action-button-secondary mt-2 self-end !rounded-xl md:mt-0"
            onClick={() =>
              dispatch(
                setDateRange({
                  startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
                  endDate: new Date().toISOString().slice(0, 10)
                })
              )
            }
          >
            Son 30 Gün
          </button>
        </div>
      </SectionCard>

      {criticalComplaints.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-amber-950 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className="font-display text-lg font-bold">Kritik Bildirim</div>
                <p className="mt-1 text-sm leading-6">Açık durumda düşük puanlı {criticalComplaints.length} geri bildirim var. Öncelikli inceleme önerilir.</p>
              </div>
            </div>
            <Link to="/sikayetler" className="action-button-secondary !rounded-xl !bg-white/90 !px-4 !py-2.5">
              Şikayetleri Aç
            </Link>
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Genel Ortalama" value={Math.round(dashboard?.genelMemnuniyetOrtalamasi ?? 0)} hint="Canlı memnuniyet puanı" icon={<Activity size={20} />} />
        <MetricCard
          label="Toplam Cevaplanan Anket"
          value={dashboard?.toplamCevaplananAnket ?? 0}
          hint="Tamamlanan oturum sayısı"
          accent="from-brand-600 to-mint"
          icon={<CheckCircle size={20} />}
        />
        <MetricCard
          label="Toplam Şikayet"
          value={dashboard?.toplamSikayetSayisi ?? 0}
          hint="Düşük puan nedeniyle oluşan kayıtlar"
          accent="from-amber-500 to-rose-400"
          icon={<AlertTriangle size={20} />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Birim Bazlı Dağılım"
          subtitle="Birim performansını etkileşimli grafikle takip edin."
          actions={
            <Link to="/birim-raporu" className="action-button-secondary !rounded-xl">
              Detaylı Rapor
            </Link>
          }
        >
          {hasUnitData ? (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unitReports}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d8f6fb" />
                  <XAxis dataKey="birimAdi" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ortalamaPuan" fill="#1aa9cd" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="Henüz veri girişi yapılmamış" description="Birim bazlı grafik, cevaplanan anketler oluştuğunda burada görünecek." icon={<ClipboardList size={22} />} />
          )}
        </SectionCard>

        <SectionCard title="Düşük Puanlı Oturumlar" subtitle="Son düşük puan kayıtları ve aksiyon durumu.">
          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-3 custom-scrollbar">
            {recentComplaints.length === 0 ? (
              <EmptyState title="Henüz düşük puan yok" description="Kritik takip gerektiren geri bildirim geldiğinde burada listelenecek." icon={<AlertTriangle size={22} />} />
            ) : (
              recentComplaints.map((complaint) => (
                <div key={complaint.sikayetId} className="rounded-xl border border-amber-100 bg-white/80 p-4 transition-all duration-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-night dark:text-white">Oturum #{complaint.oturumId}</div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">{complaint.durum}</span>
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slateglass/70 dark:text-slate-300">{complaint.aciklama}</div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Departman Bazlı Kıyaslama" subtitle="Birimlerin memnuniyet oranları hızlı karşılaştırma için özetlenir.">
        {hasUnitData ? (
          <div className="max-h-[360px] space-y-4 overflow-y-auto pr-3 custom-scrollbar">
            {unitReports.map((item) => (
              <div key={item.birimAdi}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slateglass/75 dark:text-slate-300">{item.birimAdi}</span>
                  <span className="font-semibold text-brand-700 dark:text-mint">{formatPercent(item.ortalamaPuan)}</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-brand-50 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-mint to-brand-400" style={{ width: `${Math.max(item.ortalamaPuan, 8)}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Henüz veri girişi yapılmamış" description="Departman kıyaslaması için en az bir tamamlanmış anket gerekiyor." />
        )}
      </SectionCard>
    </div>
  );
}
