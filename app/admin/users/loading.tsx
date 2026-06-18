import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/skeletons";

export default function AdminUsersLoading() {
  return (
    <div className="flex w-full flex-col gap-8">
      <PageHeaderSkeleton />
      <TableSkeleton rows={6} />
    </div>
  );
}
