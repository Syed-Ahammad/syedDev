import { PageHeaderSkeleton, CardGridSkeleton } from "@/components/ui/skeletons";

export default function BookmarksLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeaderSkeleton />
      <CardGridSkeleton count={6} />
    </div>
  );
}
