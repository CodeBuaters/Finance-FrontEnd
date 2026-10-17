import { api } from "./api";
import type { Category } from "../Types/category";


export async function getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>("/api/categories");

    return response.data;
}

export async function createCategory(name: string): Promise<Category> {
    const response = await api.post<Category>("/api/categories", { name });

    return response.data;
}

export async function updateCategory(categoryId: number, name: string): Promise<Category> {
    const response = await api.put<Category>(`/api/categories/${categoryId}`, { name });

    return response.data;
}

export async function deleteCategory(categoryId: number): Promise<void> {
    await api.delete(`/api/categories/${categoryId}`);
}