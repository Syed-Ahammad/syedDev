import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireSession } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { Endorsement } from "@/models/Endorsement";
import { Project } from "@/models/Project";
import { Profile } from "@/models/Profile";
import { fetchUserEndorsements } from "@/lib/endorsements";
import { endorsementSchema } from "@/lib/validations";
import { enforceLimit, endorsementLimiter } from "@/lib/ratelimit";

// GET /api/user/endorsements — the user's own endorsements (all statuses).
export async function GET() {
  try {
    const session = await requireSession();
    const items = await fetchUserEndorsements(session.user.id);
    return NextResponse.json({ success: true, data: { items } });
  } catch (error) {
    return errorResponse(error);
  }
}

// POST /api/user/endorsements — submit an endorsement for review.
export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    await enforceLimit(endorsementLimiter, session.user.id);

    const json = await request.json().catch(() => null);
    const { skill, text, projectId } = endorsementSchema.parse(json);

    await dbConnect();

    // Skill must be one of the profile's listed skills.
    const profile = await Profile.findById("singleton").select("skills").lean();
    if (!(profile?.skills ?? []).includes(skill)) {
      throw new HttpError(400, "Pick one of the listed skills.");
    }

    if (projectId) {
      if (!isValidObjectId(projectId)) throw new HttpError(400, "Invalid project id.");
      if (!(await Project.exists({ _id: projectId }))) {
        throw new HttpError(404, "Project not found.");
      }
    }

    // One endorsement per (user, skill).
    if (await Endorsement.exists({ userId: session.user.id, skill })) {
      throw new HttpError(409, "You've already endorsed this skill.");
    }

    const endorsement = await Endorsement.create({
      userId: session.user.id,
      skill,
      text,
      ...(projectId ? { projectId } : {}),
    });

    return NextResponse.json(
      { success: true, data: { id: String(endorsement._id) } },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
