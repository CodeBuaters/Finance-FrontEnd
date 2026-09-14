import { useMemo, useState } from "react";
import type { Category } from "../Types/category";
import type { Transaction } from "../Types/transaction";
import TransactionTable from "../Components/navigation/transactions/TransactionsTable";
import TransactionsPagination from "../Components/navigation/transactions/TransactionsPagination";
import TransactionsToolbar from "../Components/navigation/transactions/TransactionsToolbar";

type TransactionFilter = "ALL" | Transaction["type"];

const transactionUser = {
  username: "sofia",
  firstName: "Sofia",
  lastName: "Larsson",
  email: "sofia@example.com",
};
const transactionFixtures: Array<
  [string, string, string, Category, number, Transaction["type"]]
> = [
  [
    "2024-08-28",
    "Whole Foods Market",
    "Weekly groceries",
    "FOOD",
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
  [
    "2024-08-17",
    "Savings Account",
    "Monthly transfer",
    "TRANSFER",
    -300,
    "TRANSFER",
  ],
];

const transactions: Transaction[] = transactionFixtures.map(
  (
    [transactionDate, merchant, description, category, amount, type],
    index,
  ) => ({
    id: `transaction-${index + 1}`,
    transactionDate,
    merchant,
    description,
    category,
    amount,
    type,
    user: transactionUser,
  }),
);

export default function TransactionsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TransactionFilter>("ALL");
  const [category, setCategory] = useState("All");
  const categories = [
    ...new Set(
      transactions
        .map(({ category: itemCategory }) => itemCategory)
        .filter(
          (itemCategory): itemCategory is Category =>
            itemCategory !== undefined,
        ),
    ),
  ];
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
      <TransactionsToolbar
        query={query}
        type={type}
        category={category}
        categories={categories}
        onQueryChange={setQuery}
        onTypeChange={setType}
        onCategoryChange={setCategory}
      />
      <TransactionTable transactions={filteredTransactions} />
      <TransactionsPagination count={filteredTransactions.length} />
    </section>
  );
}
