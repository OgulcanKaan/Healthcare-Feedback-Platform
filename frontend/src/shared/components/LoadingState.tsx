interface LoadingStateProps {
  title?: string;
}

export function LoadingState({ title = "Veriler yükleniyor..." }: LoadingStateProps) {
  return (
    <div className="glass-panel flex min-h-[320px] items-center justify-center p-10">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-solid border-brand-100 border-t-brand-500" />
        <p className="mt-4 text-sm font-semibold text-slateglass opacity-75">{title}</p>
      </div>
    </div>
  );
}
