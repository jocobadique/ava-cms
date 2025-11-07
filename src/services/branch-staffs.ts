import { request } from "@/utilities/request";

export async function getClinicBranchStaffsService(clinicId: any) {
  const response = await request.get(`/account/clinic/${clinicId}/staff/`);
  return response.data?.data;
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
