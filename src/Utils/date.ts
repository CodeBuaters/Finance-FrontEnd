// Date-only strings ("YYYY-MM-DD") are parsed as local time so a transaction
// never slips into the neighbouring month because of a UTC offset
export const parseTransactionDate = (value: string) => {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  return new Date(value);
};

export const isSameMonth = (date: Date, reference: Date) =>
  date.getFullYear() === reference.getFullYear() &&
  date.getMonth() === reference.getMonth();

export const getPreviousMonth = (reference: Date) =>
  new Date(reference.getFullYear(), reference.getMonth() - 1, 1);

export const getStartOfMonth = (reference: Date) =>
  new Date(reference.getFullYear(), reference.getMonth(), 1);

// "YYYY-MM" month keys from the backend, parsed as local time like parseTransactionDate
export const parseYearMonth = (value: string) => {
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1, 1);
};

export const formatMonthShort = (value: string) =>
  parseYearMonth(value).toLocaleDateString("en-US", { month: "short" });

export const formatMonthLong = (value: string) =>
  parseYearMonth(value).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

// Compact "MM-DD" date for dashboard tables, e.g. "08-28"
export const formatMonthDay = (value: string) => {
  const date = parseTransactionDate(value);
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
