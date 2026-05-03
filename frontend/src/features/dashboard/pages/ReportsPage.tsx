import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { useAppSelector } from "@/app/store/hooks";
import { useComplaintListQuery } from "@/features/complaint/api/complaintQueries";
import { useDashboardQuery, useUnitReportsQuery } from "@/features/dashboard/api/dashboardQueries";
import { LoadingState } from "@/shared/components/LoadingState";
import { SectionCard } from "@/shared/components/SectionCard";

const colors = ["#1aa9cd", "#5dd6c8", "#175b72", "#79dcef"];

export function ReportsPage() {
  const filters = useAppSelector((state) => state.dashboardFilters);
  const dashboardQuery = useDashboardQuery(filters.startDate, filters.endDate);
  const unitReportsQuery = useUnitReportsQuery(filters.startDate, filters.endDate);
  const complaintsQuery = useComplaintListQuery();

  if (dashboardQuery.isLoading || unitReportsQuery.isLoading || complaintsQuery.isLoading) {
    return <LoadingState title="Raporlar yükleniyor..." />;
  }

  const complaintStatusData = (complaintsQuery.data ?? []).reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.durum] = (accumulator[item.durum] ?? 0) + 1;
    return accumulator;
  }, {});

  const pieData = Object.entries(complaintStatusData).map(([name, value]) => ({ name, value }));
  const lineData = (unitReportsQuery.data ?? []).map((item, index) => ({
    ad: item.birimAdi,
    puan: item.ortalamaPuan,
    cevap: item.toplamAnketSayisi,
    sira: index + 1
  }));

  return (
    <div className="space-y-4">
      <SectionCard title="KPI Raporu" subtitle="Genel memnuniyet ve şikayet verileri analitik bir görünümle sunulur.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] bg-white/80 p-5">
            <div className="text-sm text-slateglass/65">Memnuniyet Ortalaması</div>
            <div className="mt-3 font-display text-5xl font-black text-brand-500">{Math.round(dashboardQuery.data?.genelMemnuniyetOrtalamasi ?? 0)}</div>
          </div>
          <div className="rounded-[28px] bg-white/80 p-5">
            <div className="text-sm text-slateglass/65">Toplam Tamamlanan Anket</div>
            <div className="mt-3 font-display text-5xl font-black text-night">{dashboardQuery.data?.toplamCevaplananAnket ?? 0}</div>
          </div>
          <div className="rounded-[28px] bg-white/80 p-5">
            <div className="text-sm text-slateglass/65">Aksiyon Gerektiren Şikayet</div>
            <div className="mt-3 font-display text-5xl font-black text-amber-600">{dashboardQuery.data?.toplamSikayetSayisi ?? 0}</div>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Şikayet Durum Dağılımı" subtitle="Şikayet kayıtlarının durum bazlı dağılımı.">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} innerRadius={56}>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Birim Memnuniyet Trendi" subtitle="Birim raporu verisinin grafik görünümü.">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8f6fb" />
                <XAxis dataKey="ad" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="puan" stroke="#1aa9cd" strokeWidth={3} dot={{ fill: "#175b72" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
