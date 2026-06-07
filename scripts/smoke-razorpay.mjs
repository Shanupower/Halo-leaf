const pk =
  "pk_70ca73c17ee824900f515e9bb9456225fbcb450d8748bf5c1a4cc78ea7e7fd01";
const regId = "reg_01KMZJBGZYTC5HDF223QPDTTEK";
const base = "http://localhost:9000";
const email = `testpay_${Date.now()}@haloleaf.local`;
const password = "Test123!Halo";

const pub = {
  "Content-Type": "application/json",
  "x-publishable-api-key": pk,
};

async function api(method, path, { token, body } = {}) {
  const headers = { ...pub };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  return data;
}

async function main() {
  try {
    await api("POST", "/auth/customer/emailpass/register", {
      body: { email, password },
    });
  } catch {
    /* exists */
  }

  const { token } = await api("POST", "/auth/customer/emailpass", {
    body: { email, password },
  });

  try {
    await api("POST", "/store/customers", {
      token,
      body: { email, first_name: "Test", last_name: "Buyer" },
    });
  } catch {
    /* exists */
  }

  const { cart: created } = await api("POST", "/store/carts", {
    token,
    body: { region_id: regId },
  });
  const cartId = created.id;

  const { products } = await api(
    "GET",
    `/store/products?region_id=${regId}&limit=1`
  );
  const variantId = products[0].variants[0].id;

  await api("POST", `/store/carts/${cartId}/line-items`, {
    token,
    body: { variant_id: variantId, quantity: 1 },
  });

  await api("POST", `/store/carts/${cartId}`, {
    token,
    body: {
      email,
      shipping_address: {
        first_name: "Test",
        last_name: "Buyer",
        address_1: "Vanasthalipuram",
        city: "Hyderabad",
        country_code: "in",
        postal_code: "500070",
        phone: "9876543210",
      },
      billing_address: {
        first_name: "Test",
        last_name: "Buyer",
        address_1: "Vanasthalipuram",
        city: "Hyderabad",
        country_code: "in",
        postal_code: "500070",
        phone: "9876543210",
      },
    },
  });

  const { shipping_options } = await api(
    "GET",
    `/store/shipping-options?cart_id=${cartId}`,
    { token }
  );
  if (!shipping_options?.length) throw new Error("No shipping options");
  await api("POST", `/store/carts/${cartId}/shipping-methods`, {
    token,
    body: { option_id: shipping_options[0].id },
  });

  const { payment_collection: pc1 } = await api(
    "POST",
    "/store/payment-collections",
    { token, body: { cart_id: cartId } }
  );
  const { payment_collection: pc2 } = await api(
    "POST",
    `/store/payment-collections/${pc1.id}/payment-sessions`,
    { token, body: { provider_id: "pp_razorpay_razorpay" } }
  );
  const session = pc2.payment_sessions?.find(
    (s) => s.provider_id === "pp_razorpay_razorpay"
  );
  const order = session?.data?.razorpayOrder;
  if (!order?.id) throw new Error("Razorpay order missing");

  const { cart } = await api("GET", `/store/carts/${cartId}`, { token });
  console.log("PASS razorpay");
  console.log("order_id:", order.id);
  console.log("amount:", order.amount, order.currency);
  console.log("shipping:", shipping_options[0].name);
  console.log("cart_total:", cart.total, cart.currency_code);
}

main().catch((e) => {
  console.error("FAIL", e.message);
  process.exit(1);
});
