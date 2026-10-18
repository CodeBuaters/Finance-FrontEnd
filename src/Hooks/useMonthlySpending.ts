import { useEffect, useState } from "react";
import { getMonthlySpending } from "../Services/dashboardService";
import type { MonthlySpending } from "../Types/dashboard";

// Fetches only while `enabled`, so hidden dashboard widgets don't load data
export function useMonthlySpending(enabled = true) {
  const [data, setData] = useState<MonthlySpending[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    getMonthlySpending()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { data, isLoading: data === null && error === null, error };
}
