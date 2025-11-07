import { request } from "@/utilities/request";

export async function getMcoEntryService(clinicId: any) {
  const response = await request.get(`/clinic/${clinicId}/mco-entry/`);
  return response?.data?.data;
}

export async function createMcoEntryService(clinicId: any, mcoEntry: any) {
  const response = await request.post(
    `/clinic/${clinicId}/mco-entry/`,
    mcoEntry
  );
  return response?.data;
}

export async function updateMcoEntryService(
  clinicId: any,
  mcoEntryId: any,
  mcoEntry: any
) {
  const response = await request.patch(
    `/clinic/${clinicId}/mco-entry/${mcoEntryId}/`,
    mcoEntry
  );
  return response?.data;
}

export async function deleteMcoEntryService(clinicId: any, mcoEntryId: any) {
  const response = await request.delete(
    `/clinic/${clinicId}/mco-entry/${mcoEntryId}/`
  );
  return response?.data;
}
