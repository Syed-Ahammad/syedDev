import type { QueryFilter } from "mongoose";
import { isValidObjectId } from "mongoose";
import { dbConnect } from "@/lib/db";
import { User, type IUser, type UserRole } from "@/models/User";
import { Bookmark } from "@/models/Bookmark";
import { Endorsement } from "@/models/Endorsement";
import { Project } from "@/models/Project";
import { USER_ROLES, type UserUpdateInput } from "@/lib/validations";
import type { AdminUser } from "@/types";

export const ADMIN_USERS_PAGE_SIZE = 20;

export type UserListParams = {
  role?: UserRole;
  page: number;
};

type UserSource = {
  _id: unknown;
  name: string;
  email: string;
  role: UserRole;
  suspended?: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function toAdminUser(u: UserSource): AdminUser {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.suspended ? "suspended" : "active",
    joinedAt: u.createdAt.toISOString(),
    lastActiveAt: (u.lastLoginAt ?? u.updatedAt ?? u.createdAt).toISOString(),
  };
}

export function parseUserListParams(sp: URLSearchParams): UserListParams {
  const roleRaw = sp.get("role") ?? "";
  const role = (USER_ROLES as readonly string[]).includes(roleRaw)
    ? (roleRaw as UserRole)
    : undefined;
  const page = Math.max(1, Number.parseInt(sp.get("page") ?? "1", 10) || 1);
  return { role, page };
}

export async function fetchAdminUsers(params: UserListParams): Promise<{
  items: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}> {
  await dbConnect();
  const filter: QueryFilter<IUser> = params.role ? { role: params.role } : {};

  const total = await User.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_USERS_PAGE_SIZE));
  const page = Math.min(params.page, totalPages);

  const docs = await User.find(filter)
    .sort({ lastLoginAt: -1, createdAt: -1 })
    .skip((page - 1) * ADMIN_USERS_PAGE_SIZE)
    .limit(ADMIN_USERS_PAGE_SIZE)
    .lean();

  return { items: docs.map(toAdminUser), total, page, totalPages };
}

export async function updateUser(
  id: string,
  patch: UserUpdateInput,
): Promise<AdminUser | null> {
  if (!isValidObjectId(id)) return null;
  await dbConnect();

  const update: Record<string, unknown> = {};
  if (patch.role !== undefined) update.role = patch.role;
  if (patch.suspended !== undefined) update.suspended = patch.suspended;

  const doc = await User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).lean();

  return doc ? toAdminUser(doc) : null;
}

// Delete a user and everything that belongs to them. Keeps each project's
// endorsementCount consistent by decrementing for the user's approved,
// project-attached endorsements before they're removed.
export async function deleteUserWithCascade(id: string): Promise<boolean> {
  if (!isValidObjectId(id)) return false;
  await dbConnect();

  const user = await User.findById(id).select("_id").lean();
  if (!user) return false;

  const approved = await Endorsement.find({
    userId: id,
    status: "approved",
    projectId: { $ne: null },
  })
    .select("projectId")
    .lean();

  const decrements = new Map<string, number>();
  for (const e of approved) {
    if (!e.projectId) continue;
    const key = String(e.projectId);
    decrements.set(key, (decrements.get(key) ?? 0) + 1);
  }
  await Promise.all(
    [...decrements].map(([projectId, count]) =>
      Project.updateOne(
        { _id: projectId },
        { $inc: { endorsementCount: -count } },
      ),
    ),
  );

  await Promise.all([
    Bookmark.deleteMany({ userId: id }),
    Endorsement.deleteMany({ userId: id }),
  ]);
  await User.deleteOne({ _id: id });

  return true;
}
