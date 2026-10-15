import { useEffect, useState } from "react";
import { useUserContext } from "../Context/userContextType";
import {
  getDashboardKpis,
  type DashboardKpis,
} from "../Services/dashboardService";

export function useDashboardKpis() {
  const { user } = useUserContext();
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (user?.id === undefined) return;

    let cancelled = false;
    getDashboardKpis(user.id)
      .then((result) => {
        if (!cancelled) setKpis(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { kpis, isLoading: kpis === null && error === null, error };
}
