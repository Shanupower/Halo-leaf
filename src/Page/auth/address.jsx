import { useDispatch, useSelector } from "react-redux";
import { createUserAddress } from "../../feature/leafSlice";
import { fetchUserData } from "../../helper/helper";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AddressForm } from "../../component/forms/AddressForm";
import "./style.css";

function safeReturnPath(returnTo) {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/profile";
  }
  return returnTo;
}

export const Address = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = safeReturnPath(searchParams.get("returnTo"));
  const { id } = fetchUserData();
  const uid = localStorage.getItem("leafUserid");
  const { loading } = useSelector((state) => state.leaf.user);

  const handleSubmit = (userAddress) => {
    dispatch(
      createUserAddress({
        ...userAddress,
        user_account: id ?? uid,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Your Address has been created");
        navigate(returnTo);
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
          navigate("/sign-in");
          return;
        }
        toast.error(
          typeof error === "string"
            ? error
            : error?.message || "Something went wrong please try again"
        );
      });
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-[320px] sm:w-[440px]">
        <AddressForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};
