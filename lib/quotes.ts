import { dbConnect } from "@/lib/db";
import { Lead, type LeadStatus } from "@/models/Lead";
import type { QuoteRequest, QuoteStatus } from "@/types";
import type { QuoteRequestInput } from "@/lib/validations";

// Lead statuses map onto the user-facing quote lifecycle.
const STATUS_MAP: Record<LeadStatus, QuoteStatus> = {
  new: "new",
  read: "in-review",
  replied: "responded",
  closed: "closed",
};

type LeanLead = {
  _id: unknown;
  title?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
  status: LeadStatus;
  reply?: string;
  createdAt: Date;
};

const toQuote = (lead: LeanLead): QuoteRequest => ({
  id: String(lead._id),
  title: lead.title ?? "Quote request",
  projectType: lead.projectType ?? "",
  budget: lead.budget ?? "",
  timeline: lead.timeline ?? "",
  brief: lead.message,
  status: STATUS_MAP[lead.status],
  submittedAt: lead.createdAt.toISOString(),
  ...(lead.reply ? { reply: lead.reply } : {}),
});

/** A user's own quote requests, newest first. */
export async function fetchUserQuotes(userId: string): Promise<QuoteRequest[]> {
  await dbConnect();
  const docs = await Lead.find({ userId, source: "quote-request" })
    .sort({ createdAt: -1 })
    .lean();
  return docs.map(toQuote);
}

/** Create a quote request (stored as a Lead) for the signed-in user. */
export async function createQuoteRequest(params: {
  userId: string;
  name: string;
  email: string;
  input: QuoteRequestInput;
}): Promise<QuoteRequest> {
  await dbConnect();
  const lead = await Lead.create({
    name: params.name,
    email: params.email,
    message: params.input.brief,
    projectType: params.input.projectType,
    title: params.input.title,
    budget: params.input.budget,
    timeline: params.input.timeline,
    source: "quote-request",
    userId: params.userId,
  });
  return toQuote(lead.toObject() as LeanLead);
}
