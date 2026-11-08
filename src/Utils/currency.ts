import type { Transaction } from "../Types/transaction";

// The 20 most used currencies. Amounts are saved in US dollars, so "rate" is
// how much 1 US dollar is worth in that currency (approximate, fixed values).
export const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.86 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.75 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 150 },
  { code: "CNY", name: "Chinese Yuan", symbol: "CN¥", rate: 7.15 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.8 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.38 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.53 },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", rate: 1.7 },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", rate: 7.8 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.29 },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", rate: 9.5 },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", rate: 10.1 },
  { code: "KRW", name: "South Korean Won", symbol: "₩", rate: 1390 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 87 },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", rate: 18.5 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", rate: 5.4 },
  { code: "ZAR", name: "South African Rand", symbol: "R", rate: 17.6 },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", rate: 3.65 },
  { code: "RON", name: "Romanian Leu", symbol: "lei", rate: 4.37 },
];

// The currency the user picked in Settings (US dollar if nothing was picked)
export const getCurrency = () =>
  CURRENCIES.find((c) => c.code === localStorage.getItem("currency")) ??
  CURRENCIES[0];

export const saveCurrency = (code: string) =>
  localStorage.setItem("currency", code);

// Converts a dollar amount to the chosen currency and adds its symbol,
// e.g. 10 -> "€8.60". Word symbols get a space: "lei 43.70"
const toMoney = (amount: number, decimals: number) => {
  const { symbol, rate } = getCurrency();
  const space = /[a-z]$/i.test(symbol) ? " " : "";
  return `${symbol}${space}${(Math.abs(amount) * rate).toFixed(decimals)}`;
};

export const formatSignedAmount = (
  transactionType: Transaction["transactionType"],
  amount: number,
) => `${transactionType === "INCOME" ? "+" : "-"}${toMoney(amount, 2)}`;

export const formatCurrency = (amount: number) =>
  `${amount < 0 ? "-" : ""}${toMoney(amount, 2)}`;

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

// No decimals, for compact chart legends, e.g. "$1800"
export const formatWholeCurrency = (amount: number) =>
  `${amount < 0 ? "-" : ""}${toMoney(amount, 0)}`;
