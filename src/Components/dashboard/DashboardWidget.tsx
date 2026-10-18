import type { DashboardKpis } from "../../Services/dashboardService";
import type { CategorySpending, MonthlySpending } from "../../Types/dashboard";
import type { WidgetConfig } from "../../Types/dashboardLayout";
import type { Transaction } from "../../Types/transaction";
import { getWidgetDefinition } from "../../Utils/dashboardLayout";
import DashboardCard from "./DashboardCard";
import ExpensePieChart from "./ExpensePieChart";
import KpiCards from "./KpiCards";
import MonthlySpendingChart from "./MonthlySpendingChart";
import RecentTransactionsCard from "./RecentTransactionsCard";
import WidgetSkeleton from "./WidgetSkeleton";

type Loaded<T> = { data: T | null; error: unknown };

// Everything the widgets need, fetched once by the dashboard page
export type DashboardData = {
  kpis: Loaded<DashboardKpis>;
  monthlySpending: Loaded<MonthlySpending[]>;
  categorySpending: Loaded<CategorySpending[]>;
  transactions: Loaded<Transaction[]>;
};

// Error state in the widget's own card, so the layout doesn't jump
function WidgetError({ widget }: { widget: WidgetConfig }) {
  const { title } = getWidgetDefinition(widget.id);

  return (
    <DashboardCard title={title}>
      <p className="py-10 text-center text-sm text-red-500">
        Could not load this widget.
      </p>
    </DashboardCard>
  );
}

export default function DashboardWidget({
  widget,
  data,
}: {
  widget: WidgetConfig;
  data: DashboardData;
}) {
  const render = <T,>(loaded: Loaded<T>, content: (value: T) => React.ReactNode) =>
    loaded.data !== null ? (
      // Fades in once loaded, replacing the skeleton
      <div className="animate-content-in motion-reduce:animate-none">
        {content(loaded.data)}
      </div>
    ) : loaded.error ? (
      <WidgetError widget={widget} />
    ) : (
      <WidgetSkeleton widget={widget} />
    );

  switch (widget.id) {
    case "kpis":
      return render(data.kpis, (kpis) => <KpiCards kpis={kpis} />);
    case "monthlySpending":
      return render(data.monthlySpending, (monthlySpending) => (
        <MonthlySpendingChart
          data={monthlySpending}
          maxMonths={widget.settings.months}
        />
      ));
    case "expensesByCategory":
      return render(data.categorySpending, (categorySpending) => (
        <ExpensePieChart data={categorySpending} />
      ));
    case "recentTransactions":
      return render(data.transactions, (transactions) => (
        <RecentTransactionsCard
          transactions={transactions}
          limit={widget.settings.limit}
        />
      ));
  }
}
