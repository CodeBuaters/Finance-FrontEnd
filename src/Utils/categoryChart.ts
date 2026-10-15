import type { Category } from "../Types/category";

// Fixed order and colour per category, so a category keeps its colour no matter
// which others are present. The first seven are ordered so neighbouring slices
// stay distinguishable (also with colour blindness); the rest are rarer expenses.
export const categoryChartOrder: Category[] = [
  "FOOD",
  "HOUSING",
  "HEALTHCARE",
  "TRANSPORTATION",
  "SHOPPING",
  "UTILITIES",
  "ENTERTAINMENT",
  "EDUCATION",
  "PERSONAL_CARE",
  "TRAVEL",
  "SALARY",
  "OTHER",
];

// Same hues as TransactionCategoryBadge
export const categoryColors: Record<Category, string> = {
  FOOD: "#f59e0b",
  HOUSING: "#8b5cf6",
  HEALTHCARE: "#14b8a6",
  TRANSPORTATION: "#3b82f6",
  SHOPPING: "#f97316",
  UTILITIES: "#6366f1",
  ENTERTAINMENT: "#ec4899",
  EDUCATION: "#06b6d4",
  PERSONAL_CARE: "#d946ef",
  TRAVEL: "#0ea5e9",
  SALARY: "#10b981",
  OTHER: "#94a3b8",
};

export const categoryLabels: Record<Category, string> = {
  FOOD: "Food & Dining",
  HOUSING: "Housing",
  HEALTHCARE: "Healthcare",
  TRANSPORTATION: "Transport",
  SHOPPING: "Shopping",
  UTILITIES: "Utilities",
  ENTERTAINMENT: "Entertainment",
  EDUCATION: "Education",
  PERSONAL_CARE: "Personal Care",
  TRAVEL: "Travel",
  SALARY: "Salary",
  OTHER: "Other",
};
