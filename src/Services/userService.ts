import { api } from "./api";
import type { User } from "../Types/user";

export async function getUserByEmail(email: string): Promise<User> {
  const response = await api.get<User>(
    `/api/user/email/${encodeURIComponent(email)}`,
  );

  return response.data;
}

export async function getUserById(id: number): Promise<User> {
  const response = await api.get<User>(`/api/user/${id}`);

  return response.data;
}

export async function updateProfile(
  firstName: string,
  lastName: string,
): Promise<User> {
  const response = await api.put<User>("/api/profile", { firstName, lastName });

  return response.data;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  await api.put("/api/profile/password", { currentPassword, newPassword });
}

export async function deleteAccount() {
  await api.delete("/api/profile");
}
