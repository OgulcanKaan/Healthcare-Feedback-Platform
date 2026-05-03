import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteSurveyCommand } from "@/features/survey/api/surveyCommands";
import { useSurveyListQuery } from "@/features/survey/api/surveyQueries";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingState } from "@/shared/components/LoadingState";
import { SectionCard } from "@/shared/components/SectionCard";
import { StatusPill } from "@/shared/components/StatusPill";
import { formatDateTime } from "@/shared/utils/format";

export function SurveyListPage() {
  const surveyListQuery = useSurveyListQuery();
  const deleteSurveyCommand = useDeleteSurveyCommand();

  if (surveyListQuery.isLoading) {
    return <LoadingState title="Anket listesi yukleniyor..." />;
  }

  if (!surveyListQuery.data?.length) {
    return (
      <SectionCard
        title="Anketler"
        subtitle="CQRS query katmanından gelen anket listesi burada görüntülenir."
        actions={
          <Link to="/anketler/yeni" className="action-button-primary">
            <Plus size={18} className="mr-2" />
            Yeni Anket
          </Link>
        }
      >
        <EmptyState title="Anket yok" description="Ilk anketini oluşturduğunda burada liste görünecek." />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Anketler"
      subtitle="Create, update ve delete işlemleri ayrı command katmanından yönetilir; listeleme ise React Query cache üzerinden gelir."
      actions={
        <Link to="/anketler/yeni" className="action-button-primary">
          <Plus size={18} className="mr-2" />
          Yeni Anket
        </Link>
      }
    >
      <div className="overflow-hidden rounded-[28px] border border-brand-100">
        <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
          <table className="w-full bg-white/80 text-left text-sm">
            <thead className="sticky top-0 z-10 bg-brand-50 text-slateglass/75 shadow-sm">
              <tr>
                <th className="px-5 py-4">Anket</th>
                <th className="px-5 py-4">Durum</th>
                <th className="px-5 py-4">Başlangıç</th>
                <th className="px-5 py-4">Bitiş</th>
                <th className="px-5 py-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {surveyListQuery.data.map((survey) => (
                <tr key={survey.id} className="border-t border-brand-50 transition-colors hover:bg-white">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-night">{survey.anketAdi}</div>
                    <div className="mt-1 text-xs text-slateglass/60">{survey.karsilamaMesaji}</div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill value={survey.durum} tone={survey.durum === "Aktif" ? "success" : "warning"} />
                  </td>
                  <td className="px-5 py-4">{formatDateTime(survey.baslangicTarihi)}</td>
                  <td className="px-5 py-4">{formatDateTime(survey.bitisTarihi ?? "")}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/anketler/${survey.id}/duzenle`} className="action-button-secondary !px-4 !py-2">
                        <Pencil size={16} className="mr-2" />
                        Düzenle
                      </Link>
                      <Link to={`/anket/${survey.id}`} className="action-button-secondary !px-4 !py-2">
                        <Eye size={16} className="mr-2" />
                        Anketi Görüntüle
                      </Link>
                      <button
                        type="button"
                        className="action-button-secondary !px-4 !py-2 text-red-600 hover:bg-red-50"
                        onClick={() => deleteSurveyCommand.mutate(survey.id)}
                        disabled={deleteSurveyCommand.isPending}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  );
}
