import { apiClient } from "../client";

const STORAGE_REGION = "medusa_region_id";
const STORAGE_CART = "medusa_cart_id";

export function getStoredCartId() {
  return localStorage.getItem(STORAGE_CART);
}

export function setStoredCartId(id) {
  if (id) localStorage.setItem(STORAGE_CART, id);
  else localStorage.removeItem(STORAGE_CART);
}

export async function listRegions(params = { limit: 20 }) {
  const res = await apiClient.get("/store/regions", { params });
  return res.data;
}

function pickIndiaRegion(regions = []) {
  return (
    regions.find((r) => r.currency_code?.toLowerCase() === "inr") ||
    regions.find((r) => r.name?.toLowerCase().includes("india")) ||
    regions[0]
  );
}

export async function ensureRegionId() {
  const env = import.meta.env.VITE_MEDUSA_REGION_ID;
  if (env) {
    localStorage.setItem(STORAGE_REGION, env);
    return env;
  }
  let rid = localStorage.getItem(STORAGE_REGION);
  const { regions } = await listRegions();
  const preferred = pickIndiaRegion(regions);
  if (!preferred?.id) {
    throw new Error("No Medusa regions configured. Seed the database or set VITE_MEDUSA_REGION_ID.");
  }
  if (!rid || rid !== preferred.id) {
    localStorage.setItem(STORAGE_REGION, preferred.id);
    if (rid && rid !== preferred.id) {
      setStoredCartId(null);
    }
    return preferred.id;
  }
  return rid;
}

const PRODUCT_FIELDS = [
  "id",
  "title",
  "subtitle",
  "description",
  "handle",
  "thumbnail",
  "metadata",
  "weight",
  "length",
  "width",
  "height",
  "*images",
  "*categories",
  "*variants.id",
  "*variants.calculated_price",
  "*variants.prices",
  "*variants.weight",
  "*variants.length",
  "*variants.width",
  "*variants.height",
].join(",");

export async function listProducts(regionId, extra = {}) {
  const res = await apiClient.get("/store/products", {
    params: {
      region_id: regionId,
      limit: 100,
      fields: PRODUCT_FIELDS,
      ...extra,
    },
  });
  return res.data;
}

export async function retrieveProduct(id, regionId) {
  const res = await apiClient.get(`/store/products/${id}`, {
    params: {
      region_id: regionId,
      fields: PRODUCT_FIELDS,
    },
  });
  return res.data;
}

export async function listCategories() {
  const res = await apiClient.get("/store/product-categories", {
    params: { limit: 100 },
  });
  return res.data;
}

export async function listPaymentProviders(regionId) {
  const res = await apiClient.get("/store/payment-providers", {
    params: { region_id: regionId },
  });
  return res.data;
}

export async function createCart(body) {
  const res = await apiClient.post("/store/carts", body);
  return res.data;
}

export async function retrieveCart(cartId) {
  const res = await apiClient.get(`/store/carts/${cartId}`, {
    params: {
      fields:
        "+items,*items.variant,+shipping_address,+shipping_methods,+subtotal,+shipping_total,+tax_total,+total",
    },
  });
  return res.data;
}

export async function updateCart(cartId, body) {
  const res = await apiClient.post(`/store/carts/${cartId}`, body);
  return res.data;
}

export async function addLineItem(cartId, body) {
  const res = await apiClient.post(`/store/carts/${cartId}/line-items`, body);
  return res.data;
}

export async function updateLineItem(cartId, lineId, body) {
  const res = await apiClient.post(
    `/store/carts/${cartId}/line-items/${lineId}`,
    body
  );
  return res.data;
}

export async function deleteLineItem(cartId, lineId) {
  const res = await apiClient.delete(
    `/store/carts/${cartId}/line-items/${lineId}`
  );
  return res.data;
}

export async function applyCartShippingQuote(cartId) {
  const res = await apiClient.post(`/store/halo/carts/${cartId}/apply-shipping`, {});
  return res.data;
}

