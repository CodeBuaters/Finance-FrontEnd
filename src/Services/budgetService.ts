import type { Budget, BudgetRequest } from "../Types/budget";
import type { CategorySpending } from "../Types/dashboard";
import { api } from "./api";


export async function getExpensesByCategoryForMonth(
    month: string,
): Promise<CategorySpending[]> {
    const response = await api.get<CategorySpending[]>(
        "/api/dashboard/categories",
        {
            params: { month },
        },
    );

    return response.data.map((category) => ({
        ...category,
        total: Math.abs(category.total),
    }));
}

export async function getBudgets(): Promise<Budget[]> {
    const response = await api.get<Budget[]>("/api/budgets");
    return response.data;
}

export async function createBudget(
    budget: BudgetRequest,
): Promise<Budget> {
    const response = await api.post<Budget>("/api/budgets", budget);
    return response.data;
}

export async function updateBudget(
    id: number,
    budget: BudgetRequest,
): Promise<Budget> {
    const response = await api.put<Budget>(`/api/budgets/${id}`, budget);
    return response.data;
}

export async function deleteBudget(id: number): Promise<void> {
    await api.delete(`/api/budgets/${id}`);
}