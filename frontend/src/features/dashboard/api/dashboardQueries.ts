import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/services/api/client";
import { queryKeys } from "@/shared/services/api/queryKeys";
import type { DashboardSummary, UnitReportItem } from "@/shared/models/dashboard";
import { toDashboardSummary, toUnitReportItem } from "@/shared/models/dashboard";
import { asArray } from "@/shared/utils/model";
import type { ApiRecord } from "@/shared/models/common";

async function fetchDashboard(startDate?: string, endDate?: string): Promise<DashboardSummary> {
  const { data } = await apiClient.get("/Rapor/DashboardOzet", {
    params: {
      baslangicTarihi: startDate || undefined,
      bitisTarihi: endDate || undefined
    }
  });

  return toDashboardSummary(data as ApiRecord);
}

async function fetchUnitReports(startDate?: string, endDate?: string): Promise<UnitReportItem[]> {
  const { data } = await apiClient.get("/Rapor/BirimBazli", {
    params: {
      baslangicTarihi: startDate || undefined,
      bitisTarihi: endDate || undefined
    }
  });

  return asArray<ApiRecord>(data).map(toUnitReportItem);
}

export function useDashboardQuery(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: queryKeys.dashboard(startDate, endDate),
    queryFn: () => fetchDashboard(startDate, endDate),
    staleTime: 0 // Her ziyarette taze veri çek
  });
}

export function useUnitReportsQuery(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: queryKeys.unitReports(startDate, endDate),
    queryFn: () => fetchUnitReports(startDate, endDate),
    staleTime: 0 // Her ziyarette taze veri çek
  });
}
