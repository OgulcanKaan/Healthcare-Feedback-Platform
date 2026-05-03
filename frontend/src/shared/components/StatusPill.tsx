interface StatusPillProps {
  value: string;
  tone?: "success" | "warning" | "neutral";
}

const toneMap = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  neutral: "bg-brand-50 text-brand-700 border-brand-100"
};

export function StatusPill({ value, tone = "neutral" }: StatusPillProps) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneMap[tone]}`}>{value}</span>;
}
