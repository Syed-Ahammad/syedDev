import {
  PageHeaderSkeleton,
  FormSkeleton,
  ListSkeleton,
} from "@/components/ui/skeletons";

export default function QuotesLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeaderSkeleton />
      <FormSkeleton fields={5} />
      <ListSkeleton rows={2} />
    </div>
  );
}
