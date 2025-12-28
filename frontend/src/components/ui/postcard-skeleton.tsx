// components/posts/PostCardSkeleton.tsx
import { Skeleton } from "../ui/skeleton";

interface PostCardSkeletonProps {
  style?: React.CSSProperties;
}

export function PostCardSkeleton({ style }: PostCardSkeletonProps) {
  return (
    <div 
      className="w-full border rounded-lg p-6 bg-card animate-fade-in"
      style={style}
    >
      {/* Author info skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>

      {/* Title skeleton */}
      <Skeleton className="h-6 w-3/4 mb-3" />

      {/* Content skeleton */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Comments and time skeleton */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}