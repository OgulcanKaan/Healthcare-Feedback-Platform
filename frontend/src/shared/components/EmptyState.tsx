import { ClipboardList } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-brand-200 bg-white/70 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-mint">
        {icon ?? <ClipboardList size={22} />}
      </div>
      <div className="mt-4 font-display text-xl font-bold text-night dark:text-white">{title}</div>
      <div className="mt-2 text-sm leading-6 text-slateglass/70 dark:text-slate-300">{description}</div>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
