import { request } from "@/utilities/request";

export async function getCmsAdminsService() {
  const response = await request.get("/account/cms/");
  return response?.data?.data;
}

export async function getCmsAdminService(cmsAdminId: any) {
  const response = await request.get(`/account/cms/${cmsAdminId}/`);
  return response?.data?.data;
}

export async function createCmsAdminService(cmsAdmin: any) {
  const response = await request.post("/account/cms/", cmsAdmin);
  return response?.data;
}

export async function updateCmsAdminService(cmsAdminId: any, cmsAdmin: any) {
  const response = await request.patch(`/account/cms/${cmsAdminId}/`, cmsAdmin);
  return response?.data;
}

export async function deleteCmsAdminService(cmsAdminId: any) {
  const response = await request.delete(`/account/cms/${cmsAdminId}/`);
  return response?.data;
}
