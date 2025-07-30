import { useState } from "react";
import ImageComponent from "../../component/image/ImageComponent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../feature/leafSlice";

export const ShopCard = ({ id, item }) => {
  const [isFavorite, setIsFavorite] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddFavorite = (e, id) => {
    e.stopPropagation();
    if (isFavorite.includes(id)) {
      setIsFavorite(isFavorite.filter((favId) => favId !== id));
    } else {
      setIsFavorite([...isFavorite, id]);
    }
  };

  const showProductDetails = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  return (
    <div
      onClick={() => showProductDetails(item?.documentId)}
      className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer"
    >
       {/* <FavoriteIcon
          className="cursor-pointer"
          onClick={(e) => handleAddFavorite(e, id)}
          style={{
            width: "28px",
            height: "28px",
            fill: isFavorite.includes(id) ? "#1e3a8a" : "#ccc",
            right:0
          }}
        /> */}
      <div className="w-full h-64 flex justify-center items-center overflow-hidden">
        <ImageComponent
          src={`${import.meta.env.VITE_Image_BASE_URL}${item?.image[0]?.url}`}
          cardCss="w-full h-full"
          imgCss="object-contain w-full h-full"
        />
      </div>

      <div className="mt-4 flex flex-col items-center">
        <h3 className="text-lg font-medium text-gray-800 text-center">
          {item?.title || "Product Name"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          ₹{item?.OrigialPrice || "0.00"}
        </p>
      </div>
    </div>
  );
};
