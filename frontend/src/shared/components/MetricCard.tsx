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
    <article className="glass-panel overflow-hidden rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slateglass/65 dark:text-slate-300">{label}</div>
        {icon && <div className="rounded-lg bg-brand-50 p-2 text-brand-700 dark:bg-slate-800 dark:text-mint">{icon}</div>}
      </div>
      <div className={`mt-4 bg-gradient-to-r ${accent} bg-clip-text font-display text-5xl font-black text-transparent`}>{value}</div>
      <div className="mt-2 text-sm leading-6 text-slateglass/70 dark:text-slate-300">{hint}</div>
    </article>
  );
}
