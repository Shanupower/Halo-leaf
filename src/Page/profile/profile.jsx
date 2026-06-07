import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AccountSetting } from "./account-setting";
import { Cart } from "./cart";
import { Order } from "./order";
import { useSelector } from "react-redux";
import { Address } from "./address";
import {
  getDisplayInitials,
  getDisplayName,
} from "../../utils/display-initials";
import {
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Home as HomeIcon,
  ListAlt as ListAltIcon,
} from "@mui/icons-material";

const TABS = [
  { id: 0, key: "account", label: "Account Settings", shortLabel: "Account", icon: PersonIcon },
  { id: 1, key: "cart", label: "Cart", shortLabel: "Cart", icon: ShoppingCartIcon },
  { id: 2, key: "addresses", label: "Addresses", shortLabel: "Addresses", icon: HomeIcon },
  { id: 3, key: "orders", label: "My Orders", shortLabel: "Orders", icon: ListAltIcon },
];

function tabIndexFromParam(tab) {
  if (tab === "orders") return 3;
  if (tab === "addresses") return 2;
  if (tab === "cart") return 1;
  return 0;
}

export const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [value, setValue] = useState(tabIndexFromParam(tabFromUrl));
  const user = useSelector((state) => state.leaf.user);
  const displayName = getDisplayName(user?.name);
  const initials = getDisplayInitials(displayName);

  useEffect(() => {
    setValue(tabIndexFromParam(tabFromUrl));
  }, [tabFromUrl]);

  const handleTabChange = (tabId) => {
    setValue(tabId);
    const tab = TABS.find((t) => t.id === tabId);
    if (tab?.key === "account") {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tab.key });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
        Your account
      </p>
      <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">My Profile</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <aside className="rounded-[1.75rem] border border-green-100 bg-[#f7fbf4] p-6 text-center lg:sticky lg:top-24">
          <div
            aria-hidden
            className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-700 text-2xl font-semibold text-white shadow-sm"
          >
            {initials}
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-950">
            {displayName || "Customer"}
          </h2>
          {user?.email && (
            <p className="mt-1 break-all text-sm text-gray-600">{user.email}</p>
          )}
          {user?.phone && (
            <p className="mt-2 text-sm font-medium text-gray-800">{user.phone}</p>
          )}
        </aside>

        <section className="min-w-0 overflow-hidden rounded-[1.75rem] border border-green-100 bg-white shadow-sm">
          <nav
            className="grid grid-cols-2 border-b border-green-100 sm:grid-cols-4"
            aria-label="Profile sections"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = value === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[3.5rem] flex-col items-center justify-center gap-1 px-3 py-3 text-center text-sm font-semibold transition sm:flex-row sm:gap-2 sm:px-4 ${
                    active
                      ? "border-b-2 border-green-700 bg-[#f7fbf4] text-green-800"
                      : "border-b-2 border-transparent text-gray-600 hover:bg-green-50/70 hover:text-green-800"
                  }`}
                >
                  <Icon className="!text-[1.1rem]" aria-hidden />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </nav>

          <div className="min-h-[24rem]">
            {value === 0 && <AccountSetting />}
            {value === 1 && <Cart />}
            {value === 2 && <Address />}
            {value === 3 && <Order />}
          </div>
        </section>
      </div>
    </div>
  );
};
