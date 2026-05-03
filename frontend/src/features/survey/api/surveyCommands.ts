import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/services/api/client";
import { queryKeys } from "@/shared/services/api/queryKeys";
import type { SurveyFormValues, SessionStartCommand, SubmitSurveyCommand, SessionStartResult, SurveyResult, SurveySummary } from "@/shared/models/survey";
import { toSessionStartResult, toSurveyResult, toSurveySummary } from "@/shared/models/survey";
import { unwrapApiData } from "@/shared/utils/api";
import type { ApiRecord } from "@/shared/models/common";

interface SaveSurveyPayload {
  surveyId?: number;
  values: SurveyFormValues;
}

function toSurveyPayload(values: SurveyFormValues) {
  return {
    AnketAdi: values.anketAdi,
    Durum: values.durum,
    BaslangicTarihi: new Date(values.baslangicTarihi).toISOString(),
    BitisTarihi: new Date(values.bitisTarihi).toISOString(),
    KarsilamaMesaji: values.karsilamaMesaji,
    TesekkurMesaji: values.tesekkurMesaji,
    OlusturanKullaniciId: Number(values.olusturanKullaniciId)
  };
}

async function saveSurveyRequest({ surveyId, values }: SaveSurveyPayload): Promise<SurveySummary> {
  const payload = toSurveyPayload(values);
  const response = surveyId
    ? await apiClient.put(`/Anket/${surveyId}`, payload)
    : await apiClient.post("/Anket", payload);

  return toSurveySummary(unwrapApiData<ApiRecord>(response.data));
}

async function deleteSurveyRequest(surveyId: number): Promise<void> {
  await apiClient.delete(`/Anket/${surveyId}`);
}

async function startSurveySessionRequest(payload: SessionStartCommand): Promise<SessionStartResult> {
  const { data } = await apiClient.post("/Oturum/baslat", payload);
  return toSessionStartResult(data as ApiRecord);
}

async function submitSurveyAnswersRequest({ oturumId, payload }: { oturumId: number; payload: SubmitSurveyCommand }): Promise<void> {
  await apiClient.post(`/Oturum/${oturumId}/cevapla`, payload);
}

async function fetchSurveyResultRequest(oturumId: number): Promise<SurveyResult> {
  const { data } = await apiClient.get(`/Oturum/${oturumId}/sonuc`);
  return toSurveyResult(data as ApiRecord);
}

export function useSaveSurveyCommand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSurveyRequest,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.surveys });
      if (variables.surveyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.surveyDetail(variables.surveyId) });
      }
    }
  });
}

export function useDeleteSurveyCommand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSurveyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.surveys });
    }
  });
}

export function useStartSurveySessionCommand() {
  return useMutation({
    mutationFn: startSurveySessionRequest
  });
}

export function useSubmitSurveyAnswersCommand() {
  return useMutation({
    mutationFn: submitSurveyAnswersRequest
  });
}

export function useSurveyResultQuery(oturumId?: number) {
  return useQuery({
    queryKey: ["survey-result", oturumId ?? 0],
    queryFn: () => fetchSurveyResultRequest(oturumId ?? 0),
    enabled: Boolean(oturumId)
  });
}

async function addSurveyQuestionRequest({ surveyId, soruId }: { surveyId: number; soruId: number }): Promise<void> {
  await apiClient.post(`/Anket/${surveyId}/sorular/${soruId}`);
}

async function removeSurveyQuestionRequest({ surveyId, soruId }: { surveyId: number; soruId: number }): Promise<void> {
  await apiClient.delete(`/Anket/${surveyId}/sorular/${soruId}`);
}

export function useAddSurveyQuestionCommand(surveyId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (soruId: number) => addSurveyQuestionRequest({ surveyId, soruId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.surveyDetail(surveyId) });
    }
  });
}

export function useRemoveSurveyQuestionCommand(surveyId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (soruId: number) => removeSurveyQuestionRequest({ surveyId, soruId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.surveyDetail(surveyId) });
    }
  });
}
