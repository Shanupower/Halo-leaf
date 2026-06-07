import { apiClient } from "../api/client";

export const get = async (url, config) => {
  const res = await apiClient.get(url, config || undefined);
  return res.data;
};

export const post = async (url, data, config) => {
  const res = await apiClient.post(url, data, config || undefined);
  return res.data;
};

export const update = async (url, data, config) => {
  const res = await apiClient.put(url, data, config || undefined);
  return res;
};

export const patch = async (url, data, config) => {
  const res = await apiClient.patch(url, data, config || undefined);
  return res;
};

export const remove = async (url, config) => {
  const res = await apiClient.delete(url, config || undefined);
  return res.data;
};
