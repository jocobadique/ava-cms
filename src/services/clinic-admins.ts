import { request } from "@/utilities/request";

export async function getClinicAdminsService(
  clinicId: any,
  page: any,
  page_size: any,
) {
  const response = await request.get(
    `/account/clinic/${clinicId}/admin/?page=${page}&page_size=${page_size}`,
  );
  return {
    data: response?.data?.data,
    pagination: response?.data?.pagination,
  };
}

export async function createClinicAdminService(clinicAdmin: any) {
  const response = await request.post("/account/clinic-user/", clinicAdmin);
  return response?.data;
}

export async function updateClinicAdminService(
  clinicAdminId: any,
  clinicAdmin: any,
) {
  const response = await request.patch(
    `/account/clinic-user/${clinicAdminId}/`,
    clinicAdmin,
  );
  return response?.data;
}

export async function deleteClinicAdminService(clinicAdminId: any) {
  const response = await request.delete(
    `/account/clinic-user/${clinicAdminId}/`,
  );
  return response?.data;
}
