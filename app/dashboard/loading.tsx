import {
  PageHeaderSkeleton,
  StatGridSkeleton,
  ListSkeleton,
} from "@/components/ui/skeletons";

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeaderSkeleton />
      <StatGridSkeleton count={3} />
      <ListSkeleton rows={3} />
    </div>
  );
}
