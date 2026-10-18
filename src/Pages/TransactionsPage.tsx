import { useMemo, useState } from "react";
import type { Category } from "../Types/category";
import type { Transaction } from "../Types/transaction";
import Skeleton from "../Components/common/Skeleton";
import TransactionTable from "../Components/transactions/TransactionsTable";
import TransactionsPagination from "../Components/transactions/TransactionsPagination";
import TransactionsToolbar from "../Components/transactions/TransactionsToolbar";

type TransactionFilter = "ALL" | Transaction["transactionType"];

type TransactionsPageProps = {
  transactions: Transaction[];
  isLoading?: boolean;
  // True when the transactions could not be loaded
  error?: boolean;
};

export default function TransactionsPage({
  transactions,
  isLoading = false,
  error = false,
}: TransactionsPageProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TransactionFilter>("ALL");
  const [category, setCategory] = useState("All");
  // Unique categories for the filter, by id: every transaction has its own category
  // object, and uncategorized transactions have category null
  const categories = [
    ...new Map(
      transactions
        .map(({ category: itemCategory }) => itemCategory)
        .filter((itemCategory): itemCategory is Category => itemCategory != null)
        .map((itemCategory) => [itemCategory.id, itemCategory]),
    ).values(),
  ];
  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const matchesQuery =
          `${transaction.merchant} ${transaction.description ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase());
        const matchesType =
          type === "ALL" || transaction.transactionType === type;
        const matchesCategory =
          category === "All" || String(transaction.category?.id) === category;
        return matchesQuery && matchesType && matchesCategory;
      }),
    [category, query, transactions, type],
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
        {isLoading ? (
          <Skeleton className="h-3 w-28" />
        ) : (
          !error && (
            <p className="animate-content-in text-xs text-slate-400 motion-reduce:animate-none">
              {filteredTransactions.length} of {transactions.length} transactions
            </p>
          )
        )}
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
      <TransactionTable
        transactions={filteredTransactions}
        isLoading={isLoading}
        error={error}
      />
      <TransactionsPagination count={filteredTransactions.length} />
    </section>
  );
}
