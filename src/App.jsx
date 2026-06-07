import React, { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { RedirectToAbout } from "./routes/RedirectToAbout";
import { LegacyProductRedirect } from "./routes/LegacyProductRedirect";
import { LegacyCategoryRedirect } from "./routes/LegacyCategoryRedirect";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
// Layout
import { HomeLayout } from "./layouts";

// Components
import Loading from "./component/model/loading";
import Preloader from './component/common/Preloader';
import ScrollToTop from './component/common/ScrollToTop'; 


// Pages
import {
  Address,
  Cart,
  ContactUs,
  EmailComponent,
  EnterOTP,
  ForgotPassword,
  Home,
  OrderDetails,
  ProductDetails,
  Profile,
  RazorpayCheckout,
  Review,
  Shop,
  SignIn,
  Signup,
  Testimonial,
  UpdateAddress,
  UserOrder,
  WhyUs,
  Wishlist,
  CheckoutSuccess,
  CheckoutFailed,

} from "./Page";

// Redux actions
import {
  fetchUserDetails,
} from "./feature/leafSlice";

// Animation wrapper component
const AnimatePage = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, product, loading, category, testimonials } = useSelector(
    (state) => state.leaf
  );
  const id = localStorage.getItem("leafUserid");
  const [preloaderLoading, setPreloaderLoading] = useState(true);
  const logoRef = useRef();

  const fetchData = () => {
    const token = localStorage.getItem("access_token");
    if (token && id && !user?.id) {
      dispatch(fetchUserDetails());
    }
    // Products, categories, and testimonials are now loaded in the preloader
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <>
    
      {preloaderLoading && (
        <Preloader
          onFinish={() => setPreloaderLoading(false)}
          logoRef={logoRef}
        />
      )}
      {!preloaderLoading && (
        <>
        <ScrollToTop />
          <AnimatePresence mode="wait" >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomeLayout showHeader={!preloaderLoading} />}>
                
                <Route
                  index
                  element={
                    <AnimatePage>
                      <Home />
                    </AnimatePage>
                  }
                />
                <Route
                  path="process"
                  element={
                    <AnimatePage>
                      <WhyUs />
                    </AnimatePage>
                  }
                />
                <Route path="why-us" element={<Navigate to="/process" replace />} />
                <Route
                  path="testimonials"
                  element={
                    <AnimatePage>
                      <Testimonial />
                    </AnimatePage>
                  }
                />
                <Route
                  path="products"
                  element={
                    <AnimatePage>
                      <Shop />
                    </AnimatePage>
                  }
                />
                <Route
                  path="products/category/:categoryId"
                  element={
                    <AnimatePage>
                      <Shop />
                    </AnimatePage>
                  }
                />
                <Route
                  path="products/:id"
                  element={
                    <AnimatePage>
                      <ProductDetails />
                    </AnimatePage>
                  }
                />
                <Route path="product" element={<Navigate to="/products" replace />} />
                <Route
                  path="product/category/:categoryId"
                  element={<LegacyCategoryRedirect />}
                />
                <Route
                  path="product/details/:id"
                  element={<LegacyProductRedirect />}
                />
                <Route
                  path="cart"
                  element={
                    <AnimatePage>
                      <Cart />
                    </AnimatePage>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <AnimatePage>
                      <Profile />
                    </AnimatePage>
                  }
                />
                <Route
                  path="review"
                  element={
                    <AnimatePage>
                      <Review />
                    </AnimatePage>
                  }
                />
                <Route
                  path="wishlist"
                  element={
                    <AnimatePage>
                      <Wishlist />
                    </AnimatePage>
                  }
                />
                <Route
                  path="otp"
                  element={
                    <AnimatePage>
                      <EnterOTP />
                    </AnimatePage>
                  }
                />
                <Route
                  path="order"
                  element={
                    <AnimatePage>
                      <UserOrder />
                    </AnimatePage>
                  }
                />
                <Route
                  path="checkout/success"
                  element={
                    <AnimatePage>
                      <CheckoutSuccess />
                    </AnimatePage>
                  }
                />
                <Route
                  path="checkout/failed"
                  element={
                    <AnimatePage>
                      <CheckoutFailed />
                    </AnimatePage>
                  }
                />
                <Route
                  path="checkout/razorpay"
                  element={
                    <AnimatePage>
                      <RazorpayCheckout />
                    </AnimatePage>
                  }
                />
                <Route
                  path="address/:documentId"
                  element={
                    <AnimatePage>
                      <UpdateAddress />
                    </AnimatePage>
                  }
                />
                <Route path="product/:id" element={<LegacyProductRedirect />} />
                <Route
                  path="order-details/:id"
                  element={
                    <AnimatePage>
                      <OrderDetails />
                    </AnimatePage>
                  }
                />
                <Route
                  path="contact"
                  element={
                    <AnimatePage>
                      <ContactUs />
                    </AnimatePage>
                  }
                />
                <Route path="contact-us" element={<Navigate to="/contact" replace />} />
                <Route path="about" element={<RedirectToAbout />} />
                <Route
                  path="signup"
                  element={
                    <AnimatePage>
                      <Signup />
                    </AnimatePage>
                  }
                />
                <Route
                  path="sign-in"
                  element={
                    <AnimatePage>
                      <SignIn />
                    </AnimatePage>
                  }
                />
                <Route
                  path="address"
                  element={
                    <AnimatePage>
                      <Address />
                    </AnimatePage>
                  }
                />
                <Route
                  path="email"
                  element={
                    <AnimatePage>
                      <EmailComponent />
                    </AnimatePage>
                  }
                />
                <Route
                  path="forgot-password"
                  element={
                    <AnimatePage>
                      <ForgotPassword />
                    </AnimatePage>
                  }
                />
              </Route>
              <Route
                path="*"
                element={
                  <AnimatePage>
                    <div>404 - Page Not Found</div>
                  </AnimatePage>
                }
              />
             
            </Routes>

            
          </AnimatePresence>

          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </>
      )}
    </>
  );
}

export default App;
