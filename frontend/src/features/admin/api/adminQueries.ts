import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/services/api/client";
import { queryKeys } from "@/shared/services/api/queryKeys";
import type { QuestionBankRecord, RoleRecord, UnitRecord, UserLogRecord, UserRecord } from "@/shared/models/admin";
import { toQuestionBankRecord, toRoleRecord, toUnitRecord, toUserLogRecord, toUserRecord } from "@/shared/models/admin";
import { asArray } from "@/shared/utils/model";
import type { ApiRecord } from "@/shared/models/common";

async function fetchUsers(): Promise<UserRecord[]> {
  const { data } = await apiClient.get("/Kullanici");
  return asArray<ApiRecord>(data).map(toUserRecord);
}

async function fetchLogs(): Promise<UserLogRecord[]> {
  const { data } = await apiClient.get("/Kullanici/loglar");
  return asArray<ApiRecord>(data).map(toUserLogRecord);
}

async function fetchRoles(): Promise<RoleRecord[]> {
  const { data } = await apiClient.get("/Rol");
  return asArray<ApiRecord>(data).map(toRoleRecord);
}

async function fetchUnits(): Promise<UnitRecord[]> {
  const { data } = await apiClient.get("/Birim");
  return asArray<ApiRecord>(data).map(toUnitRecord);
}

async function fetchQuestions(): Promise<QuestionBankRecord[]> {
  const { data } = await apiClient.get("/Soru");
  return asArray<ApiRecord>(data).map(toQuestionBankRecord);
}

export function useUsersQuery() {
  return useQuery({ queryKey: queryKeys.users, queryFn: fetchUsers });
}

export function useLogsQuery() {
  return useQuery({ queryKey: queryKeys.logs, queryFn: fetchLogs, staleTime: 1000 * 60 });
}

export function useRolesQuery() {
  return useQuery({ queryKey: queryKeys.roles, queryFn: fetchRoles });
}

export function useUnitsQuery() {
  return useQuery({ queryKey: queryKeys.units, queryFn: fetchUnits, staleTime: 1000 * 60 * 15 });
}

export function useQuestionsQuery() {
  return useQuery({ queryKey: queryKeys.questions, queryFn: fetchQuestions });
}
