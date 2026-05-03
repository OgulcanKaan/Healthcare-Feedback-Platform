import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/services/api/client";
import { queryKeys } from "@/shared/services/api/queryKeys";

interface UserCommand {
  kullaniciAdi: string;
  sifre: string;
  adSoyad: string;
  birimId: number;
  rolId: number;
  aktifPasif: boolean;
}

interface RoleCommand {
  rolAdi: string;
  aktifPasif: boolean;
}

interface UnitCommand {
  birimKodu: string;
  birimAdi: string;
  aktifPasif: boolean;
}

interface QuestionCommand {
  soruMetni: string;
  soruTipi: string;
  zorunluMu: boolean;
  kategori: string;
  secenekler: Array<{
    secenekMetni: string;
    puanDegeri: number;
  }>;
}

async function createUserRequest(payload: UserCommand) {
  const { data } = await apiClient.post("/Kullanici", {
    KullaniciAdi: payload.kullaniciAdi,
    Sifre: payload.sifre,
    AdSoyad: payload.adSoyad,
    BirimId: payload.birimId,
    RolId: payload.rolId,
    AktifPasif: payload.aktifPasif
  });

  return data;
}

async function createRoleRequest(payload: RoleCommand) {
  const { data } = await apiClient.post("/Rol", {
    RolAdi: payload.rolAdi,
    AktifPasif: payload.aktifPasif
  });

  return data;
}

async function createUnitRequest(payload: UnitCommand) {
  const { data } = await apiClient.post("/Birim", {
    BirimKodu: payload.birimKodu,
    BirimAdi: payload.birimAdi,
    AktifPasif: payload.aktifPasif
  });

  return data;
}

async function createQuestionRequest(payload: QuestionCommand) {
  const { data } = await apiClient.post("/Soru", {
    SoruMetni: payload.soruMetni,
    SoruTipi: payload.soruTipi,
    ZorunluMu: payload.zorunluMu,
    Kategori: payload.kategori,
    Secenekler: payload.secenekler.map((item) => ({
      SecenekMetni: item.secenekMetni,
      PuanDegeri: item.puanDegeri
    }))
  });

  return data;
}

function useInvalidateQueries(keys: readonly (readonly unknown[])[]) {
  const queryClient = useQueryClient();

  return {
    onSuccess: () => {
      keys.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    }
  };
}

export function useCreateUserCommand() {
  return useMutation({
    mutationFn: createUserRequest,
    ...useInvalidateQueries([queryKeys.users, queryKeys.logs])
  });
}

export function useCreateRoleCommand() {
  return useMutation({
    mutationFn: createRoleRequest,
    ...useInvalidateQueries([queryKeys.roles])
  });
}

export function useCreateUnitCommand() {
  return useMutation({
    mutationFn: createUnitRequest,
    ...useInvalidateQueries([queryKeys.units])
  });
}

export function useCreateQuestionCommand() {
  return useMutation({
    mutationFn: createQuestionRequest,
    ...useInvalidateQueries([queryKeys.questions])
  });
}
