import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { applyCheckoutAddress, createUserAddress } from "../../feature/leafSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AddressForm } from "../../component/forms/AddressForm";
import { fetchUserData } from "../../helper/helper";
import { useState } from "react";

const CHECKOUT_RETURN = encodeURIComponent("/order");

export const Address = ({ setOrderValue, onAddressApplied }) => {
  const { addresses, loading } = useSelector((state) => state.leaf.user);
  const dispatch = useDispatch();
  const { id } = fetchUserData();
  const uid = localStorage.getItem("leafUserid");
  const [creating, setCreating] = useState(false);

  const selectAddressForCheckout = (item) => {
    dispatch(applyCheckoutAddress(item))
      .unwrap()
      .then(() => {
        toast.success("Delivery address applied");
        if (onAddressApplied) onAddressApplied();
        else setOrderValue(2);
      })
      .catch((e) =>
        toast.error(typeof e === "string" ? e : "Could not apply address")
      );
  };

  const handleCreateAndApply = (formData) => {
    setCreating(true);
    dispatch(
      createUserAddress({
        ...formData,
        user_account: id ?? uid,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Your address has been saved");
        return dispatch(applyCheckoutAddress(formData)).unwrap();
      })
      .then(() => {
        toast.success("Delivery address applied");
        if (onAddressApplied) onAddressApplied();
        else setOrderValue(2);
      })
      .catch((error) => {
        if (
          error?.status === 401 ||
          error === "Unauthorized" ||
          error?.message === "Unauthorized"
        ) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("leafUser");
          toast.error("Your session expired. Please sign in again.");
          return;
        }
        toast.error(
          typeof error === "string"
            ? error
            : error?.message || "Could not save address"
        );
      })
      .finally(() => setCreating(false));
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-950">Delivery address</h2>
        <p className="mt-2 text-sm text-gray-600">
          Choose where we should ship this order.
        </p>
      </div>

      {addresses?.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-green-200 bg-[#f7fbf4] p-6">
          <div className="mb-6 flex flex-col items-center text-center">
            <LocationOnOutlinedIcon className="mb-3 text-green-700" fontSize="large" />
            <h3 className="text-xl font-bold text-gray-950">No address added yet</h3>
            <p className="mt-2 max-w-md text-sm text-gray-600">
              Add a delivery address below to continue to payment.
            </p>
          </div>
          <AddressForm
            title="Add delivery address"
            submitLabel="Save and continue"
            loading={loading || creating}
            onSubmit={handleCreateAndApply}
            className="shadow-none"
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses?.map((item, index) => (
            <div
              key={item.documentId || index}
              onClick={() => selectAddressForCheckout(item)}
              className="group cursor-pointer rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-700 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
                    <LocationOnOutlinedIcon />
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-950">Address {index + 1}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                      {[item?.address1, item?.address2, item?.pin_code, item?.district, item?.city, item?.state]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {item?.phone && (
                      <p className="mt-2 text-sm font-semibold text-gray-700">
                        Phone: {item.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="flex shrink-0 items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    to={`/address/${item?.documentId}?returnTo=${CHECKOUT_RETURN}`}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-green-100 text-gray-700 transition hover:bg-green-50 hover:text-green-800"
                    aria-label="Edit address"
                  >
                    <EditIcon fontSize="small" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => selectAddressForCheckout(item)}
                    className="rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-950"
                  >
                    Deliver here
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Link
            to={`/address?returnTo=${CHECKOUT_RETURN}`}
            className="rounded-2xl border border-dashed border-green-200 bg-[#f7fbf4] p-5 text-center text-sm font-semibold text-green-800 transition hover:border-green-700"
          >
            Add another address
          </Link>
        </div>
      )}
    </div>
  );
};
