import { request } from "@/utilities/request";

export async function getSubscribersService() {
  const response = await request.get("/account/subscriber/");
  return response?.data?.data;
}

export async function getSubscriberService(subscriberId: any) {
  const response = await request.get(`/account/clinic-user/${subscriberId}/`);
  return response?.data?.data;
}

export async function createSubscriberService(subscriber: any) {
  const response = await request.post("/account/clinic-signup/", subscriber);
  return response?.data;
}

export async function updateSubscriberService(
  subscriberId: any,
  subscriber: any
) {
  const response = await request.patch(
    `/account/clinic-user/${subscriberId}/`,
    subscriber
  );
  return response?.data;
}

export async function deleteSubscriberService(subscriberId: any) {
  const response = await request.delete(
    `/account/clinic-user/${subscriberId}/`
  );
  return response?.data;
}
