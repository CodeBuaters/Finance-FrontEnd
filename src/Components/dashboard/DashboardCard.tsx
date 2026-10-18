import type { ReactNode } from "react";

// Shared shell for every dashboard widget, so widgets look the same and can be
// rearranged freely once the dashboard becomes customizable.
export default function DashboardCard({
  title,
  action,
  children,
}: {
  title: ReactNode;
  // Optional element on the right side of the header, e.g. a "See all" link
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-slate-100">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
