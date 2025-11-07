import { request } from "@/utilities/request";

export async function getDrugsService() {
  const response = await request.get("/core/drug/");
  return response?.data?.data;
}

export async function getDrugService(drugId: any) {
  const response = await request.get(`/core/drug/${drugId}/`);
  return response?.data?.data;
}

export async function createDrugService(drug: any) {
  const response = await request.post("/core/drug/", drug);
  return response?.data;
}

export async function updateDrugService(drugId: any, drug: any) {
  const response = await request.patch(`/core/drug/${drugId}/`, drug);
  return response?.data;
}

export async function deleteDrugService(drugId: any) {
  const response = await request.delete(`/core/drug/${drugId}/`);
  return response?.data;
}
