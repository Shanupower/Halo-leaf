import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUserAddress } from "../../feature/leafSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AddressForm } from "../../component/forms/AddressForm";

function safeReturnPath(returnTo) {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/profile";
  }
  return returnTo;
}

export const UpdateAddress = () => {
  const dispatch = useDispatch();
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = safeReturnPath(searchParams.get("returnTo"));

  const addresses = useSelector((state) =>
    state.leaf.user.addresses.find((item) => item.documentId === documentId)
  );

  const { loading } = useSelector((state) => state.leaf.user);
  const [userAddress, setUserAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    district: "",
    pin_code: "",
  });

  useEffect(() => {
    if (addresses) {
      setUserAddress({
        address1: addresses?.address1 || "",
        address2: addresses?.address2 || "",
        city: addresses?.city || "",
        state: addresses?.state || "",
        district: addresses?.district || "",
        pin_code: addresses?.pin_code || "",
      });
    }
  }, [addresses]);

  const handleSubmit = (data) => {
    dispatch(UpdateUserAddress({ id: documentId, data }))
      .unwrap()
      .then(() => {
        toast.success("Your Address has been updated");
        navigate(returnTo);
      })
      .catch(() => {
        toast.error("Something went wrong please try again");
      });
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-[320px] sm:w-[440px]">
        <AddressForm
          initialValues={userAddress}
          onSubmit={handleSubmit}
          loading={loading}
          title="Update Your Delivery Address"
        />
      </div>
    </div>
  );
};
