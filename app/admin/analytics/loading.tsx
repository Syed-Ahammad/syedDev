import {
  PageHeaderSkeleton,
  StatGridSkeleton,
  ChartSkeleton,
} from "@/components/ui/skeletons";

export default function AdminAnalyticsLoading() {
  return (
    <div className="flex w-full flex-col gap-8">
      <PageHeaderSkeleton />
      <StatGridSkeleton count={4} />
      <ChartSkeleton />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
