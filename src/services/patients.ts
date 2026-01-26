import { request } from "@/utilities/request";

export async function getClinicPatientsService(
  clinicId: any,
  page: any,
  page_size: any,
) {
  const response = await request.get(
    `/account/clinic/${clinicId}/patient/?page=${page}&page_size=${page_size}`,
  );
  return {
    data: response?.data?.data,
    pagination: response?.data?.pagination,
  };
}

export async function getClinicBranchPatientsService(
  clinicId: any,
  branchId: any,
  page: any,
  page_size: any,
) {
  const response = await request.get(
    `/account/clinic/${clinicId}/branch/${branchId}/patient/?page=${page}&page_size=${page_size}`,
  );
  return {
    data: response?.data?.data,
    pagination: response?.data?.pagination,
  };
}

export async function getClinicPatientService(patientId: any) {
  const response = await request.get(`/account/clinic-user/${patientId}/`);
  return response.data?.data;
}

export async function createClinicPatientService(clinicPatient: any) {
  const response = await request.post("/account/clinic-user/", clinicPatient);
  return response?.data;
}

export async function updateClinicPatientService(
  clinicPatientId: any,
  clinicPatient: any,
) {
  const response = await request.patch(
    `/account/clinic-user/${clinicPatientId}/`,
    clinicPatient,
  );
  return response?.data;
}

export async function deleteClinicPatientService(clinicPatientId: any) {
  const response = await request.delete(
    `/account/clinic-user/${clinicPatientId}/`,
  );
  return response?.data;
}
