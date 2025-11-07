import { request } from "@/utilities/request";

export async function getClinicBranchesService(clinicId: any) {
  const response = await request.get(`/clinic/${clinicId}/branch/`);
  return response?.data?.data;
}

export async function createClinicBranchService(clinicId: any, branch: any) {
  const response = await request.post(`/clinic/${clinicId}/branch/`, branch);
  return response?.data;
}

export async function updateClinicBranchService(
  clinicId: any,
  branchId: any,
  branch: any
) {
  const response = await request.patch(
    `/clinic/${clinicId}/branch/${branchId}/`,
    branch
  );
  return response?.data;
}

export async function deleteClinicBranchService(clinicId: any, branchId: any) {
  const response = await request.delete(
    `/clinic/${clinicId}/branch/${branchId}/`
  );
  return response?.data;
}
