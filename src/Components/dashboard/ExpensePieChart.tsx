import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategorySpending } from "../../Types/dashboard";
import {
  categoryChartOrder,
  categoryColors,
  categoryLabels,
} from "../../Utils/categoryChart";
import { formatCurrency, formatWholeCurrency } from "../../Utils/currency";

type Slice = { name: string; value: number; fill: string };

function SliceTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: Slice }>;
  total: number;
}) {
  const slice = payload?.[0]?.payload;
  if (!active || !slice) return null;

  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-slate-800">{slice.name}</p>
      <p className="text-slate-500">
        {formatCurrency(slice.value)} · {((slice.value / total) * 100).toFixed(1)}%
      </p>
    </div>
  );
}

export default function ExpensePieChart({
  data,
}: {
  data: CategorySpending[];
}) {
  const slices: Slice[] = data
    .filter(({ total }) => total > 0)
    .sort(
      (a, b) =>
        categoryChartOrder.indexOf(a.category) -
        categoryChartOrder.indexOf(b.category),
    )
    .map(({ category, total }) => ({
      name: categoryLabels[category],
      value: total,
      fill: categoryColors[category],
    }));
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4">
        Expenses by Category
      </h3>

      {slices.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          No expenses this month yet.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="h-[220px] w-[220px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="72%"
                  outerRadius="100%"
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  // Sweeps the ring in on load; "auto" skips it when the user prefers reduced motion
                  isAnimationActive="auto"
                  animationBegin={0}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
                <Tooltip content={<SliceTooltip total={total} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="w-full flex-1 space-y-2.5">
            {slices.map((slice, index) => (
              <li
                key={slice.name}
                // Rows fade in one after another while the ring sweeps in
                className="flex items-center justify-between gap-4 text-sm animate-[legend-in_400ms_ease-out_both] motion-reduce:animate-none"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span className="flex items-center gap-3 text-slate-600">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: slice.fill }}
                  />
                  {slice.name}
                </span>
                <span className="font-bold text-slate-800">
                  {formatWholeCurrency(slice.value)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
