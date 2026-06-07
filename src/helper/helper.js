import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const storeLeafUser = (data) => {
  const token = data?.token ?? localStorage.getItem("access_token");
  const customer = data?.customer;
  const legacyId = data?.user?.documentId;
  const customerId = customer?.id ?? legacyId;
  const name = customer
    ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
    : data?.name || "";
  if (token) {
    localStorage.setItem("access_token", token);
  }
  localStorage.setItem(
    "leafUser",
    JSON.stringify({
      id: customerId,
      access_leaf: token,
      name: name || undefined,
    })
  );
  if (customerId) {
    localStorage.setItem("leafUserid", customerId);
  }
};

export const fetchUserData = () => {
  const stringifedUser = localStorage.getItem("leafUser") || ' "" ';
  try {
    return JSON.parse(stringifedUser);
  } catch {
    return {};
  }
};

export const Protector = ({ Component }) => {
  const navigate = useNavigate();
  const { access_leaf } = fetchUserData();
  useEffect(() => {
    if (!access_leaf && !localStorage.getItem("access_token")) {
      navigate("/sign-in");
    }
  }, [navigate, access_leaf]);
};
