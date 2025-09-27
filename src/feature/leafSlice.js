import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, post, remove, update } from "./api";
import { storeLeafUser } from "../helper/helper";
const initialState = {
  leaf: [],
  activeTab: "Home",
  loading: false,

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
  order: [],
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
      const response = await post("/auth/signup", user);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed!");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await post("/auth/login", data);
      console.log(response);

      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "SignIn failed!");
    }
  }
);

export const createUserAddress = createAsyncThunk(
  "user/address",
  async (data, { rejectWithValue }) => {
    try {
      const res = await post("/addresses", { data: data });
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong!");
    }
  }
);

export const fetchUserDetails = createAsyncThunk("user/details", async (id) => {
  try {
    const response = await get(`/user-accounts/${id}?populate=*`);
    return response.data;
  } catch (error) {
    return error;
  }
});

export const UpdateUserDetails = createAsyncThunk(
  "user/Updatedetails",
  async ({ id, data }) => {
    try {
      const response = await update(`/user-accounts/${id}`, { data });

      return response.data.data;
    } catch (error) {
      return error;
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async (id) => {
    const response = await remove(`/addresses/${id}`);
    return id;
  }
);
export const UpdateUserAddress = createAsyncThunk(
  "user/UpdateAddress",
  async ({ id, data }) => {
    try {
      const response = await update(`/addresses/${id}`, { data });
      return response.data;
    } catch (error) {
      console.error("API Request Error:", error.response?.data);
      throw error;
    }
  }
);

export const fetchProductList = createAsyncThunk("shop/product", async () => {
  try {
    console.log("Fetching products from API...");
    const response = await get(`/products?populate=*`);
    console.log("Products API Response:", response);
    console.log("Products Data:", response.data);
    console.log("Products Data.data:", response.data.data);
    // Return the actual data array from Strapi response
    return response.data.data || [];
  } catch (error) {
    console.error("Products API Error:", error);
    return error;
  }
});

export const fetchCategorytList = createAsyncThunk("category", async () => {
  try {
    console.log("🚀 Fetching categories from API...");
    const response = await get(`/categories?populate=*`);
    console.log("📦 Categories API Response:", response);
    console.log("📊 Categories Data:", response.data);
    console.log("📋 Categories Data.data:", response.data?.data);
    
    // Check if response.data.data exists, otherwise use response.data directly
    const categoriesData = response.data?.data || response.data || [];
    console.log("✅ Final categories data being returned:", categoriesData);
    console.log("📏 Categories count:", categoriesData.length);
    
    // Log first category structure for debugging
    if (categoriesData.length > 0) {
      console.log("🔍 First category in response:", categoriesData[0]);
      console.log("🖼️ First category image:", categoriesData[0].image);
    } else {
      console.warn("⚠️ No categories found in API response");
    }
    
    // Return the actual data array from Strapi response
    return categoriesData;
  } catch (error) {
    console.error("❌ Categories API Error:", error);
    console.error("❌ Error details:", error.response?.data || error.message);
    return [];
  }
});

export const fetchTestimonialsList = createAsyncThunk("testimonials", async () => {
  try {
    console.log("Fetching testimonials from API...");
    const response = await get(`/test?populate=*`);
    console.log("Testimonials API Response:", response);
    console.log("Testimonials Data:", response.data);
    console.log("Testimonials Data.data:", response.data.data);
    // Return the actual data array from Strapi response
    return response.data.data || [];
  } catch (error) {
    console.error("Testimonials API Error:", error);
    return error;
  }
});

const leafSlice = createSlice({
  name: "leaf",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cart.find((i) => i.id === item.id);
      if (existItem) {
        existItem.quantity += item.quantity || 1;
      } else {
        state.cart.push({ ...item, quantity: item.quantity || 1 });
      }
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cart = state.cart.filter((item) => item.id !== id);
    },

    // Update item quantity
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },

    // Clear cart
    clearCart: (state) => {
      state.cart = [];
    },
  },

  extraReducers: (builder) => {
    // signup
    builder
      .addCase(createUserData.pending, (state) => {
        state.user.loading = true;
        state.user.error = "";
      })
      .addCase(createUserData.fulfilled, (state, action) => {
        state.user.loading = false;
        localStorage.setItem("leafUserid", action?.payload?.user?.documentId);
      })
      .addCase(createUserData.rejected, (state, action) => {
        state.user.loading = false;
      });

    // login

    builder.addCase(loginUser.pending, (state, action) => {
      state.user.loading = true;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user.loading = false;
      storeLeafUser(action.payload);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.user.loading = false;
    });

    //addresses
    builder.addCase(createUserAddress.pending, (state, action) => {
      state.user.loading = true;
    });
    builder.addCase(createUserAddress.fulfilled, (state, action) => {
      state.user.loading = false;
      state.user.addresses.push(action.payload);
    });
    builder.addCase(createUserAddress.rejected, (state, action) => {
      state.user.loading = false;
    });

    //user details

    builder.addCase(fetchUserDetails.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      (state.user.name = action.payload?.name),
        (state.user.email = action.payload?.email),
        (state.user.phone = action.payload?.phone),
        (state.user.alternatePhone = action.payload?.alternatePhone),
        (state.user.id = action.payload?.documentId),
        (state.user.addresses = action.payload.addresses);
    });

    builder.addCase(fetchUserDetails.rejected, (state, action) => {
      state.loading = false;
    });

    //update user  details

    builder.addCase(UpdateUserDetails.pending, (state, action) => {
      state.user.loading = true;
    });
    builder.addCase(UpdateUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      (state.user.name = action.payload?.name),
        (state.user.email = action.payload?.email),
        (state.user.phone = action.payload?.phone),
        (state.user.alternatePhone = action.payload?.alternatePhone);
    });
    builder.addCase(UpdateUserDetails.rejected, (state, action) => {
      state.loading = false;
    });

    // delete Address

    builder.addCase(deleteAddress.pending, (state, action) => {
      state.user.loading = true;
    });
    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.user.loading = false;
      state.user.addresses = state.user.addresses.filter(
        (item) => item.documentId !== action.payload
      );
    });
    builder.addCase(deleteAddress.rejected, (state, action) => {
      state.user.loading = false;
    });

    // update address
    builder.addCase(UpdateUserAddress.pending, (state, action) => {
      state.user.loading = true;
    });
    builder.addCase(UpdateUserAddress.fulfilled, (state, action) => {
      state.user.loading = false;
      console.log(action.payload);

      const index = state.user.addresses.findIndex(
        (address) => address.documentId === action.payload.data.documentId
      );

      console.log(index);

      if (index !== -1) {
        state.user.addresses.splice(index, 1, action.payload.data);
      }
    });
    builder.addCase(UpdateUserAddress.rejected, (state, action) => {
      state.user.loading = false;
    });

    // Fetch Product List
    builder.addCase(fetchProductList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchProductList.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(fetchProductList.rejected, (state, action) => {
      state.loading = false;
    });

    // Fetch CategorytList
    builder.addCase(fetchCategorytList.pending, (state, action) => {
      console.log("🔄 Categories API pending...");
      state.loading = true;
    });
    builder.addCase(fetchCategorytList.fulfilled, (state, action) => {
      console.log("✅ Categories API fulfilled with payload:", action.payload);
      state.loading = false;
      state.category = action.payload;
      console.log("💾 Categories stored in Redux state:", state.category);
    });
    builder.addCase(fetchCategorytList.rejected, (state, action) => {
      console.error("❌ Categories API rejected:", action.payload);
      state.loading = false;
    });

    // Fetch TestimonialsList
    builder.addCase(fetchTestimonialsList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchTestimonialsList.fulfilled, (state, action) => {
      state.loading = false;
      state.testimonials = action.payload;
    });
    builder.addCase(fetchTestimonialsList.rejected, (state, action) => {
      state.loading = false;
    });
  },
});
export const {
  setActiveTab,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} = leafSlice.actions;

export default leafSlice.reducer;
