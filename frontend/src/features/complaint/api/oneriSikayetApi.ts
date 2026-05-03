import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/services/api/client";
import { queryKeys } from "@/shared/services/api/queryKeys";
import type { ComplaintRecord } from "@/shared/models/dashboard";
import { toComplaintRecord } from "@/shared/models/dashboard";
import { asArray } from "@/shared/utils/model";
import type { ApiRecord } from "@/shared/models/common";

export interface OneriSikayetPayload {
  tip: "Sikayet" | "Oneri";
  mesaj: string;
  gonderenAd?: string;
  birimId?: number;
  oturumId?: number;
}

async function submitOneriSikayet(payload: OneriSikayetPayload): Promise<void> {
  await apiClient.post("/OneriSikayet", {
    Tip: payload.tip,
    Mesaj: payload.mesaj,
    GonderenAd: payload.gonderenAd || null,
    BirimId: payload.birimId ?? 1,
    OturumId: payload.oturumId ?? 0
  });
}

async function fetchOneriSikayetList(tip?: string): Promise<ComplaintRecord[]> {
  const { data } = await apiClient.get("/OneriSikayet", {
    params: tip ? { tip } : undefined
  });
  return asArray<ApiRecord>(data).map(toComplaintRecord);
}

async function updateDurum(payload: { id: number; durum: string }): Promise<void> {
  await apiClient.patch(`/OneriSikayet/${payload.id}/durum`, { Durum: payload.durum });
}

export function useSubmitOneriSikayetCommand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitOneriSikayet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.oneriSikayetRoot });
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
}

export function useOneriSikayetListQuery(tip?: string) {
  return useQuery({
    queryKey: queryKeys.oneriSikayet(tip),
    queryFn: () => fetchOneriSikayetList(tip),
    staleTime: 0,
    refetchInterval: 10000
  });
}

export function useUpdateDurumCommand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDurum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.oneriSikayetRoot });
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
}
