import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSaveSurveyCommand } from "@/features/survey/api/surveyCommands";
import { useSurveyDetailQuery } from "@/features/survey/api/surveyQueries";
import { SurveyForm } from "@/features/survey/components/SurveyForm";
import { LoadingState } from "@/shared/components/LoadingState";
import type { SurveyFormValues } from "@/shared/models/survey";
import { toSurveyFormValues } from "@/shared/models/survey";
import { extractApiError } from "@/shared/utils/api";

interface SurveyEditorPageProps {
  mode: "create" | "edit";
}

export function SurveyEditorPage({ mode }: SurveyEditorPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const surveyId = Number(id ?? 0);
  const surveyDetailQuery = useSurveyDetailQuery(surveyId, mode === "edit" && Boolean(surveyId));
  const saveSurveyCommand = useSaveSurveyCommand();
  const [formValues, setFormValues] = useState<SurveyFormValues>(
    toSurveyFormValues({
      id: 0,
      anketAdi: "",
      durum: "Aktif",
      baslangicTarihi: new Date().toISOString(),
      bitisTarihi: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      karsilamaMesaji: "Hoş geldiniz",
      tesekkurMesaji: "Katılımınız için teşekkür ederiz.",
      olusturanKullaniciId: user?.id ?? 1
    })
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (surveyDetailQuery.data) {
      setFormValues(toSurveyFormValues(surveyDetailQuery.data));
    }
  }, [surveyDetailQuery.data]);

  useEffect(() => {
    setFormValues((current) => ({ ...current, olusturanKullaniciId: user?.id ?? current.olusturanKullaniciId ?? 1 }));
  }, [user?.id]);

  async function handleSubmit() {
    setError("");

    try {
      await saveSurveyCommand.mutateAsync({
        surveyId: mode === "edit" ? surveyId : undefined,
        values: formValues
      });
      navigate("/anketler");
    } catch (mutationError) {
      setError(extractApiError(mutationError));
    }
  }

  if (mode === "edit" && surveyDetailQuery.isLoading) {
    return <LoadingState title="Anket detaylari yukleniyor..." />;
  }

  return (
    <SurveyForm
      mode={mode}
      values={formValues}
      detail={surveyDetailQuery.data}
      saving={saveSurveyCommand.isPending}
      error={error}
      onChange={setFormValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/anketler")}
    />
  );
}
