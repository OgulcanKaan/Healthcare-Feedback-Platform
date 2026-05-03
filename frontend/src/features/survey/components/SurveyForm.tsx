import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { useQuestionsQuery } from "@/features/admin/api/adminQueries";
import { useAddSurveyQuestionCommand, useRemoveSurveyQuestionCommand } from "@/features/survey/api/surveyCommands";
import type { SurveyDetail, SurveyFormValues } from "@/shared/models/survey";
import { toDateInputValue } from "@/shared/utils/format";

interface SurveyFormProps {
  mode: "create" | "edit";
  values: SurveyFormValues;
  detail?: SurveyDetail | null;
  saving: boolean;
  error: string;
  onChange: (values: SurveyFormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function SurveyForm({ mode, values, detail, saving, error, onChange, onSubmit, onCancel }: SurveyFormProps) {
  const surveyId = detail?.id ?? 0;
  const questions = detail?.sorular ?? [];
  const addedIds = new Set(questions.map((q) => q.soruId));

  const questionsQuery = useQuestionsQuery();
  const addCommand = useAddSurveyQuestionCommand(surveyId);
  const removeCommand = useRemoveSurveyQuestionCommand(surveyId);

  const allQuestions = questionsQuery.data ?? [];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      {/* Sol panel: anket metadata */}
      <div className="glass-panel p-6">
        <div className="mb-5">
          <h2 className="font-display text-3xl font-black uppercase tracking-wide text-night">
            {mode === "edit" ? "Anket Düzenle" : "Yeni Anket"}
          </h2>
          <p className="mt-2 text-sm text-slateglass/75">
            Anket bilgilerini doldurun. Soruları sağ panelden ekleyebilirsiniz.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slateglass/75">Anket Adı</span>
            <input
              className="glass-input"
              value={values.anketAdi}
              onChange={(event) => onChange({ ...values, anketAdi: event.target.value })}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slateglass/75">Durum</span>
            <select className="glass-input" value={values.durum} onChange={(event) => onChange({ ...values, durum: event.target.value })}>
              <option value="Aktif">Aktif</option>
              <option value="Pasif">Pasif</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slateglass/75">Başlangıç Tarihi</span>
            <input
              type="datetime-local"
              className="glass-input"
              value={toDateInputValue(values.baslangicTarihi)}
              onChange={(event) => onChange({ ...values, baslangicTarihi: new Date(event.target.value).toISOString() })}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slateglass/75">Bitiş Tarihi</span>
            <input
              type="datetime-local"
              className="glass-input"
              value={toDateInputValue(values.bitisTarihi)}
              onChange={(event) => onChange({ ...values, bitisTarihi: new Date(event.target.value).toISOString() })}
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slateglass/75">Karşılama Mesajı</span>
            <textarea
              className="glass-input min-h-28"
              value={values.karsilamaMesaji}
              onChange={(event) => onChange({ ...values, karsilamaMesaji: event.target.value })}
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slateglass/75">Teşekkür Mesajı</span>
            <textarea
              className="glass-input min-h-28"
              value={values.tesekkurMesaji}
              onChange={(event) => onChange({ ...values, tesekkurMesaji: event.target.value })}
            />
          </label>
        </div>

        {error ? <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="action-button-primary" onClick={onSubmit} disabled={saving}>
            {saving ? "Kaydediliyor..." : mode === "edit" ? "Güncellemeyi Kaydet" : "Anketi Oluştur"}
          </button>
          <button type="button" className="action-button-secondary" onClick={onCancel}>
            Vazgeç
          </button>
        </div>
      </div>

      {/* Sağ panel: soru yönetimi */}
      <div className="glass-panel flex flex-col gap-5 p-6">
        {/* Anketteki mevcut sorular */}
        <div>
          <h3 className="font-display text-2xl font-black uppercase tracking-wide text-night">
            Anketteki Sorular
          </h3>
          <p className="mt-1 text-sm text-slateglass/72">
            {questions.length === 0
              ? "Henüz soru eklenmedi."
              : `${questions.length} soru eklendi.`}
          </p>

          <div className="mt-4 space-y-3">
            {questions.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-brand-200 bg-white/70 p-5 text-center text-sm text-slateglass/60">
                Aşağıdan soru bankasındaki soruları ekleyebilirsiniz.
              </div>
            ) : (
              questions.map((question, index) => (
                <div key={question.soruId} className="flex items-start gap-3 rounded-[24px] border border-brand-100 bg-white/80 p-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-black text-brand-700">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-night">{question.soruMetni}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                        {question.soruTipi}
                      </span>
                      {question.zorunluMu && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                          Zorunlu
                        </span>
                      )}
                    </div>
                  </div>
                  {surveyId > 0 && (
                    <button
                      type="button"
                      title="Soruyu anketten çıkar"
                      className="shrink-0 rounded-xl border border-red-100 bg-red-50 p-2 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                      onClick={() => removeCommand.mutate(question.soruId)}
                      disabled={removeCommand.isPending}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Soru bankası — sadece edit modunda ve anket ID varsa göster */}
        {surveyId > 0 ? (
          <div>
            <h3 className="font-display text-xl font-black uppercase tracking-wide text-night">
              Soru Bankası
            </h3>
            <p className="mt-1 text-sm text-slateglass/70">
              Tıklayarak ankete ekle veya çıkar.
            </p>

            {questionsQuery.isLoading ? (
              <div className="mt-3 text-sm text-slateglass/60">Sorular yükleniyor...</div>
            ) : allQuestions.length === 0 ? (
              <div className="mt-3 rounded-[24px] border border-dashed border-brand-200 bg-white/70 p-4 text-sm text-slateglass/60">
                Soru bankası boş. Önce Yönetim &gt; Soru Bankası'ndan soru ekleyin.
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {allQuestions.map((question) => {
                  const isAdded = addedIds.has(question.id);
                  return (
                    <button
                      key={question.id}
                      type="button"
                      disabled={addCommand.isPending || removeCommand.isPending}
                      onClick={() => {
                        if (isAdded) {
                          removeCommand.mutate(question.id);
                        } else {
                          addCommand.mutate(question.id);
                        }
                      }}
                      className={`flex w-full items-center gap-3 rounded-[20px] border px-4 py-3 text-left transition disabled:opacity-60 ${
                        isAdded
                          ? "border-brand-300 bg-brand-50 text-brand-800"
                          : "border-brand-100 bg-white/75 hover:border-brand-300 hover:bg-white"
                      }`}
                    >
                      {isAdded ? (
                        <CheckCircle2 size={18} className="shrink-0 text-brand-500" />
                      ) : (
                        <Circle size={18} className="shrink-0 text-brand-300" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{question.soruMetni}</div>
                        <div className="mt-0.5 text-xs text-slateglass/60">
                          {question.soruTipi} · {question.kategori}
                        </div>
                      </div>
                      <span className={`shrink-0 text-xs font-bold ${isAdded ? "text-brand-600" : "text-slateglass/40"}`}>
                        {isAdded ? "Eklendi" : <Plus size={14} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[24px] border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
            💡 Anketi önce oluşturun, ardından "Düzenle" butonuyla soru ekleyebilirsiniz.
          </div>
        )}
      </div>
    </div>
  );
}
