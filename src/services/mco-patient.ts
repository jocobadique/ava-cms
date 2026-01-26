import { request } from "@/utilities/request";

export async function getPatientMcosService(patientId: any) {
  const response = await request.get(`/patient/${patientId}/mco/`);
  return response?.data?.data;
}

export async function getPatientMcoService(patientId: any, mcoId: any) {
  const response = await request.get(`/patient/${patientId}/mco/${mcoId}/`);
  return response?.data?.data;
}

export async function createPatientMcoService(patientId: any, mco: any) {
  const response = await request.post(`/patient/${patientId}/mco/`, mco);
  return response?.data;
}

export async function updatePatientMcoService(
  patientId: any,
  mcoId: any,
  mco: any
) {
  const response = await request.patch(
    `/patient/${patientId}/mco/${mcoId}/`,
    mco
  );
  return response?.data;
}

export async function deletePatientMcoService(patientId: any, mcoId: any) {
  const response = await request.delete(`/patient/${patientId}/mco/${mcoId}/`);
  return response?.data;
}
