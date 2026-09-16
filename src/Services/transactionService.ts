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
    `/api/user/${userId}/transactions`,
  );

  return response.data;
}
