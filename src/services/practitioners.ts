import { request } from "@/utilities/request";

export async function getPractitionersService(page: any, page_size: any) {
  const response = await request.get(
    `/practitioner/account/?page=${page}&page_size=${page_size}`
  );
  return {
    data: response?.data?.data,
    pagination: response?.data?.pagination,
  };
}

export async function getClinicPractitionersService(
  clinicId: any,
  page: any,
  page_size: any
) {
  const response = await request.get(
    `/practitioner/account/clinic/${clinicId}/?page=${page}&page_size=${page_size}`
  );
  return {
    data: response?.data?.data,
    pagination: response?.data?.pagination,
  };
}

export async function getClinicPractitionerService(practitionerId: any) {
  const response = await request.get(
    `/practitioner/account/${practitionerId}/`
  );
  return response?.data?.data;
}

export async function createClinicPractitionersService(practitioner: any) {
  const response = await request.post("/practitioner/account/", practitioner);
  return response?.data;
}

export async function updateClinicPractitionersService(
  practitionerId: any,
  practitioner: any
) {
  const response = await request.patch(
    `/practitioner/account/${practitionerId}/`,
    practitioner
  );
  return response?.data;
}

export async function updateClinicPractitionerAssociateService(
  practitionerId: any,
  branchId: any,
  practitioner: any
) {
  const response = await request.put(
    `/practitioner/${practitionerId}/associate/${branchId}/`,
    practitioner
  );
  return response?.data;
}

export async function deleteClinicPractitionerAssociateService(
  practitionerId: any,
  branchId: any
) {
  const response = await request.delete(
    `/practitioner/${practitionerId}/associate/${branchId}/`
  );

  return response?.data;
}

export async function deleteClinicPractitionersService(practitionerId: any) {
  const response = await request.delete(
    `/practitioner/account/${practitionerId}/`
  );
  return response?.data;
}
