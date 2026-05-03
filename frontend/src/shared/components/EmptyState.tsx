interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-brand-200 bg-white/70 px-6 py-10 text-center">
      <div className="font-display text-xl font-bold uppercase tracking-wide text-night">{title}</div>
      <div className="mt-2 text-sm text-slateglass/70">{description}</div>
    </div>
  );
}
