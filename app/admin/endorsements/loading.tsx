import { PageHeaderSkeleton, CardGridSkeleton } from "@/components/ui/skeletons";

export default function AdminEndorsementsLoading() {
  return (
    <div className="flex w-full flex-col gap-8">
      <PageHeaderSkeleton />
      <CardGridSkeleton count={4} />
    </div>
  );
}
