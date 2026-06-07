import { Navigate, useParams } from "react-router-dom";
import { productPath } from "./paths";

export function LegacyProductRedirect() {
  const { id } = useParams();
  return <Navigate to={productPath(id)} replace />;
}
