import { Payment } from "../UserOrder/payment/payment";

/** Dedicated route for Razorpay-focused checkout (same flow as Order → Payment). */
export const RazorpayCheckout = () => {
  return <Payment />;
};
