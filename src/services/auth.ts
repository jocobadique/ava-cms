import { request } from "@/utilities/request";

export async function loginService(credential: any) {
  const response = await request.post("/account/login/", credential, false);
  return response.data;
}

export async function logOutService(refresh: any) {
  const response = await request.post("/account/logout/", refresh);
  return response;
}
