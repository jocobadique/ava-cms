import { request } from "@/utilities/request";

export async function getClinicsService() {
  const response = await request.get("/clinic/");
  return response?.data?.data;
}

export async function getClinicService(clinicId: any) {
  const response = await request.get(`/clinic/${clinicId}/`);
  return response?.data?.data;
}

export async function updateClinicService(clinicId: any, clinic: any) {
  const response = await request.patch(`/clinic/${clinicId}/`, clinic);
  return response?.data;
}

export async function deleteClinicService(clinicId: any) {
  const response = await request.delete(`/clinic/${clinicId}/`);
  return response?.data;
}
