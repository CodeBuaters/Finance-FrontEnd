import { useEffect, useState } from "react";
import { getMonthlySpending } from "../Services/dashboardService";
import type { MonthlySpending } from "../Types/dashboard";
import type { DashboardScope } from "../Types/family";

// Fetches only while `enabled`, so hidden dashboard widgets don't load data
export function useMonthlySpending(enabled = true, scope: DashboardScope = "me") {
  const [data, setData] = useState<MonthlySpending[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    getMonthlySpending(scope)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, scope]);

  return { data, isLoading: data === null && error === null, error };
}
