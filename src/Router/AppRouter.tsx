import { Routes, Route } from "react-router-dom";
import DashboardPage from "../Pages/DashboardPage";
import RegisterPage from "../Pages/RegisterPage";
import TransactionsPage from "../Pages/TransactionsPage";
import BudgetsPage from "../Pages/BudgetsPage";
import SettingsPage from "../Pages/SettingsPage";
import ImportCSVPage from "../Pages/ImportCSVPage";
import LoginPage from "../Pages/LoginPage";
import AuthLayout from "../Layouts/AuthLayout";
import AppLayout from "../Layouts/AppLayout";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/import-csv" element={<ImportCSVPage />} />
      </Route>
    </Routes>
  );
}
