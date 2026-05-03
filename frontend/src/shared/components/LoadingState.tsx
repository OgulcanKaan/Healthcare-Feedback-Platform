interface LoadingStateProps {
  title?: string;
  variant?: "spinner" | "dashboard" | "table";
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/70 ${className}`} />;
}

export function LoadingState({ title = "Veriler yükleniyor...", variant = "spinner" }: LoadingStateProps) {
  if (variant === "dashboard") {
    return (
      <div className="space-y-4">
        <div className="glass-panel p-6">
          <SkeletonBlock className="h-5 w-44" />
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <SkeletonBlock className="h-28" />
            <SkeletonBlock className="h-28" />
            <SkeletonBlock className="h-28" />
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-panel p-6">
            <SkeletonBlock className="h-6 w-52" />
            <SkeletonBlock className="mt-5 h-72" />
          </div>
          <div className="glass-panel p-6">
            <SkeletonBlock className="h-6 w-44" />
            <div className="mt-5 space-y-3">
              <SkeletonBlock className="h-20" />
              <SkeletonBlock className="h-20" />
              <SkeletonBlock className="h-20" />
            </div>
          </div>
        </div>
        <p className="text-sm font-semibold text-slateglass/70 dark:text-slate-300">{title}</p>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="glass-panel p-6">
        <SkeletonBlock className="h-6 w-48" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-14" />
          ))}
        </div>
        <p className="mt-4 text-sm font-semibold text-slateglass/70 dark:text-slate-300">{title}</p>
      </div>
    );
  }

  return (
    <div className="glass-panel flex min-h-[320px] items-center justify-center p-10">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-solid border-brand-100 border-t-brand-500" />
        <p className="mt-4 text-sm font-semibold text-slateglass opacity-75 dark:text-slate-300">{title}</p>
      </div>
    </div>
  );
}
