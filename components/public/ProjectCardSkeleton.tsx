import { Skeleton } from "@/components/ui/Skeleton";

export function ProjectCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full min-h-[260px] flex-col gap-5 rounded-2xl border border-border bg-surface p-6"
    >
      <div className="flex items-start justify-between">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-20" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>

      <div className="mt-auto flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}
