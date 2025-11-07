import { request } from "@/utilities/request";

export async function getMcosService() {
  const response = await request.get("/core/mco/");
  return response?.data?.data;
}

export async function getMcoService(mcoId: any) {
  const response = await request.get(`/core/mco/${mcoId}/`);
  return response?.data?.data;
}

export async function createMcoService(mco: any) {
  const response = await request.post("/core/mco/", mco);
  return response?.data;
}

export async function updateMcoService(mcoId: any, mco: any) {
  const response = await request.patch(`/core/mco/${mcoId}/`, mco);
  return response?.data;
}

export async function deleteMcoService(mcoId: any) {
  const response = await request.delete(`/core/mco/${mcoId}/`);
  return response?.data;
}
