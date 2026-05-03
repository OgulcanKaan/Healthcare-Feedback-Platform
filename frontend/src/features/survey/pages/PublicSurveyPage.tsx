import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUnitsQuery } from "@/features/admin/api/adminQueries";
import { useStartSurveySessionCommand, useSubmitSurveyAnswersCommand } from "@/features/survey/api/surveyCommands";
import { useSurveyDetailQuery } from "@/features/survey/api/surveyQueries";
import { LoadingState } from "@/shared/components/LoadingState";
import type { SurveyQuestion } from "@/shared/models/survey";
import { extractApiError } from "@/shared/utils/api";

type AnswerState = Record<number, number | string>;

function getDefaultQuestionOptions(question: SurveyQuestion) {
  if (question.secenekler.length > 0) {
    return question.secenekler;
  }

  if (question.soruTipi === "YesNo") {
    return [
      { id: 1, soruId: question.soruId, secenekMetni: "Evet", puanDegeri: 5 },
      { id: 2, soruId: question.soruId, secenekMetni: "Hayır", puanDegeri: 1 }
    ];
  }

  return [];
}

export function PublicSurveyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const surveyId = Number(id ?? 0);
  const surveyDetailQuery = useSurveyDetailQuery(surveyId, Boolean(surveyId));
  const unitsQuery = useUnitsQuery();
  const startSessionCommand = useStartSurveySessionCommand();
  const submitAnswersCommand = useSubmitSurveyAnswersCommand();
  const [hasStarted, setHasStarted] = useState(false);
  const [kvkkApproved, setKvkkApproved] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const survey = surveyDetailQuery.data;
  const questions = survey?.sorular ?? [];
  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  if ((surveyDetailQuery.isLoading || unitsQuery.isLoading) && !survey) {
    return <LoadingState title="Anket yükleniyor..." />;
  }

  if (!survey) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="glass-panel p-8 text-red-600">{error || "Anket yüklenemedi."}</div>
      </div>
    );
  }

  // Sorusu olmayan anket kontrolü
  if (!hasStarted && questions.length === 0) {
    return (
      <div className="min-h-screen bg-hero-glow px-4 py-6 flex items-center justify-center">
        <div className="glass-panel max-w-xl w-full p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl">⚠️</div>
          <h2 className="font-display text-3xl font-black uppercase text-night">{survey.anketAdi}</h2>
          <p className="mt-4 text-slateglass/75">
            Bu anket henüz yayına hazır değil. Lütfen daha sonra tekrar deneyiniz.
          </p>
        </div>
      </div>
    );
  }

  async function handleStart() {
    setError("");

    if (!survey) {
      setError("Anket verisi yüklenemedi.");
      return;
    }

    if (!kvkkApproved) {
      setError("Ankete devam etmek için KVKK onayı vermeniz gerekmektedir.");
      return;
    }

    try {
      const response = await startSessionCommand.mutateAsync({
        anketId: survey.id,
        hastaId: null,
        birimId: selectedUnitId,
        randevuId: null,
        kanal: "Web",
        kvkkOnayDurumu: kvkkApproved,
        ipAdresi: "127.0.0.1",
        cihazBilgisi: "Web Tarayıcı"
      });

      setSessionId(response.oturumId);
      setHasStarted(true);
    } catch (mutationError) {
      setError(extractApiError(mutationError));
    }
  }

  async function handleFinish() {
    setError("");

    if (!sessionId || !survey) {
      setError("Oturum başlatılamadı.");
      return;
    }

    const missingRequired = questions.some((question) => question.zorunluMu && !answers[question.soruId]);
    if (missingRequired) {
      setError("Zorunlu soruları tamamlamadan devam edemezsiniz.");
      return;
    }

    try {
      await submitAnswersCommand.mutateAsync({
        oturumId: sessionId,
        payload: {
          anketId: survey.id,
          hastaId: null,
          kvkkOnayDurumu: kvkkApproved,
          cevaplar: questions.map((question) => ({
            soruId: question.soruId,
            secenekId: question.soruTipi === "OpenText" ? null : Number(answers[question.soruId] ?? 0) || null,
            acikCevap: question.soruTipi === "OpenText" ? String(answers[question.soruId] ?? "") : null
          }))
        }
      });

      navigate(`/anket/${survey.id}/tesekkur/${sessionId}`);
    } catch (mutationError) {
      setError(extractApiError(mutationError));
    }
  }

  return (
    <div className="min-h-screen bg-hero-glow px-4 py-6">
      <div className="mx-auto grid max-w-7xl gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <PhonePreview question={currentQuestion} currentIndex={currentIndex} total={questions.length} />

        <div className="glass-panel p-6">
          {!hasStarted ? (
            <div className="space-y-6">
              <div className="rounded-[28px] bg-gradient-to-br from-white to-brand-50 p-6">
                <div className="font-display text-4xl font-black uppercase tracking-wide text-night">{survey.anketAdi}</div>
                <div className="mt-4 text-lg text-slateglass/80">{survey.karsilamaMesaji}</div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slateglass/75">Birim Seçimi</span>
                <select className="glass-input" value={selectedUnitId} onChange={(event) => setSelectedUnitId(Number(event.target.value))}>
                  {unitsQuery.data?.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.birimAdi}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-start gap-3 rounded-[24px] border border-brand-100 bg-white/80 p-4">
                <input
                  type="checkbox"
                  checked={kvkkApproved}
                  onChange={(event) => setKvkkApproved(event.target.checked)}
                  className="mt-1 h-5 w-5 accent-cyan-500"
                />
                <span className="text-sm text-slateglass/80">
                  Kişisel verilerimin işlenmesine ilişkin KVKK aydınlatma metnini okudum, onaylıyorum.
                </span>
              </label>

              {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div> : null}

              <button type="button" className="action-button-primary" onClick={handleStart} disabled={startSessionCommand.isPending}>
                {startSessionCommand.isPending ? "Anket başlatılıyor..." : "Ankete Başla"}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-full bg-brand-50 p-2">
                <div className="h-3 rounded-full bg-white/90">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                    style={{ width: `${((currentIndex + 1) / Math.max(questions.length, 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[30px] bg-white/85 p-6 shadow-sm">
                <div className="text-sm text-slateglass/60">Soru {currentIndex + 1} / {questions.length}</div>
                <div className="mt-4 text-3xl font-semibold leading-tight text-night">{currentQuestion?.soruMetni}</div>
                <div className="mt-6 space-y-3">
                  {renderQuestionInput(currentQuestion, answers, setAnswers)}
                </div>
              </div>

              {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div> : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="action-button-secondary"
                  onClick={() => setCurrentIndex((value) => Math.max(value - 1, 0))}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={18} className="mr-1" />
                  Geri
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    className="action-button-primary"
                    onClick={() => setCurrentIndex((value) => Math.min(value + 1, questions.length - 1))}
                  >
                    İleri
                    <ChevronRight size={18} className="ml-1" />
                  </button>
                ) : (
                  <button type="button" className="action-button-primary" onClick={handleFinish} disabled={submitAnswersCommand.isPending}>
                    {submitAnswersCommand.isPending ? "Gönderiliyor..." : "Anketi Tamamla"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function renderQuestionInput(
  question: SurveyQuestion | undefined,
  answers: AnswerState,
  setAnswers: React.Dispatch<React.SetStateAction<AnswerState>>
) {
  if (!question) {
    return null;
  }

  if (question.soruTipi === "OpenText") {
    return (
      <textarea
        className="glass-input min-h-32"
        placeholder="Görüşünüzü yazın..."
        value={String(answers[question.soruId] ?? "")}
        onChange={(event) =>
          setAnswers((current) => ({
            ...current,
            [question.soruId]: event.target.value
          }))
        }
      />
    );
  }

  return getDefaultQuestionOptions(question).map((option) => {
    const isSelected = String(answers[question.soruId] ?? "") === String(option.id);

    return (
      <button
        key={option.id}
        type="button"
        onClick={() =>
          setAnswers((current) => ({
            ...current,
            [question.soruId]: option.id
          }))
        }
        className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition ${
          isSelected ? "border-brand-400 bg-brand-50" : "border-brand-100 bg-white hover:border-brand-300"
        }`}
      >
        <span className={`h-6 w-6 rounded-full border-2 ${isSelected ? "border-brand-500 bg-brand-500" : "border-brand-400"}`} />
        <span className="text-xl text-night">{option.secenekMetni}</span>
      </button>
    );
  });
}

