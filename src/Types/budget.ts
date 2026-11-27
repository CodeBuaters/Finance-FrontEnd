import type { Category } from "./category";


export interface Budget {
    id: number;
    category: Category;
    amount: number;
    month: string; // "YYYY-MM"
}

export interface BudgetRequest {
    category: {
        id: number;
    };
    amount: number;
    month: string;
}