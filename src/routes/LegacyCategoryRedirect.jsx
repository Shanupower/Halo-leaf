import { Navigate, useParams } from "react-router-dom";
import { productCategoryPath } from "./paths";

export function LegacyCategoryRedirect() {
  const { categoryId } = useParams();
  return <Navigate to={productCategoryPath(categoryId)} replace />;
}
