"use client";

import { useState } from "react";
import { BlogForm } from "./BlogForm";
import { BlogTable } from "./BlogTable";
import type { AdminBlogItem } from "@/lib/blog";

type Props = {
  posts: AdminBlogItem[];
};

// Coordinates the create/edit form with the table so "Edit" can prefill it.
export function BlogManager({ posts }: Props) {
  const [editing, setEditing] = useState<AdminBlogItem | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <BlogForm
        key={editing?.id ?? "new"}
        editing={editing}
        onClose={() => setEditing(null)}
      />
      <BlogTable posts={posts} onEdit={setEditing} />
    </div>
  );
}
