import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const ACCESS_TOKEN_KEY = "FINSIGHT_ACCESS_TOKEN";

export const api = axios.create({
  baseURL: API_URL,
});

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
