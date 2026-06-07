import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartCard } from "./cart-card";
import { syncCartFromMedusa } from "../../feature/leafSlice";

export const Cart = () => {
  const { cart, cartSyncing } = useSelector((state) => state.leaf);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(syncCartFromMedusa());
  }, [dispatch]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-950">Review your cart</h2>
        <p className="mt-2 text-sm text-gray-600">
          Confirm quantities before moving to delivery.
          {cartSyncing ? <span className="ml-2 text-green-700">(updating...)</span> : null}
        </p>
      </div>

      {cart.length == 0 ? (
        <div className="flex min-h-[30vh] items-center justify-center rounded-2xl bg-[#f7fbf4] p-8 text-center text-xl font-bold text-gray-500">
          Your cart is empty
        </div>
      ) : (
        <div className="grid gap-4">
          {cart?.map((item, index) => (
            <CartCard key={item.medusaLineId || index} id={index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
