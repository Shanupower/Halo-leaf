# Production Smoke Test

Run this checklist after local setup, staging deploys, and production deploys.

## Preconditions

- Medusa backend is running.
- Storefront points to the backend with `VITE_API_BASE_URL`.
- `VITE_MEDUSA_PUBLISHABLE_KEY` is set and attached to the correct sales channel.
- Production region has products, prices, shipping options, Stripe, and Razorpay enabled.
- Payment providers are in test mode until the full checklist passes.

## Customer Lifecycle

1. Open the homepage and confirm products/categories/testimonials load.
2. Open `/product` and confirm all products render.
3. Open a category page and confirm only products in that Medusa category render.
4. Open a product details page.
5. Run the pincode serviceability check.
6. Add the product to cart.
7. Open `/cart`.
8. Increase quantity.
9. Decrease quantity.
10. Remove an item.
11. Add the product again and proceed to checkout.
12. If signed out, confirm checkout redirects to `/sign-in`.
13. Sign up with a new customer.
14. Sign out/sign in with that customer.
15. Add a delivery address.
16. Select the address during checkout.
17. Confirm payment step only enables after cart, email, address, shipping, and provider readiness.
18. Prepare a Stripe payment session.
19. Complete Stripe test payment and confirm order completion.
20. Repeat with Razorpay test mode.
21. Confirm `/order-details/:id` shows real order line items, totals, shipping, status, fulfillment, and payment status.
22. Open Profile → My Orders and confirm the order appears.
23. Open the order details from My Orders.
24. Create a cancel request.
25. Create a return request.
26. Create an exchange request.
27. Create a support note.
28. Cancel a pending request and confirm its status updates.

## Admin Follow-Up

1. Open Medusa Admin.
2. Confirm the order exists.
3. Confirm customer details and addresses are present.
4. Review customer action requests in the backend datastore or admin tooling.
5. Perform actual cancellation/refund/return/exchange handling using admin workflows.

## Rollback Criteria

Rollback if any of these fail in production:

- Customers cannot add products to cart.
- Checkout cannot complete with test payments.
- Orders do not appear in Profile → My Orders.
- Payment webhooks fail.
- Backend logs show repeated database, Redis, or payment provider failures.
