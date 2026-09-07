import { useMemo, useState } from "react";
import type { Category } from "../Types/category";
import type { Transaction } from "../Types/transaction";

const transactionUser = {
  username: "sofia",
  firstName: "Sofia",
  lastName: "Larsson",
  email: "sofia@example.com",
};

const transactions: Transaction[] = [
  [
    "2024-08-28",
    "Whole Foods Market",
    "Weekly groceries",
    "FOOD",
    [
      "2024-08-17",
      "Savings Account",
      "Monthly transfer",
      "TRANSFER",
      -300,
      "TRANSFER",
    ],
    -84.32,
    "EXPENSE",
  ],
  [
    "2024-08-27",
    "Spotify",
    "Monthly subscription",
    "ENTERTAINMENT",
    -9.99,
    "EXPENSE",
  ],
  ["2024-08-27", "Acme Corp Salary", "August salary", "SALARY", 4200, "INCOME"],
  [
    "2024-08-26",
    "Shell Gas Station",
    "Fuel",
    "TRANSPORTATION",
    -58.4,
    "EXPENSE",
  ],
  ["2024-08-25", "IKEA", "Home furnishings", "SHOPPING", -214.75, "EXPENSE"],
  ["2024-08-24", "Landlord Trust", "August rent", "HOUSING", -1800, "EXPENSE"],
  [
    "2024-08-23",
    "Netflix",
    "Streaming plan",
    "ENTERTAINMENT",
    -15.99,
    "EXPENSE",
  ],
  [
    "2024-08-22",
    "City Pharmacy",
    "Prescription",
    "HEALTHCARE",
    -32.5,
    "EXPENSE",
  ],
  ["2024-08-21", "Uber", "Ride to airport", "TRANSPORTATION", -18.7, "EXPENSE"],
  [
    "2024-08-20",
    "Electric Co.",
    "August electricity",
    "UTILITIES",
    -96,
    "EXPENSE",
  ],
  ["2024-08-19", "Chipotle", "Lunch", "FOOD", -14.8, "EXPENSE"],
  ["2024-08-18", "Amazon", "Office supplies", "SHOPPING", -67.2, "EXPENSE"],
].map(
  (
    [transactionDate, merchant, description, category, amount, type],
    index,
  ) => ({
    id: `transaction-${index + 1}`,
    transactionDate: transactionDate as string,
    merchant: merchant as string,
    description: description as string,
    category: category as Category,
    amount: amount as number,
    type: type as Transaction["type"],
    user: transactionUser,
  }),
);

const categoryTone: Record<Category, string> = {
  FOOD: "bg-amber-100 text-amber-700",
  TRANSPORTATION: "bg-blue-100 text-blue-700",
  HOUSING: "bg-violet-100 text-violet-700",
  UTILITIES: "bg-indigo-100 text-indigo-700",
  ENTERTAINMENT: "bg-pink-100 text-pink-600",
  SHOPPING: "bg-orange-100 text-orange-700",
  HEALTHCARE: "bg-teal-100 text-teal-700",
  EDUCATION: "bg-cyan-100 text-cyan-700",
  SALARY: "bg-emerald-100 text-emerald-700",
  TRAVEL: "bg-sky-100 text-sky-700",
  TRANSFER: "bg-slate-100 text-slate-700",
  OTHER: "bg-gray-100 text-gray-700",
};

const formatAmount = (amount: number) =>
  `${amount > 0 ? "+" : ""}$${Math.abs(amount).toFixed(2)}`;

export default function TransactionsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"ALL" | Transaction["type"]>("ALL");
  const [category, setCategory] = useState("All");
  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const matchesQuery =
          `${transaction.merchant} ${transaction.description ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase());
        const matchesType = type === "ALL" || transaction.type === type;
        const matchesCategory =
          category === "All" || transaction.category === category;
        return matchesQuery && matchesType && matchesCategory;
      }),
    [category, query, type],
  );

  return (
    <section className="mx-auto max-w-[1100px]">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">Overview</p>
          <h2 className="text-[25px] font-bold tracking-[-0.04em] text-slate-950">
            All transactions
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          {filteredTransactions.length} of {transactions.length} transactions
        </p>
      </div>
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)] sm:flex-row">
        <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400">
          <span className="text-base">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full text-[12px] outline-none placeholder:text-slate-400"
            placeholder="Search transactions..."
          />
        </label>
        <select
          value={type}
          onChange={(event) =>
            setType(event.target.value as "ALL" | Transaction["type"])
          }
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-600 outline-none"
        >
          <option value="ALL">All</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
          <option value="TRANSFER">Transfer</option>
        </select>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-600 outline-none"
        >
          <option>All</option>
          {[
            ...new Set(
              transactions.map(({ category: itemCategory }) => itemCategory),
            ),
          ].map((itemCategory) => (
            <option key={itemCategory}>{itemCategory}</option>
          ))}
        </select>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                <th className="px-4 py-3 font-semibold sm:px-5">Date</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Merchant</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Description</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Category</th>
                <th className="px-4 py-3 text-right font-semibold sm:px-5">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="whitespace-nowrap px-4 py-[15px] text-[11px] text-slate-500 sm:px-5">
                    {transaction.transactionDate}
                  </td>
                  <td className="whitespace-nowrap px-4 py-[15px] text-[12px] font-semibold text-slate-800 sm:px-5">
                    {transaction.merchant}
                  </td>
                  <td className="px-4 py-[15px] text-[12px] text-slate-500 sm:px-5">
                    {transaction.description}
                  </td>
                  <td className="px-4 py-[15px] sm:px-5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${categoryTone[transaction.category ?? "OTHER"]}`}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-[15px] text-right text-[12px] font-bold sm:px-5 ${transaction.type === "INCOME" ? "text-emerald-600" : transaction.type === "TRANSFER" ? "text-slate-500" : "text-slate-800"}`}
                  >
                    {formatAmount(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            No transactions match those filters.
          </p>
        )}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[11px] text-slate-400 sm:px-5">
          <span>Showing {filteredTransactions.length} transactions</span>
          <div className="flex items-center gap-1">
            <button className="grid h-7 w-7 place-items-center rounded border border-slate-200 text-slate-400">
              ‹
            </button>
            <button className="grid h-7 w-7 place-items-center rounded bg-emerald-500 text-white">
              1
            </button>
            <button className="grid h-7 w-7 place-items-center rounded border border-slate-200 text-slate-400">
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
