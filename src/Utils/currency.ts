import type { Transaction } from "../Types/transaction";

export const formatSignedAmount = (
  transactionType: Transaction["transactionType"],
  amount: number,
) =>
  `${transactionType === "INCOME" ? "+" : "-"}$${Math.abs(amount).toFixed(2)}`;

export const formatCurrency = (amount: number) =>
  `${amount < 0 ? "-" : ""}$${Math.abs(amount).toFixed(2)}`;

// Income adds to the balance, expenses subtract from it and transfers keep
// their sign (positive = money in, negative = money out)
export const getSignedAmount = (
  transaction: Pick<Transaction, "transactionType" | "amount">,
) => {
  switch (transaction.transactionType) {
    case "INCOME":
      return Math.abs(transaction.amount);
    case "EXPENSE":
      return -Math.abs(transaction.amount);
    default:
      return transaction.amount;
  }
};

// Whole dollars for compact chart legends, e.g. "$1800"
export const formatWholeCurrency = (amount: number) =>
  `${amount < 0 ? "-" : ""}$${Math.round(Math.abs(amount))}`;
