// components/ui/skeleton.tsx (keep this as is)
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
    />
  );
}