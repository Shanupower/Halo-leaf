import { formatInr } from "../utils/money";

export function OrderSummary({
  summary,
  itemCount,
  showShippingPending = true,
  className = "",
}) {
  const subtotal = summary?.subtotal ?? 0;
  const shipping = summary?.shippingTotal ?? 0;
  const tax = summary?.taxTotal ?? 0;
  const total = summary?.total ?? subtotal;
  const count = summary?.itemCount ?? itemCount ?? 0;
  const hasShipping = summary?.hasShippingMethod;
  const shippingLabel = summary?.shippingMethodName || "Shipping";

  return (
    <div className={`space-y-3 text-sm text-gray-600 ${className}`}>
      <div className="flex justify-between">
        <span>Items</span>
        <span className="font-semibold text-gray-950">{count}</span>
      </div>
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span className="font-semibold text-gray-950">{formatInr(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span>{shippingLabel}</span>
        <span className="font-semibold text-gray-950">
          {hasShipping ? (
            formatInr(shipping)
          ) : showShippingPending ? (
            <span className="text-gray-400">Calculated at address</span>
          ) : (
            formatInr(0)
          )}
        </span>
      </div>
      {tax > 0 && (
        <div className="flex justify-between">
          <span>Tax</span>
          <span className="font-semibold text-gray-950">{formatInr(tax)}</span>
        </div>
      )}
      {summary?.estimatedDeliveryDays != null && hasShipping && (
        <p className="text-xs text-green-700">
          Estimated delivery: {summary.estimatedDeliveryDays} day
          {summary.estimatedDeliveryDays === 1 ? "" : "s"}
        </p>
      )}
      <div className="flex justify-between border-t border-green-100 pt-4 text-base font-bold text-gray-950">
        <span>Total</span>
        <span className="text-green-800">{formatInr(hasShipping ? total : subtotal)}</span>
      </div>
      {!hasShipping && showShippingPending && (
        <p className="text-xs leading-5 text-gray-500">
          Shipping is added after you choose a delivery address. The total above
          is items only until then.
        </p>
      )}
    </div>
  );
}
