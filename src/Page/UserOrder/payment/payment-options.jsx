import { useCallback, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useRazorpay } from "react-razorpay";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  completeMedusaOrder,
  syncCartFromMedusa,
} from "../../../feature/leafSlice";
import {
  createPaymentCollection,
  createPaymentSession,
  getStoredCartId,
  listPaymentProviders,
  retrieveCart,
  waitForRazorpayOrderPaid,
} from "../../../api/medusa/store";
import { formatInr } from "../../../utils/money";

const isRazorpay = (id) => id?.includes("razorpay");

function RazorpaySection({ cart, session, onPaid, onPaymentFailed }) {
  const { Razorpay } = useRazorpay();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const key =
    import.meta.env.VITE_RAZORPAY_KEY_ID ||
    import.meta.env.VITE_RAZORPAY_PUBLISHABLE_KEY;
  const orderData = session?.data?.razorpayOrder;

  const handlePay = useCallback(() => {
    if (!key) {
      toast.error("Set VITE_RAZORPAY_KEY_ID in your storefront .env");
      return;
    }
    if (!orderData?.id || !cart?.currency_code) {
      toast.error("Razorpay order is not ready. Refresh and try again.");
      return;
    }

    const options = {
      key,
      order_id: orderData.id,
      currency: cart.currency_code.toUpperCase(),
      name: import.meta.env.VITE_SHOP_NAME || "Halo Leaf",
      description: "Order payment",
      handler: async (response) => {
        setConfirming(true);
        try {
          await waitForRazorpayOrderPaid(orderData.id);
          await onPaid(response);
        } catch (error) {
          const message =
            error?.message ||
            "Payment succeeded in Razorpay but could not be confirmed. Please try again.";
          toast.error(message);
          onPaymentFailed?.(message);
        } finally {
          setConfirming(false);
          setBusy(false);
        }
      },
      modal: {
        ondismiss: () => {
          if (!confirming) setBusy(false);
        },
      },
      prefill: {
        name: [
          cart.billing_address?.first_name,
          cart.billing_address?.last_name,
        ]
          .filter(Boolean)
          .join(" "),
        email: cart.email,
        contact: cart.shipping_address?.phone,
      },
    };

    setBusy(true);
    const rz = new Razorpay(options);
    rz.on("payment.failed", (response) => {
      toast.error("Razorpay payment failed");
      setBusy(false);
      setConfirming(false);
      onPaymentFailed?.(
        response?.error?.description ||
          response?.error?.reason ||
          "Payment was declined or cancelled."
      );
    });
    rz.open();
  }, [Razorpay, cart, confirming, key, onPaid, onPaymentFailed, orderData]);

  return (
    <button
      type="button"
      disabled={busy || confirming}
      onClick={handlePay}
      className="rounded-full bg-green-700 px-8 py-3 font-semibold text-white transition hover:bg-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {confirming ? (
        <span className="inline-flex items-center gap-2">
          <CircularProgress size={22} color="inherit" />
          Confirming payment…
        </span>
      ) : busy ? (
        <CircularProgress size={22} color="inherit" />
      ) : (
        "Pay with Razorpay"
      )}
    </button>
  );
}

