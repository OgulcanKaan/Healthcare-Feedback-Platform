import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  hint: string;
  accent?: string;
  icon?: ReactNode;
}

export function MetricCard({ label, value, hint, accent = "from-brand-500 to-brand-300", icon }: MetricCardProps) {
  return (
    <article className="glass-panel overflow-hidden p-5 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slateglass/55">{label}</div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className={`mt-4 bg-gradient-to-r ${accent} bg-clip-text font-display text-5xl font-black text-transparent`}>{value}</div>
      <div className="mt-2 text-sm text-slateglass/70">{hint}</div>
    </article>
  );
}
