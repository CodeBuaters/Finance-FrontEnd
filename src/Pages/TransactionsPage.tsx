import { useMemo, useState } from "react";
import type { Category } from "../Types/category";
import type { Transaction } from "../Types/transaction";
import TransactionTable from "../Components/transactions/TransactionsTable";
import TransactionsPagination from "../Components/transactions/TransactionsPagination";
import TransactionsToolbar from "../Components/transactions/TransactionsToolbar";

type TransactionFilter = "ALL" | Transaction["transactionType"];

type TransactionsPageProps = {
  transactions: Transaction[];
};

export default function TransactionsPage({
  transactions,
}: TransactionsPageProps) {
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
        const matchesType =
          type === "ALL" || transaction.transactionType === type;
        const matchesCategory =
          category === "All" || transaction.category === category;
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
