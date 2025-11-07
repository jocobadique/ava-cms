import { request } from "@/utilities/request";

export async function getPractitionersService() {
  const response = await request.get("/practitioner/account/");
  return response?.data?.data;
}

export async function getClinicPractitionersService(clinicId: any) {
  const response = await request.get(
    `/practitioner/account/clinic/${clinicId}/`
  );
  return response?.data?.data;
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

export async function deleteClinicPractitionersService(practitionerId: any) {
  const response = await request.delete(
    `/practitioner/account/${practitionerId}/`
  );
  return response?.data;
}
