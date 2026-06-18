import { PageHeaderSkeleton, FormSkeleton } from "@/components/ui/skeletons";

export default function ProfileLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <PageHeaderSkeleton />
      <FormSkeleton fields={5} />
    </div>
  );
}
