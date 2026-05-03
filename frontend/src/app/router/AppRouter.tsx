import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { AdminManagementPage } from "@/features/admin/pages/AdminManagementPage";
import { ComplaintListPage } from "@/features/complaint/pages/ComplaintListPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { ReportsPage } from "@/features/dashboard/pages/ReportsPage";
import { UnitReportPage } from "@/features/dashboard/pages/UnitReportPage";
import { PublicSurveyPage } from "@/features/survey/pages/PublicSurveyPage";
import { PublicSurveyThankYouPage } from "@/features/survey/pages/PublicSurveyThankYouPage";
import { SurveyEditorPage } from "@/features/survey/pages/SurveyEditorPage";
import { SurveyListPage } from "@/features/survey/pages/SurveyListPage";
import { AppShell } from "@/shared/components/AppShell";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/anket/:id" element={<PublicSurveyPage />} />
      <Route path="/anket/:id/tesekkur/:sessionId" element={<PublicSurveyThankYouPage />} />
      <Route path="/anketler/:id/cevapla" element={<PublicSurveyPage />} />
      <Route
        element={<ProtectedRoute />}
      >
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/anketler" element={<SurveyListPage />} />
          <Route path="/anketler/yeni" element={<SurveyEditorPage mode="create" />} />
          <Route path="/anketler/:id/duzenle" element={<SurveyEditorPage mode="edit" />} />
          <Route path="/raporlar" element={<ReportsPage />} />
          <Route path="/birim-raporu" element={<UnitReportPage />} />
          <Route path="/sikayetler" element={<ComplaintListPage />} />
          <Route element={<ProtectedRoute roles={["Yonetici"]} />}>
            <Route path="/yonetim" element={<AdminManagementPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
