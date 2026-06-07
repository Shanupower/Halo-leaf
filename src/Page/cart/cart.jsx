import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartCard } from "./cart-card";
import { PATHS } from "../../routes/paths";
import { Link } from "react-router-dom";
import { syncCartFromMedusa } from "../../feature/leafSlice";
import { OrderSummary } from "../../component/OrderSummary";

export const Cart = () => {
  const dispatch = useDispatch();
  const { cart, cartSummary, cartSyncing } = useSelector((state) => state.leaf);

  useEffect(() => {
    dispatch(syncCartFromMedusa());
  }, [dispatch]);

  const itemCount =
    cartSummary?.itemCount ??
    cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="px-4 py-10 sm:px-[5%] md:px-[8%]">
      <section className="mb-8 rounded-[2rem] bg-[#f7fbf4] px-6 py-10 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
          Cart
        </p>
        <h1 className="text-3xl font-bold text-gray-950 md:text-5xl">
          Your Shopping Cart
        </h1>
      </section>

      {cart.length === 0 ? (
        <div className="flex min-h-[30vh] items-center justify-center rounded-[2rem] border border-green-100 bg-white p-8 text-center text-xl font-bold text-gray-500">
          Your cart is empty
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cart.map((item, index) => (
              <CartCard key={item.id || index} item={item} />
            ))}
          </div>

          <aside className="h-fit rounded-[1.5rem] border border-green-100 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h3 className="mb-5 text-xl font-bold text-gray-950">Order Summary</h3>
            {cartSyncing && (
              <p className="mb-3 text-sm text-gray-500">Updating cart...</p>
            )}
            <OrderSummary
              summary={cartSummary}
              itemCount={itemCount}
              showShippingPending
              className="mb-6"
            />
            <Link
              to="/order"
              className="block w-full rounded-full bg-green-700 p-3 text-center font-semibold text-white transition hover:bg-gray-950"
            >
              Proceed to Checkout
            </Link>

            <Link
              to={PATHS.products}
              className="mt-4 block text-center text-sm font-semibold text-green-800 hover:underline"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
};
