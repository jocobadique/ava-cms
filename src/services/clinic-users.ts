import { request } from "@/utilities/request";

export async function getClinicUsersService(
  clinicId: any,
  page: any,
  page_size: any,
) {
  const response = await request.get(
    `/account/clinic/${clinicId}/?page=${page}&page_size=${page_size}`,
  );
  return {
    data: response?.data?.data,
    pagination: response?.data?.pagination,
  };
}

export async function createClinicUserService(clinicUser: any) {
  const response = await request.post("/account/clinic-user/", clinicUser);
  return response?.data;
}

export async function updateClinicUserService(
  clinicUserId: any,
  clinicUser: any,
) {
  const response = await request.patch(
    `/account/clinic-user/${clinicUserId}/`,
    clinicUser,
  );
  return response?.data;
}

export async function deleteClinicUserService(clinicUserId: any) {
  const response = await request.delete(
    `/account/clinic-user/${clinicUserId}/`,
  );
  return response?.data;
}
