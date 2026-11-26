import { useEffect, useState } from "react";
import { getExpensesByCategory } from "../Services/dashboardService";
import type { CategorySpending } from "../Types/dashboard";
import type { DashboardScope } from "../Types/family";

// Fetches only while `enabled`, so hidden dashboard widgets don't load data
export function useExpensesByCategory(enabled = true, scope: DashboardScope = "me") {
  const [data, setData] = useState<CategorySpending[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    getExpensesByCategory(scope)
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
