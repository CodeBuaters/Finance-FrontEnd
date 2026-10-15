import { useEffect, useState } from "react";
import { getExpensesByCategory } from "../Services/dashboardService";
import type { CategorySpending } from "../Types/dashboard";

export function useExpensesByCategory() {
  const [data, setData] = useState<CategorySpending[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    getExpensesByCategory()
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
