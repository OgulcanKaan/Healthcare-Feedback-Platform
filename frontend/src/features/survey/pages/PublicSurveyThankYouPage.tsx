import { CheckCircle2, Lightbulb, MessageSquareWarning, Send } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUnitsQuery } from "@/features/admin/api/adminQueries";
import { useSubmitOneriSikayetCommand } from "@/features/complaint/api/oneriSikayetApi";
import { useSurveyResultQuery } from "@/features/survey/api/surveyCommands";
import { LoadingState } from "@/shared/components/LoadingState";
import { SectionCard } from "@/shared/components/SectionCard";

export function PublicSurveyThankYouPage() {
  const { sessionId } = useParams();
  const sessionIdNumber = Number(sessionId ?? 0);
  const surveyResultQuery = useSurveyResultQuery(sessionIdNumber);
  const unitsQuery = useUnitsQuery();
  const submitCommand = useSubmitOneriSikayetCommand();

  const [tip, setTip] = useState<"Sikayet" | "Oneri">("Sikayet");
  const [mesaj, setMesaj] = useState("");
  const [gonderenAd, setGonderenAd] = useState("");
  const [birimId, setBirimId] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [hasFeedback, setHasFeedback] = useState<boolean | null>(null);

  if (surveyResultQuery.isLoading) {
    return <LoadingState title="Anket sonucu yükleniyor..." />;
  }

  if (!surveyResultQuery.data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <SectionCard title="Sonuç Bulunamadı" subtitle="Oturum sonucu API'den alınamadı.">
          Sonuç kaydı bulunamadı.
        </SectionCard>
      </div>
    );
  }

  async function handleFeedbackSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");

    if (!mesaj.trim()) {
      setFormError("Lütfen bir mesaj yazın.");
      return;
    }

    try {
      await submitCommand.mutateAsync({
        tip,
        mesaj: mesaj.trim(),
        gonderenAd: gonderenAd.trim() || undefined,
        birimId,
        oturumId: sessionIdNumber > 0 ? sessionIdNumber : 0
      });
      setSubmitted(true);
    } catch {
      setFormError("Gönderilemedi. Lütfen tekrar deneyin.");
    }
  }

  return (
    <div className="min-h-screen bg-hero-glow px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Teşekkür kartı */}
        <SectionCard title="Teşekkürler" subtitle="Anketiniz başarıyla tamamlandı ve sonuçlar kaydedildi.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] bg-gradient-to-br from-brand-50 to-white p-6">
              <div className="text-sm uppercase tracking-[0.24em] text-slateglass/60">Toplam Puan</div>
              <div className="mt-3 font-display text-6xl font-black text-brand-500">{surveyResultQuery.data.toplamPuan}</div>
              <div className="mt-3 text-slateglass/72">Ortalama Puan: {surveyResultQuery.data.ortalamaPuan.toFixed(2)}</div>
            </div>
            <div className="rounded-[28px] border border-brand-100 bg-white/80 p-6">
              <div className="text-sm uppercase tracking-[0.24em] text-slateglass/60">Oturum Durumu</div>
              <div className="mt-4 text-2xl font-bold text-night">{surveyResultQuery.data.durum}</div>
              <div className="mt-4 text-sm text-slateglass/72">Oturum No: #{surveyResultQuery.data.oturumId}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/login" className="action-button-primary">
              Yönetim Paneline Dön
            </Link>
            <Link to="/" className="action-button-secondary">
              Ana Sayfa
            </Link>
          </div>
        </SectionCard>

        {/* Öneri / Şikayet formu */}
        <div className="glass-panel p-6">
          <div className="mb-5">
            <h2 className="font-display text-2xl font-black uppercase tracking-wide text-night">
              Öneri veya Şikayet Bildir
            </h2>
            <p className="mt-2 text-sm text-slateglass/70">
              Deneyiminizle ilgili bir öneriniz veya şikayetiniz var mı?
            </p>

            {!submitted && (
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setHasFeedback(true)}
                  className={`flex-1 rounded-2xl border px-4 py-3 font-semibold transition-all duration-300 ${
                    hasFeedback === true
                      ? "border-brand-400 bg-brand-50 text-brand-700 shadow-sm"
                      : "border-brand-100 bg-white/70 text-slateglass hover:bg-white hover:border-brand-200"
                  }`}
                >
                  Evet, var
                </button>
                <button
                  type="button"
                  onClick={() => setHasFeedback(false)}
                  className={`flex-1 rounded-2xl border px-4 py-3 font-semibold transition-all duration-300 ${
                    hasFeedback === false
                      ? "border-slate-400 bg-slate-50 text-slate-700 shadow-sm"
                      : "border-brand-100 bg-white/70 text-slateglass hover:bg-white hover:border-brand-200"
                  }`}
                >
                  Hayır, yok
                </button>
              </div>
            )}
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 rounded-[28px] bg-green-50 py-10 text-center animate-in fade-in duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <div className="font-semibold text-green-800">
                {tip === "Oneri" ? "Öneriniz alındı. Teşekkür ederiz!" : "Şikayetiniz alındı. En kısa sürede incelenecektir."}
              </div>
            </div>
          ) : hasFeedback === true ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* Tip seçimi */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTip("Sikayet")}
                    className={`flex items-center justify-center gap-2 rounded-[20px] border px-4 py-4 font-semibold transition-all duration-300 ${
                      tip === "Sikayet"
                        ? "border-red-300 bg-red-50 text-red-700 shadow-sm scale-[1.02]"
                        : "border-brand-100 bg-white/70 text-slateglass/70 hover:bg-white hover:scale-[1.02]"
                    }`}
                  >
                    <MessageSquareWarning size={18} />
                    Şikayet
                  </button>
                  <button
                    type="button"
                    onClick={() => setTip("Oneri")}
                    className={`flex items-center justify-center gap-2 rounded-[20px] border px-4 py-4 font-semibold transition-all duration-300 ${
                      tip === "Oneri"
                        ? "border-brand-300 bg-brand-50 text-brand-700 shadow-sm scale-[1.02]"
                        : "border-brand-100 bg-white/70 text-slateglass/70 hover:bg-white hover:scale-[1.02]"
                    }`}
                  >
                    <Lightbulb size={18} />
                    Öneri
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slateglass/75">Adınız (isteğe bağlı)</span>
                    <input
                      className="glass-input transition-all duration-300"
                      placeholder="Adınız..."
                      value={gonderenAd}
                      onChange={(e) => setGonderenAd(e.target.value)}
                      maxLength={100}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slateglass/75">Birim</span>
                    <select
                      className="glass-input transition-all duration-300"
                      value={birimId}
                      onChange={(e) => setBirimId(Number(e.target.value))}
                    >
                      {(unitsQuery.data ?? []).map((unit) => (
                        <option key={unit.id} value={unit.id}>{unit.birimAdi}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slateglass/75">
                    {tip === "Oneri" ? "Öneriniz" : "Şikayetiniz"} <span className="text-red-400">*</span>
                  </span>
                  <textarea
                    className="glass-input min-h-32 transition-all duration-300"
                    placeholder="Lütfen şikayet veya önerinizi yazınız..."
                    value={mesaj}
                    onChange={(e) => setMesaj(e.target.value)}
                    maxLength={1000}
                    required
                  />
                  <div className="mt-1 text-right text-xs text-slateglass/50">{mesaj.length}/1000</div>
                </label>

                {formError && (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 animate-in fade-in duration-300">{formError}</div>
                )}

                <button
                  type="submit"
                  className="action-button-primary transition-all duration-300 hover:shadow-md"
                  disabled={submitCommand.isPending}
                >
                  <Send size={16} className="mr-2" />
                  {submitCommand.isPending ? "Gönderiliyor..." : `${tip === "Oneri" ? "Öneriyi" : "Şikayeti"} Gönder`}
                </button>
              </form>
            </div>
          ) : hasFeedback === false ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-center text-sm text-slateglass/70 animate-in fade-in duration-300">
              Geri bildiriminiz için teşekkür ederiz. Ana sayfaya dönebilirsiniz.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
