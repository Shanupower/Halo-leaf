import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listOrderReviews, retrieveStoreOrder } from "../../api/medusa/store";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelOrderActionUpdate,
  createOrderActionUpdate,
  fetchOrderActionRequests,
} from "../../feature/leafSlice";
import { toast } from "react-toastify";
import { OrderLineReviewForm } from "../../component/OrderLineReviewForm";

import { formatInr } from "../../utils/money";

function formatOrderMoney(amount, currency = "inr") {
  if (amount == null) return "—";
  return formatInr(Number(amount), { currency });
}

export const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const actionRequests = useSelector(
    (state) => state.leaf.orderActionRequests[id] || []
  );
  const [actionType, setActionType] = useState("return");
  const [updateReason, setUpdateReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [orderReviews, setOrderReviews] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      try {
        const { order: o } = await retrieveStoreOrder(id);
        if (!cancelled) setOrder(o);
        dispatch(fetchOrderActionRequests(id));
        try {
          const { reviews } = await listOrderReviews(id);
          if (!cancelled) setOrderReviews(reviews || []);
        } catch {
          if (!cancelled) setOrderReviews([]);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Could not load order");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, id]);

  if (error) {
    return (
      <div className="md:px-[10%] px-4 py-8 text-center text-red-600">{error}</div>
    );
  }

  if (!order) {
    return (
      <div className="md:px-[10%] px-4 py-8 text-center text-gray-500">Loading order…</div>
    );
  }

  const currency = order.currency_code || "inr";
  const items = order.items || [];
  const ship = order.shipping_address;
  const pendingActionRequests = actionRequests.filter(
    (request) => request.status === "requested"
  );
  const canReview = ["captured", "partially_captured", "authorized", "partially_authorized"].includes(
    String(order.payment_status || "")
  );
  const flowSteps = [
    { label: "Payment", done: canReview, detail: order.payment_status || "pending" },
    {
      label: "Processing",
      done: order.status === "completed" || order.fulfillment_status === "fulfilled",
      detail: order.status || "pending",
    },
    {
      label: "Fulfillment",
      done:
        order.fulfillment_status === "fulfilled" ||
        order.fulfillment_status === "shipped",
      detail: order.fulfillment_status || "not fulfilled",
    },
  ];

  return (
    <div className="md:px-[10%] sm:px-[5%] px-4 py-4 mt-2">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Order confirmation</h1>
        <Link
          to="/profile?tab=orders"
          className="text-sm font-semibold text-green-800 hover:underline"
        >
          ← All orders
        </Link>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {flowSteps.map((step) => (
          <div
            key={step.label}
            className={`rounded-xl border p-4 text-sm ${
              step.done
                ? "border-green-200 bg-green-50 text-green-900"
                : "border-gray-200 bg-white text-gray-600"
            }`}
          >
            <p className="font-semibold">{step.label}</p>
            <p className="mt-1 capitalize">{String(step.detail).replace(/_/g, " ")}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 w-full border border-gray-200 p-6 rounded-lg shadow-md space-y-3 text-sm">
          <h2 className="text-xl font-semibold">Order</h2>
          <p>
            <b>ID:</b> {order.display_id ?? order.id}
          </p>
          <p>
            <b>Created:</b>{" "}
            {order.created_at ? new Date(order.created_at).toLocaleString() : "—"}
          </p>
          <p>
            <b>Status:</b> {order.status || "—"}
          </p>
          <p>
            <b>Fulfillment:</b> {order.fulfillment_status || "—"}
          </p>
          <p>
            <b>Payment:</b> {order.payment_status || "—"}
          </p>
        </div>

        <div className="md:w-1/2 w-full border border-gray-200 p-6 rounded-lg shadow-md space-y-3">
          <h2 className="text-xl font-semibold">Items</h2>
          <div className="space-y-2 text-sm">
            {items.map((line) => (
              <div key={line.id} className="flex justify-between gap-4 border-b border-gray-100 py-2">
                <span>
                  {line.title}{" "}
                  <span className="text-gray-500">× {line.quantity}</span>
                </span>
                <span>{formatOrderMoney(line.unit_price * line.quantity, currency)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span>Items subtotal</span>
              <span>
                {formatOrderMoney(
                  order.item_subtotal ?? order.item_total ?? order.subtotal,
                  currency
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatOrderMoney(order.shipping_total, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatOrderMoney(order.tax_total, currency)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-gray-100 pt-2">
              <span>Total</span>
              <span>{formatOrderMoney(order.total, currency)}</span>
            </div>
          </div>
        </div>

        <div className="md:w-1/3 w-full border border-gray-200 p-6 rounded-lg shadow-md text-sm space-y-2">
          <h2 className="text-xl font-semibold">Shipping</h2>
          {ship ? (
            <>
              <p>
                {ship.first_name} {ship.last_name}
              </p>
              <p>
                {ship.address_1}
                {ship.address_2 ? `, ${ship.address_2}` : ""}
              </p>
              <p>
                {ship.city}, {ship.province} {ship.postal_code}
              </p>
              <p>{ship.country_code?.toUpperCase()}</p>
              <p>{ship.phone}</p>
            </>
          ) : (
            <p className="text-gray-500">No shipping address on file.</p>
          )}
        </div>
      </div>

      {canReview && (
        <div className="mt-6 rounded-lg border border-green-100 bg-white p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold">Review your purchase</h2>
          <p className="mb-4 text-sm text-gray-600">
            Share feedback on items from this order. Reviews appear on the product page.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((line) => {
              const productId = line.product_id || line.variant?.product_id;
              if (!productId) return null;
              const existingReview = orderReviews.find(
                (review) => review.product_id === productId
              );
              return (
                <div key={line.id} className="space-y-3">
                  <p className="font-semibold text-gray-950">
                    {line.title}{" "}
                    <span className="font-normal text-gray-500">× {line.quantity}</span>
                  </p>
                  <OrderLineReviewForm
                    orderId={order.id}
                    line={{ ...line, product_id: productId }}
                    existingReview={existingReview}
                    onSubmitted={(review) =>
                      setOrderReviews((prev) => [...prev, review])
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 border border-gray-200 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">Order action requests</h2>
        <p className="text-sm text-gray-600 mb-4">
          Request cancellation, return, exchange, or add a support note. The
          store team reviews and completes approved requests in Medusa Admin.
        </p>

        <div className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="cancel">Cancel order</option>
              <option value="return">Return items</option>
              <option value="exchange">Exchange items</option>
              <option value="support_note">Support note</option>
            </select>
            <input
              type="text"
              value={updateReason}
              onChange={(e) => setUpdateReason(e.target.value)}
              className="md:col-span-2 w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Reason or message"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              disabled={busy}
              onClick={async () => {
                try {
                  setBusy(true);
                  await dispatch(
                    createOrderActionUpdate({
                      orderId: order.id,
                      type: actionType,
                      reason: updateReason || undefined,
                      metadata: {
                        source: "storefront",
                      },
                    })
                  ).unwrap();
                  setUpdateReason("");
                  toast.success("Order action request submitted.");
                } catch (e) {
                  toast.error(
                    typeof e === "string" ? e : e?.message || "Request failed"
                  );
                } finally {
                  setBusy(false);
                }
              }}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md cursor-pointer"
            >
              Submit request
            </button>
            {pendingActionRequests.map((request) => (
              <button
                key={request.id}
                disabled={busy}
                onClick={async () => {
                  try {
                    setBusy(true);
                    await dispatch(
                      cancelOrderActionUpdate({
                        orderId: order.id,
                        actionId: request.id,
                      })
                    ).unwrap();
                    toast.success("Update request canceled.");
                  } catch (e) {
                    toast.error(
                      typeof e === "string"
                        ? e
                        : e?.message || "Cancel request failed"
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Cancel {request.type.replace("_", " ")} request
              </button>
            ))}
          </div>
          {actionRequests.length > 0 && (
            <div className="space-y-2 text-sm">
              {actionRequests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-100 rounded-md p-3 flex justify-between gap-3"
                >
                  <span>
                    <b>{request.type.replace("_", " ")}</b>
                    {request.reason ? `: ${request.reason}` : ""}
                  </span>
                  <span className="text-gray-600">{request.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
