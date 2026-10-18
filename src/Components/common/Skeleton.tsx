import type { CSSProperties } from "react";

// Grey placeholder block shown in place of content that is still loading. Size and
// shape come from `className`, so it can match the element it stands in for.
export default function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  // Default corner radius, unless the caller sets its own (e.g. rounded-full)
  const rounded = className.includes("rounded-") ? "" : "rounded-md";

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-slate-200/70 motion-reduce:animate-none ${rounded} ${className}`}
      style={style}
    />
  );
}
