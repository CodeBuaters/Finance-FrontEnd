import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardPage from "../Pages/DashboardPage";
import RegisterPage from "../Pages/RegisterPage";
import TransactionsPageProps from "../Pages/TransactionsPage";
import BudgetsPage from "../Pages/BudgetsPage";
import SettingsPage from "../Pages/SettingsPage";
import ImportCSVPage from "../Pages/ImportCSVPage";
import LoginPage from "../Pages/LoginPage";
import AuthLayout from "../Layouts/AuthLayout";
import AppLayout from "../Layouts/AppLayout";
import { getAccessToken } from "../Services/api";
import type { Transaction } from "../Types/transaction";
import { getTransaction } from "../Services/transactionService";

const isAuthenticated = () => {
  return getAccessToken() !== null;
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

function TransactionsRoute() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransaction().then(setTransactions);
  }, []);

  return <TransactionsPageProps transactions={transactions} />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsRoute />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/import-csv" element={<ImportCSVPage />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to={isAuthenticated() ? "/" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
