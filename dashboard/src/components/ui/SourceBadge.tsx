interface SourceBadgeProps {
  source: string;
  confidence?: "high" | "medium_high" | "medium";
}

export default function SourceBadge({ source, confidence }: SourceBadgeProps) {
  const confidenceColor =
    confidence === "high"
      ? "text-nickel-green-400"
      : confidence === "medium_high"
        ? "text-coal-amber-400"
        : confidence === "medium"
          ? "text-coal-amber-500"
          : "text-slate-500";

  return (
    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
      <span>Sumber: {source}</span>
      {confidence && confidence !== "high" && (
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-current/20 ${confidenceColor}`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          Estimasi
        </span>
      )}
    </div>
  );
}
