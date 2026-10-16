import { useState, useEffect } from "react";
import { getTransactionsByUserId, updateTransactionCategory } from "../Services/transactionService";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../Services/categoryService";
import type { Transaction } from "../Types/transaction";
import type { Category } from "../Types/category";
import { useUserContext } from "../Context/userContextType";



export default function CategoriesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useUserContext();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });

    if (user?.id === undefined) return;

    getTransactionsByUserId(user.id).then((data) => {
      console.log("Transactions response:", data)
      setTransactions(data);
    });
  }, []);


  async function handleAddCategory() {
    const name = newCategoryName.trim();

    if (!name) return;

    try {
      setIsAddingCategory(true);

      const createdCategory = await createCategory(name);

      setCategories((currentCategories) => [
        ...currentCategories,
        createdCategory,
      ]);

      setNewCategoryName("");

    } catch (error) {
      console.error("Category creation failed:", error);
    } finally {
      setIsAddingCategory(false);
    }
  }

  async function handleUpdateCategory() {
    if (editingCategoryId === null) return;

    const name = editingCategoryName.trim();
    if (!name) return;

    try {
      const updatedCategory = await updateCategory(editingCategoryId, name);

      setCategories((currentCategories) => currentCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category));

      setEditingCategoryId(null);
      setEditingCategoryName("");
    } catch (error) {
      console.error("Category update failed:", error);
    }
  }

  async function handleDeleteCategory(categoryId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this catgory?"
    );

    if (!confirmed) return;

    try {
      await deleteCategory(categoryId);

      setCategories((currentCategories) =>
        currentCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Category deletion failed:", error);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6">
      <h1 className="text-xl font-semibold text-slate-900 mb-5">
        Categories
      </h1>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          Your categories
        </h2>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleAddCategory();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            placeholder="Enter category name"
            className="flex-1 min-w-0 rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={isAddingCategory || !newCategoryName.trim()}
            className="shrink-0 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAddingCategory ? "Adding..." : "Add category"}
          </button>
        </form>
        <div className="flex flex-wrap gap-3 mt-5">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2"
            >
              {editingCategoryId === category.id ? (
                <>
                  <input
                    type="text"
                    value={editingCategoryName}
                    onChange={(event) => setEditingCategoryName(event.target.value)}
                    className="w-36 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                  />

                  <button
                    type="button"
                    onClick={handleUpdateCategory}
                    className="text-sm font-medium text-green-700 hover:text-green-800"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategoryId(null);
                      setEditingCategoryName("");
                    }}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm text-slate-700">
                    {category.name}
                  </span>

                  {!category.default && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategoryId(category.id);
                          setEditingCategoryName(category.name);
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>


      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50/60 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-slate-400">
                Merchant
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-slate-400">
                Amount
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-slate-400">
                Date
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-slate-400">
                Category
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-5 py-4 text-sm font-medium text-slate-800">
                  {transaction.merchant}
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                  {transaction.amount}
                </td>

                <td className="px-5 py-4 text-xs text-slate-500">
                  {transaction.transactionDate}
                </td>

                <td className="px-5 py-4">
                  <select
                    value={transaction.category?.id ?? ""}
                    onChange={async (event) => {
                      const categoryId = Number(event.target.value);

                      try {
                        const updatedTransaction = await updateTransactionCategory(
                          transaction.id,
                          categoryId,
                        );

                        setTransactions((currentTransactions) =>
                          currentTransactions.map((item) =>
                            item.id === updatedTransaction.id ? updatedTransaction : item,
                          ),
                        );

                        console.log("Category updated:", updatedTransaction);
                      } catch (error) {
                        console.error("Category update failed:", error);
                      }
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-700"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
