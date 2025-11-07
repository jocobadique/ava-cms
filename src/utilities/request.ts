import axios from "axios";
import { getValidToken } from "./token";

const API_URL = "/api/v1";

const getHeaders = async () => {
  const token = await getValidToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

export const request = {
  get: async (endpoint: string, isPrivate = true) =>
    axios.get(
      API_URL + endpoint,
      isPrivate ? { headers: await getHeaders() } : undefined
    ),

  post: async (endpoint: string, data: object, isPrivate = true) =>
    axios.post(
      API_URL + endpoint,
      data,
      isPrivate ? { headers: await getHeaders() } : undefined
    ),

  put: async (endpoint: string, data: object, isPrivate = true) =>
    axios.put(
      API_URL + endpoint,
      data,
      isPrivate ? { headers: await getHeaders() } : undefined
    ),

  patch: async (endpoint: string, data: object, isPrivate = true) =>
    axios.patch(
      API_URL + endpoint,
      data,
      isPrivate ? { headers: await getHeaders() } : undefined
    ),

  delete: async (endpoint: string, isPrivate = true) =>
    axios.delete(
      API_URL + endpoint,
      isPrivate ? { headers: await getHeaders() } : undefined
    ),
};
