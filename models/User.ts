import { Schema, model, models, type Model } from "mongoose";

export type UserRole = "user" | "admin";
export type AuthProvider = "credentials" | "google";

export interface IUser {
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  image?: string;
  bio?: string;
  provider: AuthProvider;
  providerAccountId?: string;
  suspended: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: String,
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },
    image: String,
    bio: { type: String, maxlength: 280 },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    providerAccountId: String,
    suspended: { type: Boolean, default: false },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

// One OAuth account per (provider, subject); credentials users are exempt.
UserSchema.index(
  { provider: 1, providerAccountId: 1 },
  { unique: true, partialFilterExpression: { provider: { $ne: "credentials" } } },
);

export const User: Model<IUser> =
  (models.User as Model<IUser>) || model<IUser>("User", UserSchema);

export default User;
