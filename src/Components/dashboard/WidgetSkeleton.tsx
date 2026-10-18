import type { WidgetConfig } from "../../Types/dashboardLayout";
import { getWidgetDefinition } from "../../Utils/dashboardLayout";
import Skeleton from "../common/Skeleton";
import DashboardCard from "./DashboardCard";

// Bar heights for the spending chart placeholder, so it reads as a bar chart
const barHeights = ["45%", "70%", "55%", "85%", "60%", "75%"];

function KpiSkeleton() {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-slate-100"
          >
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="mb-2 h-7 w-32" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex h-[220px] items-end gap-4 border-b border-slate-100 pl-14">
      {barHeights.map((height, index) => (
        <div key={index} className="flex h-full flex-1 items-end justify-center">
          <Skeleton className="w-6 rounded-t-md rounded-b-none" style={{ height }} />
        </div>
      ))}
    </div>
  );
}

function PieSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      {/* Ring like the donut chart: a white circle over a grey one */}
      <div className="relative grid h-[220px] w-[220px] shrink-0 place-items-center">
        <Skeleton className="absolute inset-0 rounded-full" />
        <div className="relative h-[72%] w-[72%] rounded-full bg-white" />
      </div>
      <ul className="w-full flex-1 space-y-3.5">
        {[0, 1, 2, 3].map((index) => (
          <li key={index} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3.5 w-24" />
            </span>
            <Skeleton className="h-3.5 w-12" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div>
      <div className="flex gap-4 border-b border-slate-100 pb-3">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="ml-auto h-3 w-12" />
      </div>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b border-slate-100 py-3.5 last:border-0"
        >
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="hidden h-5 w-16 rounded-full sm:block" />
          <Skeleton className="ml-auto h-3.5 w-14" />
        </div>
      ))}
    </div>
  );
}

// Placeholder with the same shape as the widget, so nothing jumps when the data arrives
export default function WidgetSkeleton({ widget }: { widget: WidgetConfig }) {
  const { title } = getWidgetDefinition(widget.id);

  return (
    <div role="status" aria-label={`Loading ${title}`}>
      {widget.id === "kpis" ? (
        <KpiSkeleton />
      ) : (
        <DashboardCard title={title}>
          {widget.id === "monthlySpending" ? (
            <ChartSkeleton />
          ) : widget.id === "expensesByCategory" ? (
            <PieSkeleton />
          ) : (
            <TableSkeleton rows={widget.settings.limit ?? 6} />
          )}
        </DashboardCard>
      )}
    </div>
  );
}
