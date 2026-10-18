import { useEffect, useState } from "react";
import { getMonthlySpending } from "../Services/dashboardService";
import type { MonthlySpending } from "../Types/dashboard";

export function useMonthlySpending() {
  const [data, setData] = useState<MonthlySpending[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
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
  }, []);

  return { data, isLoading: data === null && error === null, error };
}
