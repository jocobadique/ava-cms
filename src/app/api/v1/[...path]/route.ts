import { NextRequest, NextResponse } from "next/server";
import {
  genId,
  clinics,
  branches,
  mcos,
  mcoEntries,
  drugs,
  billExemptions,
  cmsAdmins,
  subscribers,
  practitioners,
  clinicUsers,
  patientMcos,
  billings,
  biGeneral,
  biActiveAccounts,
} from "@/mocks/store";

// Response helpers — body shape must match what services expect:
// Non-paginated: response?.data?.data → JSON body: { data: [...] }
// Paginated:     response?.data?.data + response?.data?.pagination → JSON body: { data: [...], pagination: {...} }
function ok(data: any) {
  return NextResponse.json({ data });
}

function okList(data: any[]) {
  return NextResponse.json({ data });
}

function okPaginated(data: any[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const sliced = data.slice(start, start + pageSize);
  return NextResponse.json({
    data: sliced,
    pagination: { count: data.length, next: null, previous: null },
  });
}

function okMutation(data: any = {}) {
  return NextResponse.json({ data });
}

function notFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

// Simple path matcher — returns named params or null
function match(segments: string[], pattern: string[]): Record<string, string> | null {
  if (segments.length !== pattern.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i].startsWith(":")) {
      params[pattern[i].slice(1)] = segments[i];
    } else if (pattern[i] !== segments[i]) {
      return null;
    }
  }
  return params;
}

function getPagination(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get("page") || "1");
  const pageSize = Number(req.nextUrl.searchParams.get("page_size") || "10");
  return { page, pageSize };
}

