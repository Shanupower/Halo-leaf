import { useEffect } from "react";
import { CartCard } from "../cart/cart-card";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { syncCartFromMedusa } from "../../feature/leafSlice";
import { OrderSummary } from "../../component/OrderSummary";
import { PATHS } from "../../routes/paths";

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
    <div className="p-6 sm:p-8">
      {cart.length === 0 ? (
        <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4 text-center">
          <p className="text-lg font-semibold text-gray-700">Your cart is empty</p>
          <Link
            to={PATHS.products}
            className="rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-950"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-gray-600">
                {itemCount} item{itemCount === 1 ? "" : "s"} in your cart
              </p>
              {cartSyncing && (
                <p className="text-sm text-gray-500">Updating cart…</p>
              )}
            </div>

            {cart.map((item, index) => (
              <CartCard key={item.medusaLineId || item.id || index} item={item} />
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-green-100 bg-[#f7fbf4] p-5 xl:sticky xl:top-24">
            <h3 className="text-lg font-bold text-gray-950">Order summary</h3>
            <OrderSummary
              summary={cartSummary}
              itemCount={itemCount}
              showShippingPending
              className="mt-4 mb-5"
            />
            <Link
              to="/order"
              className="block w-full rounded-full bg-green-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-950"
            >
              Proceed to checkout
            </Link>
            <Link
              to={PATHS.products}
              className="mt-3 block text-center text-sm font-semibold text-green-800 hover:underline"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
};
