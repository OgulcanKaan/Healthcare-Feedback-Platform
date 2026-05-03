import { Link } from "react-router-dom";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, CheckCircle, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useComplaintListQuery } from "@/features/complaint/api/complaintQueries";
import { useDashboardQuery, useUnitReportsQuery } from "@/features/dashboard/api/dashboardQueries";
import { setDateRange } from "@/features/dashboard/store/dashboardFiltersSlice";
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
    return <LoadingState title="Dashboard verileri yukleniyor..." />;
  }

  const dashboard = dashboardQuery.data;
  const unitReports = unitReportsQuery.data ?? [];
  const complaints = complaintsQuery.data?.slice(0, 5) ?? [];

  return (
    <div className="space-y-4">
      <SectionCard
        title="Filtreler"
        subtitle="Redux Toolkit ile paylaşılan tarih aralığı hem dashboard hem rapor sayfalarında ortak kullanılır."
      >
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slateglass/75">Başlangıç Tarihi</span>
            <input
              type="date"
              className="glass-input"
              value={filters.startDate}
              onChange={(event) => dispatch(setDateRange({ ...filters, startDate: event.target.value }))}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slateglass/75">Bitiş Tarihi</span>
            <input
              type="date"
              className="glass-input"
              value={filters.endDate}
              onChange={(event) => dispatch(setDateRange({ ...filters, endDate: event.target.value }))}
            />
          </label>
          <button
            type="button"
            className="action-button-secondary self-end"
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

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard 
          label="Genel Ortalama" 
          value={Math.round(dashboard?.genelMemnuniyetOrtalamasi ?? 0)} 
          hint="Canli memnuniyet puani" 
          icon={<Activity size={20} />} 
        />
        <MetricCard
          label="Toplam Cevaplanan Anket"
          value={dashboard?.toplamCevaplananAnket ?? 0}
          hint="Tamamlanan oturum sayisi"
          accent="from-brand-600 to-mint"
          icon={<CheckCircle size={20} />}
        />
        <MetricCard
          label="Toplam Sikayet"
          value={dashboard?.toplamSikayetSayisi ?? 0}
          hint="Dusuk puan nedeniyle olusan kayitlar"
          accent="from-night to-brand-500"
          icon={<AlertTriangle size={20} />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Birim Bazli Dagilim"
          subtitle="Recharts ile cache destekli query katmanından beslenen birim performans grafiği."
          actions={
            <Link to="/birim-raporu" className="action-button-secondary">
              Detaylı Rapor
            </Link>
          }
        >
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
        </SectionCard>

        <SectionCard title="Dusuk Puanli Oturumlar" subtitle="Complaint feature query katmanından son kayıtlar.">
          <div className="space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar pr-3">
            {complaints.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-brand-200 bg-white/50 p-6 text-center text-sm text-slateglass/60">
                Henüz veri bulunamadı.
              </div>
            ) : (
              complaints.map((complaint) => (
                <div key={complaint.sikayetId} className="rounded-[24px] border border-brand-100 bg-white/80 p-4 transition-all duration-300 hover:shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-night">Oturum #{complaint.oturumId}</div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{complaint.durum}</span>
                  </div>
                  <div className="mt-2 text-sm text-slateglass/70">{complaint.aciklama}</div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Hizli Ozet" subtitle="Referans dashboard görselindeki sade yatay listedeki his korunur.">
        <div className="space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar pr-3">
          {unitReports.map((item) => (
            <div key={item.birimAdi}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="italic text-slateglass/75">{item.birimAdi}</span>
                <span className="font-semibold text-brand-700">{formatPercent(item.ortalamaPuan)}</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-brand-50">
                <div className="h-full rounded-full bg-gradient-to-r from-mint to-brand-400" style={{ width: `${Math.max(item.ortalamaPuan, 8)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
