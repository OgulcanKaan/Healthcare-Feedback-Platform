import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/services/api/client";
import { queryKeys } from "@/shared/services/api/queryKeys";
import type { ComplaintRecord } from "@/shared/models/dashboard";
import { toComplaintRecord } from "@/shared/models/dashboard";
import { asArray } from "@/shared/utils/model";
import type { ApiRecord } from "@/shared/models/common";

async function fetchComplaints(): Promise<ComplaintRecord[]> {
  const { data } = await apiClient.get("/Rapor/Sikayetler");
  return asArray<ApiRecord>(data).map(toComplaintRecord);
}

export function useComplaintListQuery() {
  return useQuery({
    queryKey: queryKeys.complaints,
    queryFn: fetchComplaints,
    staleTime: 1000 * 60 * 2
  });
}
