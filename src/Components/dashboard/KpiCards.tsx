import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import {
  formatChangePercent,
  type DashboardKpis,
  type KpiValue,
} from "../../Services/dashboardService";
import { formatCurrency } from "../../Utils/currency";
import KPICard from "./KPICard";

// For expenses a decrease is the good direction, so the trend colour is flipped
const getTrend = (kpi: KpiValue, lowerIsBetter = false) =>
  kpi.changePercent === null
    ? undefined
    : lowerIsBetter
      ? kpi.changePercent <= 0
      : kpi.changePercent >= 0;

// The three KPI cards side by side. Uses a container query, so the cards stack
// when the widget is half width instead of only on small screens.
export default function KpiCards({ kpis }: { kpis: DashboardKpis }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-3">
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
    </div>
  );
}
