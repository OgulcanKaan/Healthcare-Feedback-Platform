import { ShieldCheck, Stethoscope } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/store/hooks";
import { useLoginCommand } from "@/features/auth/api/authCommands";
import { setCredentials as setAuthCredentials } from "@/features/auth/store/authSlice";
import { extractApiError } from "@/shared/utils/api";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loginCommand = useLoginCommand();
  const [credentials, setLoginForm] = useState({
    kullaniciAdi: "admin",
    sifre: "123456"
  });
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const response = await loginCommand.mutateAsync(credentials);
      dispatch(setAuthCredentials({ token: response.token, user: response.kullanici }));
      navigate("/dashboard");
    } catch (mutationError) {
      setError(extractApiError(mutationError));
    }
  }

  return (
    <div className="min-h-screen bg-hero-glow px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[1fr_460px]">
        <section className="glass-panel relative overflow-hidden p-8">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(26,169,205,0.08),transparent_40%,rgba(93,214,200,0.12))]" />
          <div className="relative">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-brand-700">
              <ShieldCheck size={18} />
              JWT + CQRS + Önbellekleme Destekli
            </div>
            <h1 className="mt-8 max-w-3xl font-display text-5xl font-black uppercase leading-tight text-night">
              Hasta Memnuniyet Yönetim Sistemi
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slateglass/80">
              Yönetim paneli, anket akışı, birim bazlı analitikler ve şikayet takibi tek bir kurumsal arayüzde birleşir.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                { title: "Gösterge Paneli", subtitle: "KPI kartları ve canlı birim analizi" },
                { title: "Anket Akışı", subtitle: "KVKK, oturum ve çoklu soru tipleri" },
                { title: "Yönetim Merkezi", subtitle: "Kullanıcı, rol, birim ve soru bankası" }
              ].map((item) => (
                <div key={item.title} className="rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-glass">
                  <div className="font-display text-lg font-black uppercase text-night">{item.title}</div>
                  <div className="mt-2 text-sm text-slateglass/72">{item.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-brand-500 to-mint text-white shadow-soft">
              <Stethoscope />
            </div>
            <div>
              <div className="font-display text-2xl font-black uppercase text-night">Yönetici Girişi</div>
              <div className="text-sm text-slateglass/70">Varsayılan hesap bilgileri dolduruldu.</div>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slateglass/75">Kullanıcı Adı</span>
              <input
                className="glass-input"
                value={credentials.kullaniciAdi}
                onChange={(event) => setLoginForm((current) => ({ ...current, kullaniciAdi: event.target.value }))}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slateglass/75">Şifre</span>
              <input
                type="password"
                className="glass-input"
                value={credentials.sifre}
                onChange={(event) => setLoginForm((current) => ({ ...current, sifre: event.target.value }))}
              />
            </label>

            {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div> : null}

            <button type="submit" className="action-button-primary w-full" disabled={loginCommand.isPending}>
              {loginCommand.isPending ? "Giriş yapılıyor..." : "Panele Giriş Yap"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
