import { useMemo, useState } from "react";
import { ResponsiveContainer, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart3, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { useUnitReportsQuery } from "@/features/dashboard/api/dashboardQueries";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingState } from "@/shared/components/LoadingState";
import { SectionCard } from "@/shared/components/SectionCard";
import { formatPercent } from "@/shared/utils/format";

const pageSize = 8;

export function UnitReportPage() {
  const filters = useAppSelector((state) => state.dashboardFilters);
  const unitReportsQuery = useUnitReportsQuery(filters.startDate, filters.endDate);
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState<"all" | "critical" | "good">("all");
  const [page, setPage] = useState(1);

  const filteredReports = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("tr-TR");

    return (unitReportsQuery.data ?? []).filter((item) => {
      const matchesSearch = item.birimAdi.toLocaleLowerCase("tr-TR").includes(normalizedSearch);
      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "critical" && item.ortalamaPuan < 60) ||
        (scoreFilter === "good" && item.ortalamaPuan >= 80);

      return matchesSearch && matchesScore;
    });
  }, [scoreFilter, searchTerm, unitReportsQuery.data]);

  const pageCount = Math.max(1, Math.ceil(filteredReports.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pagedReports = filteredReports.slice((safePage - 1) * pageSize, safePage * pageSize);

  if (unitReportsQuery.isLoading) {
    return <LoadingState title="Birim raporu yükleniyor..." variant="table" />;
  }

  return (
    <SectionCard title="Birim Bazlı Rapor" subtitle="Tablo ve grafik aynı veri setinden üretilir; arama, memnuniyet filtresi ve sayfalama ile incelenir.">
      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slateglass/45 dark:text-slate-400" />
          <input
            className="glass-input pl-11"
            placeholder="Birim adı ara"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <select
          className="glass-input lg:w-56"
          value={scoreFilter}
          onChange={(event) => {
            setScoreFilter(event.target.value as "all" | "critical" | "good");
            setPage(1);
          }}
        >
          <option value="all">Tüm skorlar</option>
          <option value="critical">60 altı öncelikli</option>
          <option value="good">80 ve üzeri güçlü</option>
        </select>
        <div className="flex items-center justify-between rounded-xl border border-brand-100 bg-white/70 px-4 py-3 text-sm font-semibold text-slateglass dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {filteredReports.length} kayıt
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <EmptyState title="Henüz veri girişi yapılmamış" description="Seçili filtrelerde birim raporu bulunamadı. Tarih aralığını veya arama kriterini değiştirebilirsiniz." icon={<BarChart3 size={22} />} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="table-shell">
            <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Birim</th>
                    <th>Ortalama Puan</th>
                    <th>Toplam Anket</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedReports.map((item) => (
                    <tr key={item.birimAdi}>
                      <td className="font-semibold text-night dark:text-white">{item.birimAdi}</td>
                      <td>{formatPercent(item.ortalamaPuan)}</td>
                      <td>{item.toplamAnketSayisi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-brand-100 bg-white/70 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-slateglass/70 dark:text-slate-300">
                Sayfa {safePage} / {pageCount}
              </span>
              <div className="flex gap-2">
                <button type="button" className="action-button-secondary !rounded-xl !px-3 !py-2" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="action-button-secondary !rounded-xl !px-3 !py-2" disabled={safePage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/80 p-4 dark:bg-slate-900/70">
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredReports}>
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
      )}
    </SectionCard>
  );
}
