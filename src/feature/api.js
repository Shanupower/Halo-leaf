import axios from "axios";

const baseURL = "http://13.201.41.1:1337/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const get = async (url, config) => {
  console.log(`🌐 Making GET request to: ${baseURL}${url}`);
  const response = await axiosInstance.get(url, config || null);
  console.log(`📡 Response received for ${url}:`, response.data);
  return response.data;
};

export const post = async (url, data, config) => {
  const response = await axiosInstance.post(url, data, config || null);  
  return response.data;
};


export const update = async (url, data, config) => {
  const response = await axiosInstance.put(url, data, config || null);
  return response;
};

export const patch = async (url, data, config) => {
  const response = await axiosInstance.patch(url, data, config || null);
  return response;
};

export const remove = async (url, config) => {
  const response = await axiosInstance.delete(url, config || null);
  return response.data;
};
