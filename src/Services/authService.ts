import type { RegisterRequest } from "../Types/registerRequest";
import type { LoginRequest } from "../Types/loginRequest";
import { api, setAccessToken } from "./api";

export async function registerUser(data: RegisterRequest) {
  const response = await api.post("/api/auth/register", data);

  return response;
}

export async function loginUser(data: LoginRequest) {
  const response = await api.post("/api/auth/login", data);

  const accessToken = response.data?.accessToken;
  if (typeof accessToken !== "string" || accessToken.length === 0) {
    throw new Error("Invalid email or password");
  }

  setAccessToken(accessToken);

  return response;
}

export async function logoutUser() {
  await api.post("/api/auth/logout");
}