const MOCK_ACCESS =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjk5OTk5OTk5OTl9.demo";

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  segments.splice(0, segments.length, ...segments.filter(Boolean));
  const { page, pageSize } = getPagination(req);

  let p: Record<string, string> | null;

  // /clinic
  if (match(segments, ["clinic"])) return okList(clinics);
  // /clinic/:id
  if ((p = match(segments, ["clinic", ":id"]))) {
    const item = clinics.find((c) => c.id === p!.id);
    return item ? ok(item) : notFound();
  }
  // /clinic/:clinicId/branch
  if ((p = match(segments, ["clinic", ":clinicId", "branch"]))) {
    return okList(branches.filter((b) => b.clinic_id === p!.clinicId));
  }
  // /clinic/:clinicId/mco-entry
  if ((p = match(segments, ["clinic", ":clinicId", "mco-entry"]))) {
    return okList(mcoEntries.filter((e) => e.clinic_id === p!.clinicId));
  }
  // /clinic/:clinicId/bill
  if ((p = match(segments, ["clinic", ":clinicId", "bill"]))) {
    return okList(billings.filter((b) => b.clinic_id === p!.clinicId));
  }

  // /account/clinic/:clinicId — all clinic users (paginated)
  if ((p = match(segments, ["account", "clinic", ":clinicId"]))) {
    const users = clinicUsers.filter((u) => u.clinic_id === p!.clinicId);
    return okPaginated(users, page, pageSize);
  }
  // /account/clinic/:clinicId/admin
  if ((p = match(segments, ["account", "clinic", ":clinicId", "admin"]))) {
    const users = clinicUsers.filter((u) => u.clinic_id === p!.clinicId && u.user_type === "clinic_admin");
    return okPaginated(users, page, pageSize);
  }
  // /account/clinic/:clinicId/branch-admin
  if ((p = match(segments, ["account", "clinic", ":clinicId", "branch-admin"]))) {
    const users = clinicUsers.filter((u) => u.clinic_id === p!.clinicId && u.user_type === "branch_admin");
    return okPaginated(users, page, pageSize);
  }
  // /account/clinic/:clinicId/staff
  if ((p = match(segments, ["account", "clinic", ":clinicId", "staff"]))) {
    const users = clinicUsers.filter((u) => u.clinic_id === p!.clinicId && u.user_type === "staff");
    return okPaginated(users, page, pageSize);
  }
  // /account/clinic/:clinicId/patient
  if ((p = match(segments, ["account", "clinic", ":clinicId", "patient"]))) {
    const users = clinicUsers.filter((u) => u.clinic_id === p!.clinicId && u.user_type === "patient");
    return okPaginated(users, page, pageSize);
  }
  // /account/clinic/:clinicId/branch/:branchId/patient
  if ((p = match(segments, ["account", "clinic", ":clinicId", "branch", ":branchId", "patient"]))) {
    const users = clinicUsers.filter((u) => u.clinic_id === p!.clinicId && u.branch_id === p!.branchId && u.user_type === "patient");
    return okPaginated(users, page, pageSize);
  }
  // /account/clinic-user/:id
  if ((p = match(segments, ["account", "clinic-user", ":id"]))) {
    const item = clinicUsers.find((u) => u.id === p!.id) || subscribers.find((s) => s.id === p!.id);
    return item ? ok(item) : notFound();
  }
  // /account/bill-exemption
  if (match(segments, ["account", "bill-exemption"])) return okList(billExemptions);
  // /account/bill-exemption/:id
  if ((p = match(segments, ["account", "bill-exemption", ":id"]))) {
    const item = billExemptions.find((b) => b.id === p!.id);
    return item ? ok(item) : notFound();
  }
  // /account/cms
  if (match(segments, ["account", "cms"])) return okList(cmsAdmins);
  // /account/cms/:id
  if ((p = match(segments, ["account", "cms", ":id"]))) {
    const item = cmsAdmins.find((a) => a.id === p!.id);
    return item ? ok(item) : notFound();
  }
  // /account/subscriber
  if (match(segments, ["account", "subscriber"])) return okList(subscribers);

  // /core/drug
  if (match(segments, ["core", "drug"])) return okList(drugs);
  // /core/drug/:id
  if ((p = match(segments, ["core", "drug", ":id"]))) {
    const item = drugs.find((d) => d.id === p!.id);
    return item ? ok(item) : notFound();
  }
  // /core/mco
  if (match(segments, ["core", "mco"])) return okList(mcos);
  // /core/mco/:id — also handles patientMco IDs by resolving the linked MCO
  if ((p = match(segments, ["core", "mco", ":id"]))) {
    const item = mcos.find((m) => m.id === p!.id);
    if (item) return ok(item);
    const pm = patientMcos.find((pm) => pm.id === p!.id);
    if (pm) {
      const linked = mcos.find((m) => m.id === pm.mco?.id);
      return linked ? ok(linked) : notFound();
    }
    return notFound();
  }

  // /practitioner/account
  if (match(segments, ["practitioner", "account"])) {
    return okPaginated(practitioners, page, pageSize);
  }
  // /practitioner/account/clinic/:clinicId  — must check before /practitioner/account/:id
  if ((p = match(segments, ["practitioner", "account", "clinic", ":clinicId"]))) {
    const items = practitioners.filter((pr) => pr.clinic_id === p!.clinicId);
    return okPaginated(items, page, pageSize);
  }
  // /practitioner/account/:id
  if ((p = match(segments, ["practitioner", "account", ":id"]))) {
    const item = practitioners.find((pr) => pr.id === p!.id);
    return item ? ok(item) : notFound();
  }

  // /patient/:patientId/mco
  if ((p = match(segments, ["patient", ":patientId", "mco"]))) {
    return okList(patientMcos.filter((pm) => pm.patient_id === p!.patientId));
  }
  // /patient/:patientId/mco/:mcoId
  if ((p = match(segments, ["patient", ":patientId", "mco", ":mcoId"]))) {
    const item = patientMcos.find((pm) => pm.patient_id === p!.patientId && pm.id === p!.mcoId);
    return item ? ok(item) : notFound();
  }

  // /bizntel/subscriber
  if (match(segments, ["bizntel", "subscriber"])) return ok(biGeneral);
  // /bizntel/active-accounts
  if (match(segments, ["bizntel", "active-accounts"])) return ok(biActiveAccounts);

  return notFound();
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  segments.splice(0, segments.length, ...segments.filter(Boolean));
  const body = await req.json().catch(() => ({}));
  let p: Record<string, string> | null;

  // /account/login
  if (match(segments, ["account", "login"])) {
    return NextResponse.json({
      message: "Success",
      data: {
        user: { first_name: "Demo", cms_role: "admin", target_apps: ["cms"] },
        jwt: { access: MOCK_ACCESS, refresh: MOCK_ACCESS },
        csrf: "demo_csrf",
      },
    });
  }
  // /account/login/refresh
  if (match(segments, ["account", "login", "refresh"])) {
    return NextResponse.json({ access: MOCK_ACCESS });
  }
  // /account/logout
  if (match(segments, ["account", "logout"])) {
    return NextResponse.json({ message: "Logged out" });
  }

  // /account/clinic-user (create any user type)
  if (match(segments, ["account", "clinic-user"])) {
    const newUser = { id: genId(), ...body };
    clinicUsers.push(newUser);
    return okMutation(newUser);
  }
  // /account/clinic-signup (create subscriber)
  if (match(segments, ["account", "clinic-signup"])) {
    const newSubscriber = { id: genId(), ...body };
    subscribers.push(newSubscriber);
    clinicUsers.push({ ...newSubscriber, user_type: "subscriber" });
    return okMutation(newSubscriber);
  }

  // /account/bill-exemption
  if (match(segments, ["account", "bill-exemption"])) {
    const item = { id: genId(), status: "active", subscription_date: new Date().toISOString().slice(0, 10), activate_date: new Date().toISOString().slice(0, 10), deactivate_date: null, inactive_reason: null, ...body };
    billExemptions.push(item);
    return okMutation(item);
  }
  // /account/bill-exemption/:id/recall
  if ((p = match(segments, ["account", "bill-exemption", ":id", "recall"]))) {
    const idx = billExemptions.findIndex((b) => b.id === p!.id);
    if (idx === -1) return notFound();
    billExemptions[idx] = { ...billExemptions[idx], status: "recalled", deactivate_date: new Date().toISOString().slice(0, 10) };
    return okMutation(billExemptions[idx]);
  }

  // /account/cms
  if (match(segments, ["account", "cms"])) {
    const parts = [body.first_name, body.middle_name, body.last_name].filter(Boolean);
    const item = { id: genId(), is_active: true, display_name: parts.join(" "), ...body };
    cmsAdmins.push(item);
    return okMutation(item);
  }

  // /core/drug
  if (match(segments, ["core", "drug"])) {
    const item = { id: genId(), ...body };
    drugs.push(item);
    return okMutation(item);
  }
  // /core/mco
  if (match(segments, ["core", "mco"])) {
    const item = { id: genId(), ...body };
    mcos.push(item);
    return okMutation(item);
  }

  // /practitioner/account
  if (match(segments, ["practitioner", "account"])) {
    const item = { id: genId(), is_active: true, ...body };
    practitioners.push(item);
    return okMutation(item);
  }

  // /clinic/:clinicId/branch
  if ((p = match(segments, ["clinic", ":clinicId", "branch"]))) {
    const item = { id: genId(), clinic_id: p.clinicId, is_active: true, ...body };
    branches.push(item);
    return okMutation(item);
  }
  // /clinic/:clinicId/mco-entry
  if ((p = match(segments, ["clinic", ":clinicId", "mco-entry"]))) {
    const item = { id: genId(), clinic_id: p.clinicId, is_active: true, ...body };
    mcoEntries.push(item);
    return okMutation(item);
  }

  // /patient/:patientId/mco
  if ((p = match(segments, ["patient", ":patientId", "mco"]))) {
    const item = { id: genId(), patient_id: p.patientId, ...body };
    patientMcos.push(item);
    return okMutation(item);
  }

  return notFound();
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  segments.splice(0, segments.length, ...segments.filter(Boolean));
  const body = await req.json().catch(() => ({}));
  let p: Record<string, string> | null;

  if ((p = match(segments, ["clinic", ":id"]))) {
    const idx = clinics.findIndex((c) => c.id === p!.id);
    if (idx === -1) return notFound();
    clinics[idx] = { ...clinics[idx], ...body };
    return okMutation(clinics[idx]);
  }
  if ((p = match(segments, ["clinic", ":clinicId", "branch", ":branchId"]))) {
    const idx = branches.findIndex((b) => b.id === p!.branchId);
    if (idx === -1) return notFound();
    branches[idx] = { ...branches[idx], ...body };
    return okMutation(branches[idx]);
  }
  if ((p = match(segments, ["clinic", ":clinicId", "mco-entry", ":id"]))) {
    const idx = mcoEntries.findIndex((e) => e.id === p!.id);
    if (idx === -1) return notFound();
    mcoEntries[idx] = { ...mcoEntries[idx], ...body };
    return okMutation(mcoEntries[idx]);
  }
  if ((p = match(segments, ["account", "clinic-user", ":id"]))) {
    const idx = clinicUsers.findIndex((u) => u.id === p!.id);
    if (idx !== -1) {
      clinicUsers[idx] = { ...clinicUsers[idx], ...body };
      return okMutation(clinicUsers[idx]);
    }
    const sidx = subscribers.findIndex((s) => s.id === p!.id);
    if (sidx !== -1) {
      subscribers[sidx] = { ...subscribers[sidx], ...body };
      return okMutation(subscribers[sidx]);
    }
    return notFound();
  }
  if ((p = match(segments, ["account", "bill-exemption", ":id"]))) {
    const idx = billExemptions.findIndex((b) => b.id === p!.id);
    if (idx === -1) return notFound();
    billExemptions[idx] = { ...billExemptions[idx], ...body };
    return okMutation(billExemptions[idx]);
  }
  if ((p = match(segments, ["account", "cms", ":id"]))) {
    const idx = cmsAdmins.findIndex((a) => a.id === p!.id);
    if (idx === -1) return notFound();
    cmsAdmins[idx] = { ...cmsAdmins[idx], ...body };
    return okMutation(cmsAdmins[idx]);
  }
  if ((p = match(segments, ["core", "drug", ":id"]))) {
    const idx = drugs.findIndex((d) => d.id === p!.id);
    if (idx === -1) return notFound();
    drugs[idx] = { ...drugs[idx], ...body };
    return okMutation(drugs[idx]);
  }
  if ((p = match(segments, ["core", "mco", ":id"]))) {
    const idx = mcos.findIndex((m) => m.id === p!.id);
    if (idx === -1) return notFound();
    mcos[idx] = { ...mcos[idx], ...body };
    return okMutation(mcos[idx]);
  }
  if ((p = match(segments, ["practitioner", "account", ":id"]))) {
    const idx = practitioners.findIndex((pr) => pr.id === p!.id);
    if (idx === -1) return notFound();
    practitioners[idx] = { ...practitioners[idx], ...body };
    return okMutation(practitioners[idx]);
  }
  if ((p = match(segments, ["patient", ":patientId", "mco", ":mcoId"]))) {
    const idx = patientMcos.findIndex((pm) => pm.id === p!.mcoId);
    if (idx === -1) return notFound();
    patientMcos[idx] = { ...patientMcos[idx], ...body };
    return okMutation(patientMcos[idx]);
  }

  return notFound();
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  segments.splice(0, segments.length, ...segments.filter(Boolean));
  const body = await req.json().catch(() => ({}));
  let p: Record<string, string> | null;

  // /practitioner/:id/associate/:branchId
  // Component reads response?.data?.branches so body must be { data: { branches: [...] } }
  if ((p = match(segments, ["practitioner", ":id", "associate", ":branchId"]))) {
    const idx = practitioners.findIndex((pr) => pr.id === p!.id);
    if (idx === -1) return notFound();
    const branchId = p!.branchId;
    if (branchId && branchId !== "undefined") {
      const branchExists = practitioners[idx].branches?.some((b: any) => b.id === branchId);
      if (!branchExists) {
        const branch = branches.find((b) => b.id === branchId);
        if (branch) {
          const clinic = clinics.find((c) => c.id === branch.clinic_id);
          practitioners[idx].branches = [...(practitioners[idx].branches || []), { id: branch.id, name: branch.name, clinic_id: branch.clinic_id, clinic_name: clinic?.name ?? "" }];
          practitioners[idx].branch_id = branchId;
          practitioners[idx].branch_name = branch.name;
        }
      }
    }
    return NextResponse.json({ data: { branches: practitioners[idx].branches ?? [] } });
  }

  return notFound();
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  segments.splice(0, segments.length, ...segments.filter(Boolean));
  let p: Record<string, string> | null;

  if ((p = match(segments, ["clinic", ":id"]))) {
    const idx = clinics.findIndex((c) => c.id === p!.id);
    if (idx === -1) return notFound();
    clinics.splice(idx, 1);
    return okMutation();
  }
  if ((p = match(segments, ["clinic", ":clinicId", "branch", ":branchId"]))) {
    const idx = branches.findIndex((b) => b.id === p!.branchId);
    if (idx === -1) return notFound();
    branches.splice(idx, 1);
    return okMutation();
  }
  if ((p = match(segments, ["clinic", ":clinicId", "mco-entry", ":id"]))) {
    const idx = mcoEntries.findIndex((e) => e.id === p!.id);
    if (idx === -1) return notFound();
    mcoEntries.splice(idx, 1);
    return okMutation();
  }
  if ((p = match(segments, ["account", "clinic-user", ":id"]))) {
    const idx = clinicUsers.findIndex((u) => u.id === p!.id);
    if (idx !== -1) { clinicUsers.splice(idx, 1); return okMutation(); }
    const sidx = subscribers.findIndex((s) => s.id === p!.id);
    if (sidx !== -1) { subscribers.splice(sidx, 1); return okMutation(); }
    return notFound();
  }
  if ((p = match(segments, ["account", "bill-exemption", ":id"]))) {
    const idx = billExemptions.findIndex((b) => b.id === p!.id);
    if (idx === -1) return notFound();
    billExemptions.splice(idx, 1);
    return okMutation();
  }
  if ((p = match(segments, ["account", "cms", ":id"]))) {
    const idx = cmsAdmins.findIndex((a) => a.id === p!.id);
    if (idx === -1) return notFound();
    cmsAdmins.splice(idx, 1);
    return okMutation();
  }
  if ((p = match(segments, ["core", "drug", ":id"]))) {
    const idx = drugs.findIndex((d) => d.id === p!.id);
    if (idx === -1) return notFound();
    drugs.splice(idx, 1);
    return okMutation();
  }
  if ((p = match(segments, ["core", "mco", ":id"]))) {
    const idx = mcos.findIndex((m) => m.id === p!.id);
    if (idx === -1) return notFound();
    mcos.splice(idx, 1);
    return okMutation();
  }
  if ((p = match(segments, ["practitioner", "account", ":id"]))) {
    const idx = practitioners.findIndex((pr) => pr.id === p!.id);
    if (idx === -1) return notFound();
    practitioners.splice(idx, 1);
    return okMutation();
  }
  if ((p = match(segments, ["practitioner", ":id", "associate", ":branchId"]))) {
    const idx = practitioners.findIndex((pr) => pr.id === p!.id);
    if (idx === -1) return notFound();
    practitioners[idx].branches = (practitioners[idx].branches || []).filter((b: any) => b.id !== p!.branchId);
    return okMutation();
  }
  if ((p = match(segments, ["patient", ":patientId", "mco", ":mcoId"]))) {
    const idx = patientMcos.findIndex((pm) => pm.id === p!.mcoId);
    if (idx === -1) return notFound();
    patientMcos.splice(idx, 1);
    return okMutation();
  }

  return notFound();
}
