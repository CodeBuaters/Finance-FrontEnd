import { useEffect, useState } from "react";
import { useUserContext } from "../Context/userContextType";
import { getFamilyTransactions } from "../Services/familyService";
import { getTransactionsByUserId } from "../Services/transactionService";
import type { DashboardScope } from "../Types/family";
import type { Transaction } from "../Types/transaction";

// Fetches only while `enabled`, so hidden dashboard widgets don't load data.
// scope "family" = transactions of every family member
export function useTransactions(enabled = true, scope: DashboardScope = "me") {
  const { user } = useUserContext();
  const [data, setData] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!enabled || user?.id === undefined) return;

    let cancelled = false;
    (scope === "family" ? getFamilyTransactions() : getTransactionsByUserId(user.id))
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, user?.id, scope]);

  return { data, isLoading: data === null && error === null, error };
}