function PhonePreview({
  question,
  currentIndex,
  total
}: {
  question: SurveyQuestion | undefined;
  currentIndex: number;
  total: number;
}) {
  return (
    <div className="relative hidden items-center justify-center overflow-hidden rounded-[40px] bg-gradient-to-br from-brand-50 via-white to-sky-100 p-8 xl:flex">
      <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(48,173,206,0.10),transparent_30%,rgba(48,173,206,0.07)_85%)]" />
      <div className="relative w-[360px] rotate-[-11deg] rounded-[42px] border border-slate-800/20 bg-[#1b1f25] p-4 shadow-[0_35px_100px_rgba(15,33,49,0.35)]">
        <div className="rounded-[34px] bg-white px-8 pb-8 pt-6">
          <div className="mx-auto h-9 w-36 rounded-full bg-slate-950" />
          <div className="mt-6 h-3 rounded-full bg-slate-200">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
              style={{ width: `${total ? ((currentIndex + 1) / total) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-3 text-right text-sm text-slateglass/65">Soru {currentIndex + 1} / {total || 0}</div>
          <div className="mt-8 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-500/15 to-mint/25 text-5xl font-black text-brand-600">
              PB
            </div>
            <div className="mt-5 font-display text-3xl font-black text-brand-600">PROBEL</div>
            <div className="mt-6 text-3xl font-semibold leading-tight text-slateglass">
              {question?.soruMetni ?? "Hastanemizden aldığınız hizmeti nasıl değerlendirirsiniz?"}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700">
              <ShieldCheck size={16} />
              KVKK Onaylı
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
