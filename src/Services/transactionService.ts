import { api } from "./api";

export async function getTransaction() {
    const response = await api.get("/api/transactions");

    return response;
}