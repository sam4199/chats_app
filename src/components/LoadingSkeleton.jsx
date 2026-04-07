export const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-muted rounded-md ${className}`} />
);

export const PostSkeleton = () => (
  <div className="space-y-3 p-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-64 w-full rounded-lg" />
  </div>
);