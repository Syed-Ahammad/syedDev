import { Schema, model, models, type Model, type Types } from "mongoose";

export type EndorsementStatus = "pending" | "approved" | "rejected";

export interface IEndorsement {
  userId: Types.ObjectId;
  skill: string;
  text: string;
  status: EndorsementStatus;
  projectId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EndorsementSchema = new Schema<IEndorsement>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    skill: { type: String, required: true, index: true },
    text: { type: String, required: true, minlength: 20, maxlength: 500 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", index: true },
  },
  { timestamps: true },
);

// One endorsement per (user, skill).
EndorsementSchema.index({ userId: 1, skill: 1 }, { unique: true });

export const Endorsement: Model<IEndorsement> =
  (models.Endorsement as Model<IEndorsement>) ||
  model<IEndorsement>("Endorsement", EndorsementSchema);

export default Endorsement;
