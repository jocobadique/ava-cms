import { request } from "@/utilities/request";

export async function getClinicBillingsService(clinicId: any) {
  const response = await request.get(`/clinic/${clinicId}/bill/`);
  return response?.data?.data;
}
