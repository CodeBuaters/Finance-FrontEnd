import type { RegisterRequest } from "../Types/registerRequest";
import type { LoginRequest } from "../Types/loginRequest";
import { api, setAccessToken } from "./api";

export async function registerUser(data: RegisterRequest) {
    const response = await api.post("/api/auth/register", data)

    return response;
}

export async function loginUser(data: LoginRequest) {
    const response = await api.post("/api/auth/login", data)

    setAccessToken(response.data.accessToken);

    return response;
}