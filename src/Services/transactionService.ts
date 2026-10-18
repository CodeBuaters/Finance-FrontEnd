import { api } from "./api";
import type { Transaction } from "../Types/transaction";

export async function getTransaction(): Promise<Transaction[]> {
  const response = await api.get<Transaction[]>("/api/transactions");

  return response.data;
}

export async function getTransactionsByUserId(
  userId: number,
): Promise<Transaction[]> {
  const response = await api.get<Transaction[]>(
    `/api/user/${userId}/transactions`
  );

  return response.data;
}

export async function updateTransactionCategory(
  transactionId: string,
  categoryId: number,
): Promise<Transaction> {
  const response = await api.put<Transaction>(`/api/transactions/${transactionId}/category`, { categoryId },
  );

  return response.data;
}
