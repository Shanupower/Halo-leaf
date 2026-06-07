import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { splitNameForMedusa } from "../utils/customer-name";
import { storeLeafUser } from "../helper/helper";
import {
  addLineItem,
  applyCartShippingQuote,
  attachCustomerToCart,
  cancelOrderActionRequest,
  completeCart,
  createCart,
  createOrderActionRequest,
  deleteLineItem,
  ensureRegionId,
  fetchTestimonials,
  getStoredCartId,
  listCategories,
  listOrderActionRequests,
  listProducts,
  listOrders,
  retrieveCart,
  retrieveProduct,
  setStoredCartId,
  updateCart,
  updateLineItem,
} from "../api/medusa/store";
import {
  createCustomer,
  createCustomerAddress,
  deleteCustomerAddress,
  loginIdentity,
  registerIdentity,
  retrieveCustomerMe,
  updateCustomerAddress,
  updateCustomerMe,
} from "../api/medusa/auth";
import {
  emptyCartSummary,
  syncCartFromMedusa as buildCartSyncPayload,
  mapHaloTestimonialToUi,
  mapMedusaAddressToUi,
  mapMedusaCategoryToUi,
  mapMedusaProductToUi,
  uiAddressToMedusa,
} from "../api/mappers/medusa";

const isDev = import.meta.env.DEV;

const requestErrorMessage = (error, fallback) =>
  typeof error === "string" ? error : error?.message || fallback;

function applyCartPayload(state, payload) {
  if (payload && typeof payload === "object" && Array.isArray(payload.items)) {
    state.cart = payload.items;
    state.cartSummary = payload.summary || emptyCartSummary();
    return;
  }
  state.cart = Array.isArray(payload) ? payload : [];
  if (!Array.isArray(payload)) {
    state.cartSummary = emptyCartSummary();
  }
}

const initialState = {
  leaf: [],
  activeTab: "Home",
  loading: false,
  cartSyncing: false,
  dataStatus: {
    products: { loading: false, error: "" },
    categories: { loading: false, error: "" },
    testimonials: { loading: false, error: "" },
  },

  user: {
    loading: false,
    addresses: [],
    name: "",
    email: "",
    id: "",
    phone: "",
    alternatePhone: "",
  },

  cart: [],
  cartSummary: emptyCartSummary(),
  order: [],
  orderLoading: false,
  orderError: "",
  orderMeta: {
    count: 0,
    offset: 0,
    limit: 20,
  },
  orderActionRequests: {},
  wishList: [],
  category: [],
  product: [],
  testimonials: [],

  OrderItem: [{ item: [], totalPrice: 0, address: {}, paymentInfo: {} }],
};

