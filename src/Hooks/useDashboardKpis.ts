import { useEffect, useState } from "react";
import {
  calculateDashboardKpis,
  getDashboardSummary,
} from "../Services/dashboardService";
import type { DashboardSummary, MonthlySpending } from "../Types/dashboard";
import type { Transaction } from "../Types/transaction";

type Loaded<T> = { data: T | null; error: unknown };

// Takes the monthly spending and transactions the dashboard already loaded for
// its other widgets, so the KPIs only fetch the summary themselves.
export function useDashboardKpis(
  enabled: boolean,
  monthlySpending: Loaded<MonthlySpending[]>,
  transactions: Loaded<Transaction[]>,
) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryError, setSummaryError] = useState<unknown>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    getDashboardSummary()
      .then((result) => {
        if (!cancelled) setSummary(result);
      })
      .catch((err) => {
        if (!cancelled) setSummaryError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const error = summaryError ?? monthlySpending.error ?? transactions.error;
  const kpis =
    summary && monthlySpending.data && transactions.data
      ? calculateDashboardKpis(summary, monthlySpending.data, transactions.data)
      : null;

  return { kpis, isLoading: kpis === null && error === null, error };
}
