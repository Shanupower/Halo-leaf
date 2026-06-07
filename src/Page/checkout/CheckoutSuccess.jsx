import { PATHS } from "../../routes/paths";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatInr } from "../../utils/money";

function SuccessIcon() {
  return (
    <svg
      className="size-20 text-green-700"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2.5 2.5L16 9" />
    </svg>
  );
}

export function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, displayId, total } = location.state || {};

  if (!orderId) {
    return (
      <Shell>
        <p className="text-gray-600">No order information found.</p>
        <Link
          to={PATHS.products}
          className="mt-6 inline-block rounded-full bg-green-700 px-8 py-3 font-semibold text-white hover:bg-gray-950"
        >
          Continue shopping
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <SuccessIcon />
      <h1 className="mt-4 text-3xl font-bold text-gray-950">Order placed!</h1>
      <p className="mt-3 max-w-md text-center text-gray-600">
        Thank you for your purchase. We&apos;ve received your payment and will
        start processing your order shortly.
      </p>

      <div className="mt-8 w-full rounded-2xl bg-[#f7fbf4] p-6 text-center">
        <p className="text-sm text-gray-500">Order number</p>
        <p className="text-xl font-bold text-gray-950">
          #{displayId ?? orderId}
        </p>
        {total != null && (
          <>
            <p className="mt-4 text-sm text-gray-500">Amount paid</p>
            <p className="text-lg font-semibold text-green-800">
              {formatInr(total)}
            </p>
          </>
        )}
      </div>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to={`/order-details/${orderId}`}
          className="rounded-full bg-green-700 px-8 py-3 text-center font-semibold text-white transition hover:bg-gray-950"
        >
          View order details
        </Link>
        <Link
          to="/profile?tab=orders"
          className="rounded-full border border-green-200 px-8 py-3 text-center font-semibold text-green-800 transition hover:border-green-700"
        >
          View all orders
        </Link>
        <button
          type="button"
          onClick={() => navigate(PATHS.products)}
          className="rounded-full border border-green-200 px-8 py-3 font-semibold text-green-800 transition hover:border-green-700"
        >
          Continue shopping
        </button>
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-lg flex-col items-center rounded-[2rem] border border-green-100 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
