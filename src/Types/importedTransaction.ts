import type { Transaction } from "./transaction";

// Shape returned by POST /api/import: parsed from the CSV but not yet saved,
// so it has no id or user.
export type ImportedTransaction = Omit<Transaction, "id" | "user"> & {
  id: null;
};

export type ImportStatus = "categorized" | "needs-review";


export const getImportStatus = (
  transaction: ImportedTransaction,
): ImportStatus =>
  transaction.category && transaction.category.name !== "Other"
    ? "categorized"
    : "needs-review";


/* export const getImportStatus = (
  transaction: ImportedTransaction,
): ImportStatus =>
  transaction.category && transaction.category !== "OTHER"
    ? "categorized"
    : "needs-review"; */