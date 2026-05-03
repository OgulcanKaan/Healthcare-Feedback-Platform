export const queryKeys = {
  auth: ["auth"] as const,
  surveys: ["surveys"] as const,
  surveyDetail: (surveyId: number) => ["surveys", surveyId] as const,
  dashboard: (startDate?: string, endDate?: string) => ["dashboard", startDate ?? "all", endDate ?? "all"] as const,
  unitReports: (startDate?: string, endDate?: string) => ["unit-reports", startDate ?? "all", endDate ?? "all"] as const,
  complaints: ["complaints"] as const,
  oneriSikayetRoot: ["oneri-sikayet"] as const,
  oneriSikayet: (tip?: string) => ["oneri-sikayet", tip ?? "all"] as const,
  users: ["users"] as const,
  logs: ["logs"] as const,
  roles: ["roles"] as const,
  units: ["units"] as const,
  questions: ["questions"] as const
};
