import { api } from "./api";
import type { Family } from "../Types/family";
import type { Transaction } from "../Types/transaction";

// null when the user is not in a family (the backend sends an empty body)
export async function getFamily(): Promise<Family | null> {
  const response = await api.get<Family | "">("/api/family");

  return response.data || null;
}

export async function createFamily(name: string): Promise<Family> {
  const response = await api.post<Family>("/api/family", { name });

  return response.data;
}

export async function joinFamily(code: string): Promise<Family> {
  const response = await api.post<Family>("/api/family/join", { code });

  return response.data;
}

export async function leaveFamily() {
  await api.post("/api/family/leave");
}

// Transactions of every family member
export async function getFamilyTransactions(): Promise<Transaction[]> {
  const response = await api.get<Transaction[]>("/api/family/transactions");

  return response.data;
}
