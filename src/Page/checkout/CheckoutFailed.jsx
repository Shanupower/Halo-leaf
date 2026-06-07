import { PATHS } from "../../routes/paths";
import { Link, useLocation, useNavigate } from "react-router-dom";

function ErrorIcon() {
  return (
    <svg
      className="size-20 text-red-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
    </svg>
  );
}

export function CheckoutFailed() {
  const location = useLocation();
  const navigate = useNavigate();
  const reason =
    location.state?.reason ||
    "Your payment could not be completed. Please try again.";

  return (
    <Shell>
      <ErrorIcon />
      <h1 className="mt-4 text-3xl font-bold text-gray-950">Payment failed</h1>
      <p className="mt-3 max-w-md text-center text-gray-600">{reason}</p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => navigate("/order", { state: { checkoutStep: 2 } })}
          className="rounded-full bg-green-700 px-8 py-3 font-semibold text-white transition hover:bg-gray-950"
        >
          Try again
        </button>
        <Link
          to={PATHS.contact}
          className="rounded-full border border-green-200 px-8 py-3 text-center font-semibold text-green-800 transition hover:border-green-700"
        >
          Contact support
        </Link>
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-lg flex-col items-center rounded-[2rem] border border-red-100 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
