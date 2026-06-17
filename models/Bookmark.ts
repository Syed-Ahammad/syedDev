import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IBookmark {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// One bookmark per (user, project).
BookmarkSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export const Bookmark: Model<IBookmark> =
  (models.Bookmark as Model<IBookmark>) ||
  model<IBookmark>("Bookmark", BookmarkSchema);

export default Bookmark;
