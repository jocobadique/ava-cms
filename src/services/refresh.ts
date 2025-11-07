import { request } from "@/utilities/request";

export async function refreshService(refresh: any) {
  const response = await request.post("/account/login/refresh/", refresh);
  return response.data;
}
