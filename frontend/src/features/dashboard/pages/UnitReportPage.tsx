import { ResponsiveContainer, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { useAppSelector } from "@/app/store/hooks";
import { useUnitReportsQuery } from "@/features/dashboard/api/dashboardQueries";
import { LoadingState } from "@/shared/components/LoadingState";
import { SectionCard } from "@/shared/components/SectionCard";
import { formatPercent } from "@/shared/utils/format";

export function UnitReportPage() {
  const filters = useAppSelector((state) => state.dashboardFilters);
  const unitReportsQuery = useUnitReportsQuery(filters.startDate, filters.endDate);

  if (unitReportsQuery.isLoading) {
    return <LoadingState title="Birim raporu yükleniyor..." />;
  }

  return (
    <SectionCard title="Birim Bazlı Rapor" subtitle="Tablo ve grafik aynı veri setinden üretilir; önbellek ile tekrar kullanılır.">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[28px] border border-brand-100">
          <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
            <table className="w-full bg-white/80 text-left text-sm">
              <thead className="sticky top-0 z-10 bg-brand-50 text-slateglass/75 shadow-sm">
                <tr>
                  <th className="px-5 py-4">Birim</th>
                  <th className="px-5 py-4">Ortalama Puan</th>
                  <th className="px-5 py-4">Toplam Anket</th>
                </tr>
              </thead>
              <tbody>
                {unitReportsQuery.data?.map((item) => (
                  <tr key={item.birimAdi} className="border-t border-brand-50 transition-colors hover:bg-white">
                    <td className="px-5 py-4 font-semibold text-night">{item.birimAdi}</td>
                    <td className="px-5 py-4">{formatPercent(item.ortalamaPuan)}</td>
                    <td className="px-5 py-4">{item.toplamAnketSayisi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[28px] bg-white/80 p-4">
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitReportsQuery.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8f6fb" />
                <XAxis dataKey="birimAdi" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="toplamAnketSayisi" fill="#5dd6c8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
