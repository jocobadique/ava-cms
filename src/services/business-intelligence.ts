import { request } from "@/utilities/request";

export async function getGeneralsService() {
  const response = await request.get("/bizntel/subscriber/");
  return response?.data?.data;
}

export async function getBasicStatsService() {
  const response = await request.get("/bizntel/active-accounts/");
  return response?.data?.data;
}
