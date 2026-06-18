import { PageHeaderSkeleton, FormSkeleton } from "@/components/ui/skeletons";

export default function AdminProfileLoading() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <PageHeaderSkeleton />
      <FormSkeleton fields={6} />
    </div>
  );
}