export async function listShippingOptions(cartId) {
  const res = await apiClient.get("/store/shipping-options", {
    params: { cart_id: cartId },
  });
  return res.data;
}

export async function addShippingMethod(cartId, optionId) {
  const res = await apiClient.post(`/store/carts/${cartId}/shipping-methods`, {
    option_id: optionId,
  });
  return res.data;
}

export async function attachCustomerToCart(cartId) {
  const res = await apiClient.post(`/store/carts/${cartId}/customer`, {});
  return res.data;
}

export async function createPaymentCollection(cartId) {
  const res = await apiClient.post("/store/payment-collections", {
    cart_id: cartId,
  });
  return res.data;
}

export async function createPaymentSession(paymentCollectionId, providerId) {
  const res = await apiClient.post(
    `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
    { provider_id: providerId }
  );
  return res.data;
}

export async function completeCart(cartId) {
  const res = await apiClient.post(`/store/carts/${cartId}/complete`, {});
  return res.data;
}

export async function fetchRazorpayOrderStatus(razorpayOrderId) {
  const res = await apiClient.get(
    `/store/halo/razorpay/orders/${razorpayOrderId}`
  );
  return res.data;
}

/** Poll until Razorpay reports the order paid (handles post-checkout sync delay). */
export async function waitForRazorpayOrderPaid(
  razorpayOrderId,
  { maxAttempts = 20, intervalMs = 1500 } = {}
) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const status = await fetchRazorpayOrderStatus(razorpayOrderId);
    if (status?.paid) return status;
    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
  throw new Error(
    "Payment is still processing. Wait a moment and try Pay again, or check your email for confirmation."
  );
}

export async function retrieveStoreOrder(orderId) {
  const res = await apiClient.get(`/store/orders/${orderId}`, {
    params: {
      fields: "*items,*items.variant,*items.variant.product",
    },
  });
  return res.data;
}

export async function listOrders({ limit = 20, offset = 0 } = {}) {
  const res = await apiClient.get("/store/orders", {
    params: {
      limit,
      offset,
      fields: "*items",
    },
  });
  return res.data;
}

export async function requestOrderTransfer(orderId, description) {
  const res = await apiClient.post(
    `/store/orders/${orderId}/transfer/request`,
    { description }
  );
  return res.data;
}

export async function cancelOrderTransferRequest(orderId) {
  const res = await apiClient.post(
    `/store/orders/${orderId}/transfer/cancel`,
    {}
  );
  return res.data;
}

export async function listOrderActionRequests(orderId) {
  const res = await apiClient.get(`/store/orders/${orderId}/actions`);
  return res.data;
}

export async function listOrderReviews(orderId) {
  const res = await apiClient.get(`/store/orders/${orderId}/reviews`);
  return res.data;
}

export async function submitOrderReview(orderId, body) {
  const res = await apiClient.post(`/store/orders/${orderId}/reviews`, body);
  return res.data;
}

export async function createOrderActionRequest(orderId, body) {
  const res = await apiClient.post(`/store/orders/${orderId}/actions`, body);
  return res.data;
}

export async function cancelOrderActionRequest(orderId, actionId) {
  const res = await apiClient.post(
    `/store/orders/${orderId}/actions/${actionId}/cancel`,
    {}
  );
  return res.data;
}

export async function fetchTestimonials() {
  const res = await apiClient.get("/store/halo/testimonials");
  return res.data;
}

export async function checkServiceability(body) {
  const res = await apiClient.post("/store/serviceability", body);
  return res.data;
}

/** Shiprocket plugin route — requires variant weight/dimensions in Medusa. */
export async function checkShiprocketServiceability({
  pincode,
  variantId,
  cod = 0,
  pickupPincode,
  declaredValue,
}) {
  const res = await apiClient.get("/store/shiprocket/serviceability", {
    params: {
      pincode,
      variant_id: variantId,
      cod,
      ...(pickupPincode ? { pickup_pincode: pickupPincode } : {}),
      ...(declaredValue != null ? { declared_value: declaredValue } : {}),
    },
  });
  return res.data;
}
