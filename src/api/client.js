import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("Missing VITE_API_BASE_URL (expected Medusa backend base URL)");
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
  const pk = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;
  const path = typeof config.url === "string" ? config.url : "";
  const needsPk =
    path.includes("/store") || path.startsWith("store");
  if (pk && needsPk) {
    config.headers = config.headers ?? {};
    config.headers["x-publishable-api-key"] = pk;
  }
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Request failed";
    return Promise.reject({ status, message, raw: error });
  }
);

