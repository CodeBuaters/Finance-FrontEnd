import type { Transaction } from "../Types/transaction";

export const formatSignedAmount = (
  transactionType: Transaction["transactionType"],
  amount: number,
) =>
  `${transactionType === "INCOME" ? "+" : "-"}$${Math.abs(amount).toFixed(2)}`;
