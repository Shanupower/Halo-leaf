import ImageComponent from "../../component/image/ImageComponent";
import { Link } from "react-router-dom";

function formatMoney(amount, currency = "inr") {
  const major = Number(amount || 0);
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(major);
  } catch {
    return `${currency.toUpperCase()} ${major.toFixed(2)}`;
  }
}

function formatStatus(status) {
  if (!status) return "Pending";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const OrderDetailsCard = ({ order }) => {
  const firstItem = order?.items?.[0];
  const thumb = firstItem?.thumbnail;

  return (
    <Link
      to={`/order-details/${order?.id}`}
      className="group block overflow-hidden rounded-2xl border border-green-100 bg-[#f7fbf4] transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
    >
      <ImageComponent
        src={thumb || "/placeholder.png"}
        cardCss="aspect-[4/3] w-full bg-white"
        imgCss="h-full w-full object-cover"
      />

      <div className="space-y-1 p-4">
        <h3 className="font-semibold text-gray-950">
          Order #{order?.display_id ?? order?.id?.slice(-8)}
        </h3>
        <p className="text-sm text-gray-600">{formatStatus(order?.status)}</p>
        <p className="text-base font-semibold text-green-800">
          {formatMoney(order?.total, order?.currency_code)}
        </p>
      </div>
    </Link>
  );
};
