import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Cart } from "./cart";
import { Address } from "./address";
import { Payment } from "./payment/payment";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { syncCartFromMedusa } from "../../feature/leafSlice";
import { OrderSummary } from "../../component/OrderSummary";
import { formatInr } from "../../utils/money";

const checkoutSteps = [
  { label: "Cart", description: "Review products" },
  { label: "Address", description: "Choose delivery" },
  { label: "Payment", description: "Complete order" },
];

export const UserOrder = () => {
  const location = useLocation();
  const [orderValue, setOrderValue] = useState(() => {
    const step = location.state?.checkoutStep;
    return typeof step === "number" && step >= 0 && step <= 2 ? step : 0;
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.leaf.user);
  const { cart, cartSummary } = useSelector((state) => state.leaf);
  const token = localStorage.getItem("access_token");
  const itemCount =
    cartSummary?.itemCount ??
    cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const displayTotal = cartSummary?.hasShippingMethod
    ? cartSummary.total
    : (cartSummary?.subtotal ??
        cart.reduce(
          (acc, item) =>
            acc +
            Number(item.OrigialPrice || item.price || 0) * (item.quantity || 1),
          0
        ));

  useEffect(() => {
    dispatch(syncCartFromMedusa());
  }, [dispatch]);

  const guardedSetOrderValue = (newValue) => {
    if (newValue > 0 && cart.length === 0) {
      toast.info("Add products to your cart before checkout.");
      navigate("/cart");
      return;
    }
    if (newValue > 0 && !token) {
      toast.info("Please sign in before checkout.");
      navigate("/sign-in");
      return;
    }
    if (newValue === 2 && !user?.addresses?.length) {
      toast.info("Add or select a delivery address before payment.");
      setOrderValue(1);
      return;
    }
    if (newValue === 2 && !cartSummary?.hasShippingMethod) {
      toast.info("Select a delivery address to calculate shipping.");
      setOrderValue(1);
      return;
    }
    setOrderValue(newValue);
  };

  const advanceToPayment = useCallback(() => {
    setOrderValue(2);
  }, []);

  const summaryAction = () => {
    if (orderValue === 0) guardedSetOrderValue(1);
    else if (orderValue === 1) guardedSetOrderValue(2);
  };

  return (
    <div className="px-4 py-10 sm:px-[5%] md:px-[8%]">
      <section className="mb-8 rounded-[2rem] bg-[#f7fbf4] px-6 py-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
          Checkout
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-950 md:text-5xl">
              Complete your order
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Review your cart, select a delivery address, and finish payment in
              one guided flow.
            </p>
          </div>
          <div className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-green-800 shadow-sm">
            {itemCount} item{itemCount === 1 ? "" : "s"} · {formatInr(displayTotal)}
          </div>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        {checkoutSteps.map((step, index) => {
          const isActive = orderValue === index;
          const isComplete = orderValue > index;
          return (
            <button
              key={step.label}
              type="button"
              onClick={() => guardedSetOrderValue(index)}
              className={`rounded-2xl border p-4 text-left transition ${
                isActive
                  ? "border-green-700 bg-green-700 text-white shadow-lg"
                  : isComplete
                    ? "border-green-100 bg-green-50 text-green-900"
                    : "border-green-100 bg-white text-gray-700 hover:border-green-700"
              }`}
            >
              <span className="mb-3 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-green-800">
                {index + 1}
              </span>
              <span className="block text-lg font-bold">{step.label}</span>
              <span
                className={`mt-1 block text-sm ${isActive ? "text-white/80" : "text-gray-500"}`}
              >
                {step.description}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <main className="min-w-0 rounded-[2rem] border border-green-100 bg-white p-4 shadow-sm sm:p-6">
          {orderValue === 0 && <Cart setOrderValue={guardedSetOrderValue} />}
          {orderValue === 1 && (
            <Address
              setOrderValue={guardedSetOrderValue}
              onAddressApplied={advanceToPayment}
            />
          )}
          {orderValue === 2 && <Payment />}
        </main>

        <aside className="h-fit rounded-[2rem] border border-green-100 bg-white p-6 shadow-sm lg:sticky lg:top-28">
          <h2 className="text-xl font-bold text-gray-950">Order summary</h2>
          <OrderSummary summary={cartSummary} itemCount={itemCount} className="mt-5" />

          <div className="mt-6 rounded-2xl bg-[#f7fbf4] p-4 text-sm leading-6 text-gray-600">
            Current step:{" "}
            <span className="font-semibold text-green-800">
              {checkoutSteps[orderValue].label}
            </span>
          </div>

          {orderValue < 2 && (
            <button
              type="button"
              onClick={summaryAction}
              className="mt-5 w-full rounded-full bg-green-700 py-3 font-semibold text-white transition hover:bg-gray-950"
            >
              {orderValue === 0 ? "Continue to address" : "Continue to payment"}
            </button>
          )}
        </aside>
      </div>
    </div>
  );
};
