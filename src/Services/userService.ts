import { api } from "./api";
import type { User } from "../Types/user";

export async function getUserByEmail(email: string): Promise<User> {
  const response = await api.get<User>(
    `/api/users/email/${encodeURIComponent(email)}`,
  );

  return response.data;
}

export async function getUserById(id: number): Promise<User> {
  const response = await api.get<User>(`/api/users/${id}`);

  return response.data;
}
