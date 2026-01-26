import { request } from "@/utilities/request";

export async function getClinicBranchAdminsService(
  clinicId: any,
  page: any,
  page_size: any,
) {
  const response = await request.get(
    `/account/clinic/${clinicId}/branch-admin/?page=${page}&page_size=${page_size}`,
  );
  return {
    data: response?.data?.data,
    pagination: response?.data?.pagination,
  };
}

export async function createClinicBranchAdminService(branchAdmin: any) {
  const response = await request.post("/account/clinic-user/", branchAdmin);
  return response?.data;
}

export async function updateClinicBranchAdminService(
  branchAdminId: any,
  branchAdmin: any,
) {
  const response = await request.patch(
    `/account/clinic-user/${branchAdminId}/`,
    branchAdmin,
  );
  return response?.data;
}

export async function deleteClinicBranchAdminService(branchAdminId: any) {
  const response = await request.delete(
    `/account/clinic-user/${branchAdminId}/`,
  );
  return response?.data;
}
