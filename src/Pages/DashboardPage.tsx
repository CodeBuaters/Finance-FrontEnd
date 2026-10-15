import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import KPICard from "../Components/dashboard/KPICard";
import { useUserContext } from "../Context/userContextType";
import { useDashboardKpis } from "../Hooks/useDashboardKpis";
import {
  formatChangePercent,
  type KpiValue,
} from "../Services/dashboardService";
import { formatCurrency } from "../Utils/currency";

// For expenses a decrease is the good direction, so the trend colour is flipped
const getTrend = (kpi: KpiValue, lowerIsBetter = false) =>
  kpi.changePercent === null
    ? undefined
    : lowerIsBetter
      ? kpi.changePercent <= 0
      : kpi.changePercent >= 0;

export default function DashboardPage() {
  const { user } = useUserContext();
  const { kpis, isLoading, error } = useDashboardKpis();

  return (
    <section className="mx-auto max-w-[1100px]">
      <div className="mb-6">
        <p className="mb-1 text-xs font-medium text-slate-400">Overview</p>
        <h2 className="text-[25px] font-bold tracking-[-0.04em] text-slate-950">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
        </h2>
      </div>

      {error ? (
        <p className="text-sm text-red-500">Could not load dashboard data.</p>
      ) : isLoading || !kpis ? (
        <p className="text-sm text-slate-400">Loading dashboard…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <KPICard
            label="Total balance"
            value={formatCurrency(kpis.totalBalance.value)}
            change={formatChangePercent(kpis.totalBalance.changePercent)}
            positive={getTrend(kpis.totalBalance)}
            icon={Wallet}
            accent="#3b82f6"
          />
          <KPICard
            label="Monthly income"
            value={formatCurrency(kpis.monthlyIncome.value)}
            change={formatChangePercent(kpis.monthlyIncome.changePercent)}
            positive={getTrend(kpis.monthlyIncome)}
            icon={ArrowUpRight}
            accent="#10b981"
          />
          <KPICard
            label="Monthly expenses"
            value={formatCurrency(kpis.monthlyExpenses.value)}
            change={formatChangePercent(kpis.monthlyExpenses.changePercent)}
            positive={getTrend(kpis.monthlyExpenses, true)}
            icon={ArrowDownRight}
            accent="#ef4444"
          />
        </div>
      )}
    </section>
  );
}
