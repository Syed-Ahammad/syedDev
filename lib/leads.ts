import type { QueryFilter } from "mongoose";
import { dbConnect } from "@/lib/db";
import { Lead, type ILead, type LeadStatus } from "@/models/Lead";
import { LEAD_STATUSES } from "@/lib/validations";

export const ADMIN_LEADS_PAGE_SIZE = 10;

export type LeadListParams = {
  status?: LeadStatus;
  page: number;
};

export type AdminLeadItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  projectType: string;
  status: LeadStatus;
  source: ILead["source"];
  createdAt: Date;
};

export function parseLeadListParams(sp: URLSearchParams): LeadListParams {
  const statusRaw = sp.get("status") ?? "";
  const status = (LEAD_STATUSES as readonly string[]).includes(statusRaw)
    ? (statusRaw as LeadStatus)
    : undefined;
  const page = Math.max(1, Number.parseInt(sp.get("page") ?? "1", 10) || 1);
  return { status, page };
}

export function buildLeadFilter(params: LeadListParams): QueryFilter<ILead> {
  return params.status ? { status: params.status } : {};
}

export async function fetchLeads(params: LeadListParams): Promise<{
  items: AdminLeadItem[];
  total: number;
  page: number;
  totalPages: number;
}> {
  await dbConnect();
  const filter = buildLeadFilter(params);

  const total = await Lead.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_LEADS_PAGE_SIZE));
  const page = Math.min(params.page, totalPages);

  const docs = await Lead.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * ADMIN_LEADS_PAGE_SIZE)
    .limit(ADMIN_LEADS_PAGE_SIZE)
    .lean();

  const items: AdminLeadItem[] = docs.map((lead) => ({
    id: String(lead._id),
    name: lead.name,
    email: lead.email,
    message: lead.message,
    projectType: lead.projectType ?? "",
    status: lead.status,
    source: lead.source,
    createdAt: lead.createdAt,
  }));

  return { items, total, page, totalPages };
}
