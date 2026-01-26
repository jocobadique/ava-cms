import { request } from "@/utilities/request";

export async function getClinicBranchStaffsService(
  clinicId: any,
  page: any,
  page_size: any
) {
  const response = await request.get(
    `/account/clinic/${clinicId}/staff/?page=${page}&page_size=${page_size}`
  );
  return {
    data: response?.data?.data,
    pagination: response?.data?.pagination,
  };
}

export async function createClinicBranchStaffService(branchStaff: any) {
  const response = await request.post("/account/clinic-user/", branchStaff);
  return response?.data;
}

export async function updateClinicBranchStaffService(
  branchStaffId: any,
  branchStaff: any
) {
  const response = await request.patch(
    `/account/clinic-user/${branchStaffId}/`,
    branchStaff
  );
  return response?.data;
}

export async function deleteClinicBranchStaffService(branchStaffId: any) {
  const response = await request.delete(
    `/account/clinic-user/${branchStaffId}/`
  );
  return response?.data;
}
