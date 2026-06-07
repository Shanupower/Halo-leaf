import { apiClient } from "../client";

export async function registerIdentity(email, password) {
  const res = await apiClient.post("/auth/customer/emailpass/register", {
    email,
    password,
  });
  return res.data;
}

export async function loginIdentity(email, password) {
  const res = await apiClient.post("/auth/customer/emailpass", {
    email,
    password,
  });
  return res.data;
}

export async function createCustomer(body) {
  const res = await apiClient.post("/store/customers", body);
  return res.data;
}

export async function retrieveCustomerMe() {
  const res = await apiClient.get("/store/customers/me");
  return res.data;
}

export async function updateCustomerMe(body) {
  const res = await apiClient.post("/store/customers/me", body);
  return res.data;
}

export async function createCustomerAddress(body) {
  const res = await apiClient.post("/store/customers/me/addresses", body);
  return res.data;
}

export async function updateCustomerAddress(addressId, body) {
  const res = await apiClient.post(
    `/store/customers/me/addresses/${addressId}`,
    body
  );
  return res.data;
}

export async function deleteCustomerAddress(addressId) {
  const res = await apiClient.delete(
    `/store/customers/me/addresses/${addressId}`
  );
  return res.data;
}