export const createUserData = createAsyncThunk(
  "user/create",
  async (user, { rejectWithValue }) => {
    try {
      const { email, password, name, phone } = user;
      const { first_name, last_name } = splitNameForMedusa(name);
      const { token } = await registerIdentity(email, password);
      localStorage.setItem("access_token", token);
      const { customer } = await createCustomer({
        email,
        first_name,
        last_name,
        phone: phone ? String(phone) : undefined,
      });
      const { token: customerToken } = await loginIdentity(email, password);
      localStorage.setItem("access_token", customerToken);
      storeLeafUser({ token: customerToken, customer });
      const cid = getStoredCartId();
      if (cid) {
        try {
          await attachCustomerToCart(cid);
        } catch {
          /* optional */
        }
      }
      return { token, customer };
    } catch (error) {
      const msg = error?.message || error || "Signup failed!";
      return rejectWithValue(
        typeof msg === "string" ? msg : "Signup failed. If you already have an account, sign in."
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const { token } = await loginIdentity(data.email, data.password);
      localStorage.setItem("access_token", token);
      const { customer } = await retrieveCustomerMe();
      storeLeafUser({ token, customer });
      const cid = getStoredCartId();
      if (cid) {
        try {
          await attachCustomerToCart(cid);
        } catch {
          /* optional */
        }
      }
      return { token, customer };
    } catch (error) {
      return rejectWithValue(error?.message || "Sign in failed");
    }
  }
);

export const createUserAddress = createAsyncThunk(
  "user/address",
  async (data, { getState, rejectWithValue }) => {
    try {
      const name = getState().leaf.user.name;
      const body = uiAddressToMedusa(data, name);
      const res = await createCustomerAddress(body);
      return res?.customer;
    } catch (error) {
      return rejectWithValue({
        status: error?.status,
        message: error?.message || "Something went wrong!",
      });
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "user/details",
  async (_unused, { rejectWithValue }) => {
    try {
      const { customer } = await retrieveCustomerMe();
      return customer;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const UpdateUserDetails = createAsyncThunk(
  "user/Updatedetails",
  async ({ data, id: _profileId }, { rejectWithValue }) => {
    try {
      const { first_name, last_name } = splitNameForMedusa(data?.name);
      const { customer } = await updateCustomerMe({
        first_name,
        last_name,
        phone: data?.phone,
      });
      return customer;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async (id) => {
    await deleteCustomerAddress(id);
    return id;
  }
);

export const UpdateUserAddress = createAsyncThunk(
  "user/UpdateAddress",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const name = getState().leaf.user.name;
      const body = uiAddressToMedusa(data, name);
      const res = await updateCustomerAddress(id, body);
      return res?.customer;
    } catch (error) {
      return rejectWithValue(error?.message || "Update failed");
    }
  }
);

export const fetchProductList = createAsyncThunk(
  "shop/product",
  async (_unused, { rejectWithValue }) => {
    try {
      const regionId = await ensureRegionId();
      const response = await listProducts(regionId);
      const products = response?.products || [];
      return products.map(mapMedusaProductToUi);
    } catch (error) {
      if (isDev) console.error("Products API Error:", error);
      return rejectWithValue(
        requestErrorMessage(error, "Could not load products from Medusa")
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "shop/productOne",
  async (productId, { rejectWithValue }) => {
    try {
      const regionId = await ensureRegionId();
      const res = await retrieveProduct(productId, regionId);
      const p = res?.product;
      if (!p) return rejectWithValue("Not found");
      return mapMedusaProductToUi(p);
    } catch (error) {
      return rejectWithValue(error?.message || "Product not found");
    }
  }
);

export const fetchCategorytList = createAsyncThunk(
  "category",
  async (_unused, { rejectWithValue }) => {
    try {
      const response = await listCategories();
      const categories =
        response?.product_categories || response?.categories || [];
      return categories.map(mapMedusaCategoryToUi);
    } catch (error) {
      if (isDev) console.error("Categories API Error:", error);
      return rejectWithValue(
        requestErrorMessage(error, "Could not load categories from Medusa")
      );
    }
  }
);

export const fetchTestimonialsList = createAsyncThunk(
  "testimonials",
  async (_unused, { rejectWithValue }) => {
    try {
      const { testimonials } = await fetchTestimonials();
      return (testimonials || []).map(mapHaloTestimonialToUi);
    } catch (error) {
      if (isDev) console.error("Testimonials API Error:", error);
      return rejectWithValue(
        requestErrorMessage(error, "Could not load testimonials from Medusa")
      );
    }
  }
);

export const fetchOrdersList = createAsyncThunk(
  "orders/list",
  async ({ limit = 20, offset = 0 } = {}, { rejectWithValue }) => {
    try {
      const res = await listOrders({ limit, offset });
      return {
        orders: res?.orders || [],
        count: res?.count || 0,
        offset: res?.offset || offset,
        limit: res?.limit || limit,
      };
    } catch (error) {
      return rejectWithValue(
        error?.message || "Could not load your order history"
      );
    }
  }
);

export const fetchOrderActionRequests = createAsyncThunk(
  "orders/actions-list",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await listOrderActionRequests(orderId);
      return { orderId, actionRequests: res?.action_requests || [] };
    } catch (error) {
      return rejectWithValue(
        error?.message || "Could not load order action requests"
      );
    }
  }
);

export const createOrderActionUpdate = createAsyncThunk(
  "orders/action-create",
  async ({ orderId, type, reason, items, metadata }, { rejectWithValue }) => {
    try {
      const res = await createOrderActionRequest(orderId, {
        type,
        reason,
        items,
        metadata,
      });
      return { orderId, actionRequest: res?.action_request };
    } catch (error) {
      return rejectWithValue(
        error?.message || "Could not create order action request"
      );
    }
  }
);

export const cancelOrderActionUpdate = createAsyncThunk(
  "orders/action-cancel",
  async ({ orderId, actionId }, { rejectWithValue }) => {
    try {
      const res = await cancelOrderActionRequest(orderId, actionId);
      return { orderId, actionRequest: res?.action_request };
    } catch (error) {
      return rejectWithValue(
        error?.message || "Could not cancel order action request"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ item, quantity = 1 }, { rejectWithValue }) => {
    try {
      const regionId = await ensureRegionId();
      const variantId = item?.variant_id || item?.variants?.[0]?.id;
      if (!variantId) {
        throw new Error("This product has no purchasable variant.");
      }
      let cartId = getStoredCartId();
      if (!cartId) {
        const created = await createCart({ region_id: regionId });
        cartId = created.cart?.id;
        setStoredCartId(cartId);
      }
      await addLineItem(cartId, {
        variant_id: variantId,
        quantity: quantity || 1,
      });
      const { cart } = await retrieveCart(cartId);
      return buildCartSyncPayload(cart);
    } catch (error) {
      return rejectWithValue(error?.message || "Could not add to cart");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (variantId, { getState, rejectWithValue }) => {
    try {
      const cartId = getStoredCartId();
      if (!cartId) return buildCartSyncPayload(null);
      const line = getState().leaf.cart.find((i) => i.id === variantId);
      const lineId = line?.medusaLineId;
      if (lineId) {
        await deleteLineItem(cartId, lineId);
      }
      const { cart } = await retrieveCart(cartId);
      return buildCartSyncPayload(cart);
    } catch (error) {
      return rejectWithValue(error?.message || "Could not remove item");
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/qty",
  async ({ id, quantity }, { getState, rejectWithValue }) => {
    try {
      const cartId = getStoredCartId();
      if (!cartId) {
        return {
          items: getState().leaf.cart,
          summary: getState().leaf.cartSummary,
        };
      }
      const item = getState().leaf.cart.find((i) => i.id === id);
      const lineId = item?.medusaLineId;
      if (!lineId) {
        return {
          items: getState().leaf.cart,
          summary: getState().leaf.cartSummary,
        };
      }
      if (quantity <= 0) {
        await deleteLineItem(cartId, lineId);
      } else {
        await updateLineItem(cartId, lineId, { quantity });
      }
      const { cart } = await retrieveCart(cartId);
      return buildCartSyncPayload(cart);
    } catch (error) {
      return rejectWithValue(error?.message || "Could not update quantity");
    }
  }
);

export const syncCartFromMedusa = createAsyncThunk(
  "cart/sync",
  async () => {
    try {
      const cartId = getStoredCartId();
      if (!cartId) return buildCartSyncPayload(null);
      const { cart } = await retrieveCart(cartId);
      return buildCartSyncPayload(cart);
    } catch {
      setStoredCartId(null);
      return buildCartSyncPayload(null);
    }
  }
);

export const applyCheckoutAddress = createAsyncThunk(
  "cart/shippingAddress",
  async (uiAddress, { getState, rejectWithValue }) => {
    try {
      const cartId = getStoredCartId();
      if (!cartId) throw new Error("Cart not found. Add items first.");
      const name = getState().leaf.user.name;
      const email = getState().leaf.user.email;
      const addr = uiAddressToMedusa(uiAddress, name);
      await updateCart(cartId, {
        email: email || undefined,
        shipping_address: addr,
        billing_address: addr,
      });

      let shippingExtra = {};
      try {
        const applied = await applyCartShippingQuote(cartId);
        shippingExtra = {
          estimatedDeliveryDays:
            applied?.shipping?.estimated_delivery_days ?? null,
        };
      } catch (quoteError) {
        return rejectWithValue(
          quoteError?.message || "Could not calculate shipping for this address"
        );
      }

      const { cart } = await retrieveCart(cartId);
      return buildCartSyncPayload(cart, shippingExtra);
    } catch (error) {
      return rejectWithValue(error?.message || "Could not set delivery address");
    }
  }
);

export const completeMedusaOrder = createAsyncThunk(
  "cart/complete",
  async (_, { rejectWithValue }) => {
    try {
      const cartId = getStoredCartId();
      if (!cartId) throw new Error("No active checkout");
      const result = await completeCart(cartId);
      if (result?.type === "order" && result?.order) {
        setStoredCartId(null);
        return result.order;
      }
      const errMsg =
        result?.error?.message ||
        (typeof result?.error === "string" ? result.error : null) ||
        "Checkout could not be completed";
      return rejectWithValue(errMsg);
    } catch (error) {
      return rejectWithValue(error?.message || "Order failed");
    }
  }
);

const leafSlice = createSlice({
  name: "leaf",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearCart: (state) => {
      state.cart = [];
      state.cartSummary = emptyCartSummary();
      setStoredCartId(null);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createUserData.pending, (state) => {
        state.user.loading = true;
        state.user.error = "";
      })
      .addCase(createUserData.fulfilled, (state, action) => {
        state.user.loading = false;
        const c = action.payload.customer;
        state.user.id = c.id;
        state.user.email = c.email;
        state.user.name = `${c.first_name || ""} ${c.last_name || ""}`.trim();
        state.user.phone = c.phone;
        state.user.addresses = (c.addresses || []).map(mapMedusaAddressToUi);
      })
      .addCase(createUserData.rejected, (state) => {
        state.user.loading = false;
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.user.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user.loading = false;
        const c = action.payload.customer;
        state.user.id = c.id;
        state.user.email = c.email;
        state.user.name = `${c.first_name || ""} ${c.last_name || ""}`.trim();
        state.user.phone = c.phone;
        state.user.addresses = (c.addresses || []).map(mapMedusaAddressToUi);
      })
      .addCase(loginUser.rejected, (state) => {
        state.user.loading = false;
      });

    builder
      .addCase(createUserAddress.pending, (state) => {
        state.user.loading = true;
      })
      .addCase(createUserAddress.fulfilled, (state, action) => {
        state.user.loading = false;
        const c = action.payload;
        if (c?.addresses) {
          state.user.addresses = c.addresses.map(mapMedusaAddressToUi);
        }
      })
      .addCase(createUserAddress.rejected, (state) => {
        state.user.loading = false;
      });

    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        const p = action.payload;
        state.user.name = `${p?.first_name || ""} ${p?.last_name || ""}`.trim();
        state.user.email = p?.email;
        state.user.phone = p?.phone;
        state.user.id = p?.id;
        state.user.addresses = (p?.addresses || []).map(mapMedusaAddressToUi);
        const token = localStorage.getItem("access_token");
        if (token && p) {
          storeLeafUser({ token, customer: p });
        }
      })
      .addCase(fetchUserDetails.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(UpdateUserDetails.pending, (state) => {
        state.user.loading = true;
      })
      .addCase(UpdateUserDetails.fulfilled, (state, action) => {
        state.user.loading = false;
        const p = action.payload;
        state.user.name = `${p?.first_name || ""} ${p?.last_name || ""}`.trim();
        state.user.email = p?.email;
        state.user.phone = p?.phone;
        const token = localStorage.getItem("access_token");
        if (token && p) {
          storeLeafUser({ token, customer: p });
        }
      })
      .addCase(UpdateUserDetails.rejected, (state) => {
        state.user.loading = false;
      });

    builder
      .addCase(deleteAddress.pending, (state) => {
        state.user.loading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.user.loading = false;
        state.user.addresses = state.user.addresses.filter(
          (item) => item.documentId !== action.payload
        );
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.user.loading = false;
      });

    builder
      .addCase(UpdateUserAddress.pending, (state) => {
        state.user.loading = true;
      })
      .addCase(UpdateUserAddress.fulfilled, (state, action) => {
        state.user.loading = false;
        const c = action.payload;
        if (c?.addresses) {
          state.user.addresses = c.addresses.map(mapMedusaAddressToUi);
        }
      })
      .addCase(UpdateUserAddress.rejected, (state) => {
        state.user.loading = false;
      });

    builder
      .addCase(fetchProductList.pending, (state) => {
        state.loading = true;
        state.dataStatus.products.loading = true;
        state.dataStatus.products.error = "";
      })
      .addCase(fetchProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.dataStatus.products.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductList.rejected, (state, action) => {
        state.loading = false;
        state.dataStatus.products.loading = false;
        state.dataStatus.products.error =
          typeof action.payload === "string"
            ? action.payload
            : "Could not load products from Medusa";
      });

    builder
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const p = action.payload;
        const idx = state.product.findIndex((x) => x.documentId === p.documentId);
        if (idx >= 0) state.product[idx] = p;
        else state.product.push(p);
      });

    builder
      .addCase(fetchCategorytList.pending, (state) => {
        state.loading = true;
        state.dataStatus.categories.loading = true;
        state.dataStatus.categories.error = "";
      })
      .addCase(fetchCategorytList.fulfilled, (state, action) => {
        state.loading = false;
        state.dataStatus.categories.loading = false;
        state.category = action.payload;
      })
      .addCase(fetchCategorytList.rejected, (state, action) => {
        state.loading = false;
        state.dataStatus.categories.loading = false;
        state.dataStatus.categories.error =
          typeof action.payload === "string"
            ? action.payload
            : "Could not load categories from Medusa";
      });

    builder
      .addCase(fetchTestimonialsList.pending, (state) => {
        state.loading = true;
        state.dataStatus.testimonials.loading = true;
        state.dataStatus.testimonials.error = "";
      })
      .addCase(fetchTestimonialsList.fulfilled, (state, action) => {
        state.loading = false;
        state.dataStatus.testimonials.loading = false;
        state.testimonials = action.payload;
      })
      .addCase(fetchTestimonialsList.rejected, (state, action) => {
        state.loading = false;
        state.dataStatus.testimonials.loading = false;
        state.dataStatus.testimonials.error =
          typeof action.payload === "string"
            ? action.payload
            : "Could not load testimonials from Medusa";
      });

    builder
      .addCase(fetchOrdersList.pending, (state) => {
        state.orderLoading = true;
        state.orderError = "";
      })
      .addCase(fetchOrdersList.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.order = action.payload.orders;
        state.orderMeta = {
          count: action.payload.count,
          offset: action.payload.offset,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchOrdersList.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError =
          typeof action.payload === "string"
            ? action.payload
            : "Could not load your order history";
      });

    builder
      .addCase(fetchOrderActionRequests.fulfilled, (state, action) => {
        state.orderActionRequests[action.payload.orderId] =
          action.payload.actionRequests;
      })
      .addCase(createOrderActionUpdate.fulfilled, (state, action) => {
        const { orderId, actionRequest } = action.payload;
        if (!actionRequest) return;
        const current = state.orderActionRequests[orderId] || [];
        state.orderActionRequests[orderId] = [actionRequest, ...current];
      })
      .addCase(cancelOrderActionUpdate.fulfilled, (state, action) => {
        const { orderId, actionRequest } = action.payload;
        if (!actionRequest) return;
        const current = state.orderActionRequests[orderId] || [];
        const idx = current.findIndex((item) => item.id === actionRequest.id);
        if (idx >= 0) current.splice(idx, 1, actionRequest);
        else current.unshift(actionRequest);
      });

    const cartLoading = (state, loading) => {
      state.cartSyncing = loading;
    };

    builder
      .addCase(addToCart.pending, (state) => cartLoading(state, true))
      .addCase(addToCart.fulfilled, (state, action) => {
        cartLoading(state, false);
        applyCartPayload(state, action.payload);
      })
      .addCase(addToCart.rejected, (state) => cartLoading(state, false));

    builder
      .addCase(removeFromCart.pending, (state) => cartLoading(state, true))
      .addCase(removeFromCart.fulfilled, (state, action) => {
        cartLoading(state, false);
        applyCartPayload(state, action.payload);
      })
      .addCase(removeFromCart.rejected, (state) => cartLoading(state, false));

    builder
      .addCase(updateCartItemQuantity.pending, (state) => cartLoading(state, true))
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        cartLoading(state, false);
        applyCartPayload(state, action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state) => cartLoading(state, false));

    builder
      .addCase(syncCartFromMedusa.fulfilled, (state, action) => {
        applyCartPayload(state, action.payload);
      });

    builder
      .addCase(applyCheckoutAddress.pending, (state) => cartLoading(state, true))
      .addCase(applyCheckoutAddress.fulfilled, (state, action) => {
        cartLoading(state, false);
        applyCartPayload(state, action.payload);
      })
      .addCase(applyCheckoutAddress.rejected, (state) => cartLoading(state, false));

    builder.addCase(completeMedusaOrder.fulfilled, (state) => {
      state.cart = [];
      state.cartSummary = emptyCartSummary();
    });
  },
});

export const { setActiveTab, clearCart } = leafSlice.actions;

export default leafSlice.reducer;