export default function PaymentOptions() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxCart = useSelector((s) => s.leaf.cart);
  const [cart, setCart] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preparing, setPreparing] = useState(false);
  const [readinessErrors, setReadinessErrors] = useState([]);
  const [setupError, setSetupError] = useState("");

  const getReadinessErrors = (candidateCart) => {
    const errors = [];
    if (!candidateCart?.items?.length) errors.push("Cart has no items.");
    if (!candidateCart?.email) errors.push("Customer email is missing.");
    if (!candidateCart?.shipping_address) {
      errors.push("Shipping address is missing.");
    }
    if (!candidateCart?.billing_address) {
      errors.push("Billing address is missing.");
    }
    if (!candidateCart?.shipping_methods?.length) {
      errors.push("Shipping method is missing.");
    }
    return errors;
  };

  useEffect(() => {
    dispatch(syncCartFromMedusa());
  }, [dispatch]);

  const prepareRazorpaySession = useCallback(async (initialCart, razorpayProviderId) => {
    let c = initialCart;
    if (!c.payment_collection?.id) {
      await createPaymentCollection(c.id);
      ({ cart: c } = await retrieveCart(c.id));
    }
    const pcId = c.payment_collection?.id;
    if (!pcId) throw new Error("Payment collection missing");

    await createPaymentSession(pcId, razorpayProviderId);
    const refreshed = await retrieveCart(c.id);
    const updatedCart = refreshed.cart;
    const ps =
      updatedCart.payment_collection?.payment_sessions?.find((x) =>
        isRazorpay(x.provider_id)
      ) || updatedCart.payment_collection?.payment_sessions?.[0];

    if (!ps?.data?.razorpayOrder?.id) {
      throw new Error("Razorpay order was not created. Check backend Razorpay keys.");
    }

    setCart(updatedCart);
    setSession(ps);
    setReadinessErrors(getReadinessErrors(updatedCart));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!localStorage.getItem("access_token")) {
          toast.info("Please sign in before payment.");
          navigate("/sign-in");
          return;
        }
        const cartId = getStoredCartId();
        if (!cartId || !reduxCart?.length) {
          toast.info("Your cart is empty.");
          return;
        }

        const { cart: c } = await retrieveCart(cartId);
        if (cancelled) return;

        setCart(c);
        const errors = getReadinessErrors(c);
        setReadinessErrors(errors);
        if (errors.length) return;

        if (!c?.region_id) {
          setReadinessErrors(["Cart region is missing."]);
          return;
        }

        const { payment_providers } = await listPaymentProviders(c.region_id);
        const razorpayProvider = (payment_providers || []).find((p) =>
          isRazorpay(p.id)
        );
        if (!razorpayProvider) {
          setSetupError(
            "Razorpay is not enabled for this region. Run configure:india or enable it in Medusa Admin."
          );
          return;
        }

        setPreparing(true);
        await prepareRazorpaySession(c, razorpayProvider.id);
      } catch (e) {
        if (!cancelled) {
          const message =
            e?.raw?.response?.data?.message ||
            e?.message ||
            "Could not load checkout";
          setSetupError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setPreparing(false);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, prepareRazorpaySession, reduxCart?.length]);

  const finalizeOrder = async () => {
    const maxAttempts = 5;
    let lastError = "Checkout failed";

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const res = await dispatch(completeMedusaOrder()).unwrap();
        toast.success("Order placed successfully!");
        navigate("/checkout/success", {
          state: {
            orderId: res.id,
            displayId: res.display_id,
            total: Number(res.total),
          },
        });
        return;
      } catch (e) {
        lastError = typeof e === "string" ? e : e?.message || "Checkout failed";
        if (
          lastError.includes("Payment authorization failed") &&
          attempt < maxAttempts
        ) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }
        break;
      }
    }

    toast.error(lastError);
    navigate("/checkout/failed", { state: { reason: lastError } });
  };

  const handlePaymentFailed = (reason) => {
    navigate("/checkout/failed", { state: { reason } });
  };

  if (loading || preparing) {
    return (
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl bg-[#f7fbf4] p-8">
        <CircularProgress />
        <p className="text-sm text-gray-600">Preparing Razorpay checkout…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-950">Payment</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Pay securely with Razorpay. UPI, cards, and netbanking are supported.
        </p>
      </div>

      {readinessErrors.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="mb-1 font-semibold">Complete these before payment:</p>
          <ul className="list-disc pl-5">
            {readinessErrors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {setupError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {setupError}
        </div>
      )}

      {session && cart && readinessErrors.length === 0 && (
        <div className="rounded-2xl border border-green-100 bg-white p-6">
          <p className="mb-4 text-sm text-gray-600">
            Amount to pay:{" "}
            <span className="font-bold text-gray-950">
              {formatInr(Number(cart.total))}
            </span>
          </p>
          <RazorpaySection
            cart={cart}
            session={session}
            onPaid={finalizeOrder}
            onPaymentFailed={handlePaymentFailed}
          />
        </div>
      )}
    </div>
  );
}
