import { request } from "@/utilities/request";

export async function getBillExemptionsService() {
  const response = await request.get("/account/bill-exemption/");
  return response?.data?.data;
}

export async function getBillExemptionService(billExemptionId: any) {
  const response = await request.get(
    `/account/bill-exemption/${billExemptionId}/`
  );
  return response?.data?.data;
}

export async function createBillExemptionService(billExemption: any) {
  const response = await request.post(
    "/account/bill-exemption/",
    billExemption
  );
  return response?.data;
}

export async function createRecallBillExemptionService(billExemptionId: any) {
  const response = await request.post(
    `/account/bill-exemption/${billExemptionId}/recall/`,
    billExemptionId
  );
  return response?.data;
}

export async function updateBillExemptionService(
  billExemptionId: any,
  billExemption: any
) {
  const response = await request.patch(
    `/account/bill-exemption/${billExemptionId}/`,
    billExemption
  );
  return response?.data;
}

export async function deleteBillExemptionService(billExemptionId: any) {
  const response = await request.delete(
    `/account/bill-exemption/${billExemptionId}/`
  );
  return response?.data;
}
