import { Schema, model, models, type Model } from "mongoose";

export interface IBlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  tag?: string;
  body: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: String,
    coverImage: String,
    tag: { type: String, index: true },
    body: { type: String, required: true },
    published: { type: Boolean, default: false, index: true },
    publishedAt: Date,
  },
  { timestamps: true },
);

export const BlogPost: Model<IBlogPost> =
  (models.BlogPost as Model<IBlogPost>) ||
  model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
