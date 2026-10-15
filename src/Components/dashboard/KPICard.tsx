import { TrendingDown, TrendingUp } from "lucide-react";

export default function KPICard({
  label,
  value,
  change,
  positive,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: accent + "1A" }}
        >
          <Icon size={17} style={{ color: accent }} strokeWidth={2} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <div
        className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-600" : "text-red-500"}`}
      >
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {change}
      </div>
    </div>
  );
}
