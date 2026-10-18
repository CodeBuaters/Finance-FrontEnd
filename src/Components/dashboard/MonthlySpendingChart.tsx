import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getRecentMonthlySpending } from "../../Services/dashboardService";
import type { MonthlySpending } from "../../Types/dashboard";
import { formatCurrency, formatWholeCurrency } from "../../Utils/currency";
import { formatMonthLong, formatMonthShort } from "../../Utils/date";
import DashboardCard from "./DashboardCard";

const BAR_COLOR = "#16a34a";

function MonthTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: MonthlySpending }>;
}) {
  const month = payload?.[0]?.payload;
  if (!active || !month) return null;

  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-slate-800">{formatMonthLong(month.month)}</p>
      <p className="text-slate-500">{formatCurrency(month.total)}</p>
    </div>
  );
}

export default function MonthlySpendingChart({
  data,
  maxMonths = 6,
}: {
  data: MonthlySpending[];
  maxMonths?: number;
}) {
  const months = getRecentMonthlySpending(data, maxMonths);

  return (
    <DashboardCard
      title={
        <>
          Monthly Spending
          {months.length > 0 &&
            ` (${months.length} ${months.length === 1 ? "month" : "months"})`}
        </>
      }
    >
      {months.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          No spending in the last {maxMonths} months yet.
        </p>
      ) : (
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={months} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonthShort}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatWholeCurrency}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                width={56}
              />
              <Tooltip
                content={<MonthTooltip />}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar
                dataKey="total"
                fill={BAR_COLOR}
                maxBarSize={24}
                // Rounded top, square at the baseline
                radius={[4, 4, 0, 0]}
                // Bars grow in on load; "auto" skips it when the user prefers reduced motion
                isAnimationActive="auto"
                animationDuration={700}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardCard>
  );
}
