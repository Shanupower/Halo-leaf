import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersList } from "../../feature/leafSlice";
import { OrderDetailsCard } from "./order-details-card ";

export const Order = () => {
  const dispatch = useDispatch();
  const { order, orderLoading, orderError, orderMeta } = useSelector(
    (state) => state.leaf
  );
  const [offset, setOffset] = useState(0);
  const limit = orderMeta?.limit || 20;

  useEffect(() => {
    dispatch(fetchOrdersList({ offset, limit }));
  }, [dispatch, offset, limit]);

  const canGoBack = offset > 0;
  const canGoNext = offset + limit < (orderMeta?.count || 0);

  return (
    <div className="p-6 sm:p-8">
      {orderLoading ? (
        <div className="flex min-h-[20rem] items-center justify-center text-lg font-medium text-gray-500">
          Loading your orders…
        </div>
      ) : orderError ? (
        <div className="flex min-h-[20rem] items-center justify-center text-lg font-medium text-red-600">
          {orderError}
        </div>
      ) : order?.length === 0 ? (
        <div className="flex min-h-[20rem] flex-col items-center justify-center gap-2 text-center">
          <p className="text-lg font-semibold text-gray-700">No orders yet</p>
          <p className="text-sm text-gray-500">
            When you place an order, it will show up here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {order?.map((item) => (
              <OrderDetailsCard key={item.id} order={item} />
            ))}
          </div>
          {orderMeta?.count > limit && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={!canGoBack}
                onClick={() => setOffset(Math.max(0, offset - limit))}
                className="rounded-full border border-green-200 px-5 py-2 text-sm font-semibold text-green-800 transition hover:border-green-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                {offset + 1}–{Math.min(offset + order.length, orderMeta.count)} of{" "}
                {orderMeta.count}
              </span>
              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => setOffset(offset + limit)}
                className="rounded-full border border-green-200 px-5 py-2 text-sm font-semibold text-green-800 transition hover:border-green-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
