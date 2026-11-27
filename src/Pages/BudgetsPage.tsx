import { useState, useEffect } from "react";
import type { Budget } from "../Types/budget";
import { getBudgets, getExpensesByCategoryForMonth, createBudget, updateBudget, deleteBudget } from "../Services/budgetService";
import type { CategorySpending } from "../Types/dashboard";
import { getCategoryColor } from "../Utils/categoryChart";
import { getCategories } from "../Services/categoryService";
import type { Category } from "../Types/category";


export default function BudgetsPage() {

  const now = new Date();

  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expenses, setExpenses] = useState<CategorySpending[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingBudgetId, setEditingBudgetId] = useState<number | null>(null);


  const monthlyBudgets = budgets.filter(
    (budget) => budget.month === selectedMonth,
  );

  const budgetCards = monthlyBudgets.map((budget) => {
    const expense = expenses.find(
      (item) => item.category.id === budget.category.id,
    );

    const spent = expense?.total ?? 0;
    const remaining = budget.amount - spent;
    const percentage = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
    const overBudget = spent > budget.amount;

    return {
      ...budget,
      spent,
      remaining,
      percentage,
      overBudget,
    };
  });

  useEffect(() => {
    async function loadExpenses() {
      try {
        const data = await getExpensesByCategoryForMonth(selectedMonth);
        setExpenses(data);
      } catch (error) {
        console.error("Failed to load monthly expenses:", error);
      }
    }

    loadExpenses();
  }, [selectedMonth]);

  useEffect(() => {
    async function loadBudgets() {
      try {
        setIsLoading(true);
        setError(false);

        const data = await getBudgets();
        setBudgets(data);
      } catch (error) {
        console.error("Failed to load budgets:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadBudgets();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }

    loadCategories();
  }, []);


  async function handleCreateBudget() {
    // Check that category and amount have been selected
    if (!selectedCategoryId || !budgetAmount) {
      alert("Please select a category and enter an amount.");
      return;
    }

    const amount = Number(budgetAmount);

    // Check that the amount is positive
    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }

    try {
      const budgetData = {
        category: {
          id: Number(selectedCategoryId),
        },
        amount: amount,
        month: selectedMonth,
      };

      if (editingBudgetId !== null) {
        // Update existing budget
        const updatedBudget = await updateBudget(
          editingBudgetId,
          budgetData,
        );

        setBudgets((previousBudgets) =>
          previousBudgets.map((budget) =>
            budget.id === editingBudgetId ? updatedBudget : budget,
          ),
        );
      } else {
        // Create a new budget
        const newBudget = await createBudget(budgetData);

        setBudgets((previousBudgets) => [
          ...previousBudgets,
          newBudget,
        ]);
      }

      // Close modal and reset form
      setIsModalOpen(false);
      setSelectedCategoryId("");
      setBudgetAmount("");
      setEditingBudgetId(null);

    } catch (error) {
      console.error("Failed to save budget:", error);
      alert("Failed to save budget. Please try again.");
    }
  }

  function handleEditBudget(budget: Budget) {
    setEditingBudgetId(budget.id);
    setSelectedCategoryId(String(budget.category.id));
    setBudgetAmount(String(budget.amount));
    setIsModalOpen(true);
  }

  async function handleDeleteBudget(budgetId: number) {
    // Ask for confirmation before deleting
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?",
    );

    if (!confirmed) {
      return;
    }
    try {
      await deleteBudget(budgetId);

      // Remove deleted budget from the state
      setBudgets((previousBudgets) =>
        previousBudgets.filter((budget) => budget.id !== budgetId),
      );
    } catch (error) {
      console.error("Failed to delete budget:", error);
      alert("Failed to delete budget. Please try again.");
    }
  }

  return (
    <section className="mx-auto max-w-[1100px]">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Monthly Budgets
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep track of your monthly spending
          </p>

          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingBudgetId(null);
            setSelectedCategoryId("");
            setBudgetAmount("");
            setIsModalOpen(true);
          }}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          + Create Budget
        </button>
      </div>

      {/* Loading and error states */}
      {isLoading ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Loading budgets...
        </p>
      ) : error ? (
        <p className="py-10 text-center text-sm text-red-500">
          Failed to load budgets.
        </p>
      ) : budgetCards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h3 className="font-semibold text-slate-800">
            No budgets for this month
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Create a budget to start tracking your expenses.
          </p>
        </div>
      ) : (
        /* Budget cards */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgetCards.map((budget) => (
            <div
              key={budget.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              {/* Category */}
              <div className="mb-5 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold"
                  style={{
                    backgroundColor: `${getCategoryColor(budget.category)}20`,
                    color: getCategoryColor(budget.category),
                  }}
                >
                  {budget.category.name.charAt(0)}
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {budget.category.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    Monthly budget
                  </p>
                </div>
              </div>

              {/* Spending information */}
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Spent
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {budget.spent.toFixed(2)} €
                </span>
              </div>

              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Budget limit
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {budget.amount.toFixed(2)} €
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${budget.overBudget ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  style={{ width: `${budget.percentage}%` }}
                />
              </div>

              {/* Remaining or over budget */}
              <p
                className={`text-xs font-medium ${budget.overBudget ? "text-red-500" : "text-emerald-600"
                  }`}
              >
                {budget.overBudget
                  ? `Over budget by ${Math.abs(budget.remaining).toFixed(2)} €`
                  : `${budget.remaining.toFixed(2)} € remaining`}
              </p>

              {/* Edit and delete button */}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEditBudget(budget)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteBudget(budget.id)}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        </div>
      )}



      {/* Create / Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingBudgetId !== null ? "Edit Budget" : "Create Budget"}
              </h3>

              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingBudgetId(null);
                  setSelectedCategoryId("");
                  setBudgetAmount("");
                }}
                className="text-xl text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={selectedCategoryId}
                  onChange={(event) => setSelectedCategoryId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Monthly budget (€)
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={budgetAmount}
                  onChange={(event) => setBudgetAmount(event.target.value)}
                  placeholder="e.g. 300"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingBudgetId(null);
                  setSelectedCategoryId("");
                  setBudgetAmount("");
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateBudget}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                {editingBudgetId !== null ? "Save Changes" : "Create Budget"}
              </button>
            </div>

          </div>
        </div>
      )}



    </section>
  );

}
