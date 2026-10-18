import { useEffect, useState } from "react";
import { useUserContext } from "../Context/userContextType";
import { getTransactionsByUserId } from "../Services/transactionService";
import type { Transaction } from "../Types/transaction";

export function useTransactions() {
  const { user } = useUserContext();
  const [data, setData] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (user?.id === undefined) return;

    let cancelled = false;
    getTransactionsByUserId(user.id)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { data, isLoading: data === null && error === null, error };
}
