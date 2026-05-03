import { Plus, UserRound, Building2, Shield, ScrollText } from "lucide-react";
import { useMemo, useState } from "react";
import {
  useCreateQuestionCommand,
  useCreateRoleCommand,
  useCreateUnitCommand,
  useCreateUserCommand
} from "@/features/admin/api/adminCommands";
import { useLogsQuery, useQuestionsQuery, useRolesQuery, useUnitsQuery, useUsersQuery } from "@/features/admin/api/adminQueries";
import { LoadingState } from "@/shared/components/LoadingState";
import { SectionCard } from "@/shared/components/SectionCard";
import { StatusPill } from "@/shared/components/StatusPill";
import { extractApiError } from "@/shared/utils/api";
import { formatDateTime } from "@/shared/utils/format";

export function AdminManagementPage() {
  const usersQuery = useUsersQuery();
  const rolesQuery = useRolesQuery();
  const unitsQuery = useUnitsQuery();
  const questionsQuery = useQuestionsQuery();
  const logsQuery = useLogsQuery();
  const createUserCommand = useCreateUserCommand();
  const createRoleCommand = useCreateRoleCommand();
  const createUnitCommand = useCreateUnitCommand();
  const createQuestionCommand = useCreateQuestionCommand();
  const [error, setError] = useState("");
  const [userForm, setUserForm] = useState({
    kullaniciAdi: "",
    sifre: "",
    adSoyad: "",
    birimId: 1,
    rolId: 1,
    aktifPasif: true
  });
  const [roleForm, setRoleForm] = useState({ rolAdi: "", aktifPasif: true });
  const [unitForm, setUnitForm] = useState({ birimKodu: "", birimAdi: "", aktifPasif: true });
  const [questionForm, setQuestionForm] = useState({
    soruMetni: "",
    soruTipi: "CoktanSecmeli",
    zorunluMu: true,
    kategori: "Genel",
    secenekler: [
      { secenekMetni: "Cok Kotu", puanDegeri: 1 },
      { secenekMetni: "Kotu", puanDegeri: 2 },
      { secenekMetni: "Orta", puanDegeri: 3 },
      { secenekMetni: "Iyi", puanDegeri: 4 },
      { secenekMetni: "Cok Iyi", puanDegeri: 5 }
    ]
  });

  const isLoading = [usersQuery, rolesQuery, unitsQuery, questionsQuery, logsQuery].some((query) => query.isLoading);
  const roleOptions = rolesQuery.data ?? [];
  const unitOptions = unitsQuery.data ?? [];
  const questionPreview = useMemo(
    () => questionForm.secenekler.filter((item) => item.secenekMetni.trim()),
    [questionForm.secenekler]
  );

  if (isLoading) {
    return <LoadingState title="Yonetim modulleri yukleniyor..." />;
  }

  async function handleUserCreate() {
    setError("");
    try {
      await createUserCommand.mutateAsync(userForm);
      setUserForm({ kullaniciAdi: "", sifre: "", adSoyad: "", birimId: unitOptions[0]?.id ?? 1, rolId: roleOptions[0]?.id ?? 1, aktifPasif: true });
    } catch (mutationError) {
      setError(extractApiError(mutationError));
    }
  }

  async function handleRoleCreate() {
    setError("");
    try {
      await createRoleCommand.mutateAsync(roleForm);
      setRoleForm({ rolAdi: "", aktifPasif: true });
    } catch (mutationError) {
      setError(extractApiError(mutationError));
    }
  }

  async function handleUnitCreate() {
    setError("");
    try {
      await createUnitCommand.mutateAsync(unitForm);
      setUnitForm({ birimKodu: "", birimAdi: "", aktifPasif: true });
    } catch (mutationError) {
      setError(extractApiError(mutationError));
    }
  }

  async function handleQuestionCreate() {
    setError("");
    try {
      await createQuestionCommand.mutateAsync(questionForm);
      setQuestionForm({
        soruMetni: "",
        soruTipi: "CoktanSecmeli",
        zorunluMu: true,
        kategori: "Genel",
        secenekler: [
          { secenekMetni: "Cok Kotu", puanDegeri: 1 },
          { secenekMetni: "Kotu", puanDegeri: 2 },
          { secenekMetni: "Orta", puanDegeri: 3 },
          { secenekMetni: "Iyi", puanDegeri: 4 },
          { secenekMetni: "Cok Iyi", puanDegeri: 5 }
        ]
      });
    } catch (mutationError) {
      setError(extractApiError(mutationError));
    }
  }

  return (
    <div className="space-y-4">
      {error ? <div className="glass-panel rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Kullanici Yonetimi" subtitle="JWT rollerini kullanan admin kullanıcıları burada yönetilir.">
          <div className="max-h-[360px] overflow-y-auto custom-scrollbar pr-3">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slateglass/75">Kullanici Adi</span>
                <input className="glass-input" value={userForm.kullaniciAdi} onChange={(event) => setUserForm({ ...userForm, kullaniciAdi: event.target.value })} />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slateglass/75">Sifre</span>
                <input className="glass-input" value={userForm.sifre} onChange={(event) => setUserForm({ ...userForm, sifre: event.target.value })} />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slateglass/75">Ad Soyad</span>
                <input className="glass-input" value={userForm.adSoyad} onChange={(event) => setUserForm({ ...userForm, adSoyad: event.target.value })} />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slateglass/75">Rol</span>
                <select className="glass-input" value={userForm.rolId} onChange={(event) => setUserForm({ ...userForm, rolId: Number(event.target.value) })}>
                  {roleOptions.map((role) => (
                    <option key={role.id} value={role.id}>{role.rolAdi}</option>
                  ))}
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slateglass/75">Birim</span>
                <select className="glass-input" value={userForm.birimId} onChange={(event) => setUserForm({ ...userForm, birimId: Number(event.target.value) })}>
                  {unitOptions.map((unit) => (
                    <option key={unit.id} value={unit.id}>{unit.birimAdi}</option>
                  ))}
                </select>
              </label>
            </div>
            <button type="button" className="action-button-primary mt-5" onClick={handleUserCreate}>
              <Plus size={18} className="mr-2" />
              Kullanici Ekle
            </button>

            <div className="mt-6 space-y-3">
              {(!usersQuery.data || usersQuery.data.length === 0) ? (
                <div className="rounded-[24px] border border-dashed border-brand-200 bg-white/50 p-6 text-center text-sm text-slateglass/60">
                  Henüz veri bulunamadı.
                </div>
              ) : (
                usersQuery.data.map((user) => (
                  <div key={user.id} className="rounded-[24px] border border-brand-100 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-200">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><UserRound size={18} /></div>
                        <div>
                          <div className="font-semibold text-night">{user.adSoyad}</div>
                          <div className="text-sm text-slateglass/70">{user.kullaniciAdi}</div>
                        </div>
                      </div>
                      <StatusPill value={user.rolAdi} tone="neutral" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Soru Bankasi" subtitle="Question management ve option yapısı ER diyagramına uygun şekilde görünür.">
          <div className="max-h-[360px] overflow-y-auto custom-scrollbar pr-3">
            <div className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slateglass/75">Soru Metni</span>
                <textarea className="glass-input min-h-24" value={questionForm.soruMetni} onChange={(event) => setQuestionForm({ ...questionForm, soruMetni: event.target.value })} />
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slateglass/75">Soru Tipi</span>
                  <select className="glass-input" value={questionForm.soruTipi} onChange={(event) => setQuestionForm({ ...questionForm, soruTipi: event.target.value })}>
                    <option value="CoktanSecmeli">Likert / Çoktan Seçmeli</option>
                    <option value="YesNo">Evet / Hayır</option>
                    <option value="OpenText">Açık Uçlu</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slateglass/75">Kategori</span>
                  <input className="glass-input" value={questionForm.kategori} onChange={(event) => setQuestionForm({ ...questionForm, kategori: event.target.value })} />
                </label>
                <label className="flex items-center gap-3 rounded-[24px] border border-brand-100 bg-white/80 px-4 py-3">
                  <input type="checkbox" checked={questionForm.zorunluMu} onChange={(event) => setQuestionForm({ ...questionForm, zorunluMu: event.target.checked })} />
                  <span className="text-sm font-semibold text-slateglass/75">Zorunlu</span>
                </label>
              </div>
            </div>

            {questionForm.soruTipi !== "OpenText" ? (
              <div className="mt-4 space-y-3">
                {questionForm.secenekler.map((option, index) => (
                  <div key={`${option.secenekMetni}-${index}`} className="grid gap-3 md:grid-cols-[1fr_120px]">
                    <input
                      className="glass-input"
                      value={option.secenekMetni}
                      onChange={(event) =>
                        setQuestionForm((current) => ({
                          ...current,
                          secenekler: current.secenekler.map((item, itemIndex) => itemIndex === index ? { ...item, secenekMetni: event.target.value } : item)
                        }))
                      }
                    />
                    <input
                      type="number"
                      className="glass-input"
                      value={option.puanDegeri}
                      onChange={(event) =>
                        setQuestionForm((current) => ({
                          ...current,
                          secenekler: current.secenekler.map((item, itemIndex) => itemIndex === index ? { ...item, puanDegeri: Number(event.target.value) } : item)
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <button type="button" className="action-button-primary mt-5" onClick={handleQuestionCreate}>
              <Plus size={18} className="mr-2" />
              Soru Ekle
            </button>

            <div className="mt-6 space-y-3">
              {(!questionsQuery.data || questionsQuery.data.length === 0) ? (
                <div className="rounded-[24px] border border-dashed border-brand-200 bg-white/50 p-6 text-center text-sm text-slateglass/60">
                  Henüz veri bulunamadı.
                </div>
              ) : (
                questionsQuery.data.map((question) => (
                  <div key={question.id} className="rounded-[24px] border border-brand-100 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-200">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-night">{question.soruMetni}</div>
                        <div className="text-sm text-slateglass/70">{question.kategori}</div>
                      </div>
                      <StatusPill value={question.soruTipi} tone="neutral" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(question.secenekler.length ? question.secenekler : questionPreview).map((option) => (
                        <span
                          key={`${question.id}-${"id" in option ? option.id : option.secenekMetni}`}
                          className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                        >
                          {option.secenekMetni} ({option.puanDegeri})
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Rol Yonetimi" subtitle="Role-based authorization yapısını besler.">
          <div className="max-h-[360px] overflow-y-auto custom-scrollbar pr-3">
            <div className="space-y-3">
              <input className="glass-input" placeholder="Rol adi" value={roleForm.rolAdi} onChange={(event) => setRoleForm({ ...roleForm, rolAdi: event.target.value })} />
              <button type="button" className="action-button-primary" onClick={handleRoleCreate}>
                <Shield className="mr-2" size={18} />
                Rol Ekle
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {(!rolesQuery.data || rolesQuery.data.length === 0) ? (
                <div className="rounded-[24px] border border-dashed border-brand-200 bg-white/50 p-6 text-center text-sm text-slateglass/60">
                  Henüz veri bulunamadı.
                </div>
              ) : (
                rolesQuery.data.map((role) => (
                  <div key={role.id} className="rounded-[24px] border border-brand-100 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-200">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-night">{role.rolAdi}</div>
                      <StatusPill value={role.aktifPasif ? "Aktif" : "Pasif"} tone={role.aktifPasif ? "success" : "warning"} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Birim Yonetimi" subtitle="Unit listesi hem admin hem public survey akışında kullanılır.">
          <div className="max-h-[360px] overflow-y-auto custom-scrollbar pr-3">
            <div className="space-y-3">
              <input className="glass-input" placeholder="Birim kodu" value={unitForm.birimKodu} onChange={(event) => setUnitForm({ ...unitForm, birimKodu: event.target.value })} />
              <input className="glass-input" placeholder="Birim adi" value={unitForm.birimAdi} onChange={(event) => setUnitForm({ ...unitForm, birimAdi: event.target.value })} />
              <button type="button" className="action-button-primary" onClick={handleUnitCreate}>
                <Building2 className="mr-2" size={18} />
                Birim Ekle
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {(!unitsQuery.data || unitsQuery.data.length === 0) ? (
                <div className="rounded-[24px] border border-dashed border-brand-200 bg-white/50 p-6 text-center text-sm text-slateglass/60">
                  Henüz veri bulunamadı.
                </div>
              ) : (
                unitsQuery.data.map((unit) => (
                  <div key={unit.id} className="rounded-[24px] border border-brand-100 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-200">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-night">{unit.birimAdi}</div>
                        <div className="text-sm text-slateglass/70">{unit.birimKodu}</div>
                      </div>
                      <StatusPill value={unit.aktifPasif ? "Aktif" : "Pasif"} tone={unit.aktifPasif ? "success" : "warning"} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Kullanici Loglari" subtitle="Yeni eklenen endpoint ile login logları okunabilir.">
          <div className="max-h-[360px] overflow-y-auto custom-scrollbar pr-3">
            {(!logsQuery.data || logsQuery.data.length === 0) ? (
              <div className="rounded-[24px] border border-dashed border-brand-200 bg-white/50 p-6 text-center text-sm text-slateglass/60">
                Henüz veri bulunamadı.
              </div>
            ) : (
              logsQuery.data.slice(0, 50).map((log) => (
                <div key={log.id} className="rounded-[24px] border border-brand-100 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><ScrollText size={18} /></div>
                      <div>
                        <div className="font-semibold text-night">{log.kullaniciAdi}</div>
                        <div className="text-xs text-slateglass/70">{formatDateTime(log.islemZamani)}</div>
                      </div>
                    </div>
                    <StatusPill value={log.basariDurumu ? "Başarılı" : "Hatalı"} tone={log.basariDurumu ? "success" : "warning"} />
                  </div>
                  {log.hataBilgisi ? <div className="mt-3 text-sm text-red-600">{log.hataBilgisi}</div> : null}
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
