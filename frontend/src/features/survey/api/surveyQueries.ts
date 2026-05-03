import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/services/api/client";
import { queryKeys } from "@/shared/services/api/queryKeys";
import type { SurveyDetail, SurveySummary } from "@/shared/models/survey";
import { toSurveyDetail, toSurveySummary } from "@/shared/models/survey";
import { asArray } from "@/shared/utils/model";
import type { ApiRecord } from "@/shared/models/common";

async function fetchSurveyList(): Promise<SurveySummary[]> {
  const { data } = await apiClient.get("/Anket");
  return asArray<ApiRecord>(data).map(toSurveySummary);
}

async function fetchSurveyDetail(surveyId: number): Promise<SurveyDetail> {
  const { data } = await apiClient.get(`/Anket/${surveyId}/detay`);
  return toSurveyDetail(data as ApiRecord);
}

export function useSurveyListQuery() {
  return useQuery({
    queryKey: queryKeys.surveys,
    queryFn: fetchSurveyList,
    staleTime: 1000 * 60 * 10
  });
}

export function useSurveyDetailQuery(surveyId: number, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.surveyDetail(surveyId), "detail"],
    queryFn: () => fetchSurveyDetail(surveyId),
    enabled
  });
}
