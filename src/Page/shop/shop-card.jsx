import { useState } from "react";
import ImageComponent from "../../component/image/ImageComponent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../feature/leafSlice";
import { motion } from "framer-motion";

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
  navigate(`/product/details/${id}`);
};

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  // ✅ Safe access to image URL for Strapi
  const imageUrl = item?.attributes?.image?.data?.attributes?.url
    ? `http://13.201.41.1:1337${item.attributes.image.data.attributes.url}`
    : "/placeholder.png";

console.log("Image URL:", imageUrl);
  return (
    <div
      onClick={() => showProductDetails(item?.id)}
      className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Optional: Favorite Icon */}
      {/* <FavoriteIcon
        className="cursor-pointer"
        onClick={(e) => handleAddFavorite(e, id)}
        style={{
          width: "28px",
          height: "28px",
          fill: isFavorite.includes(id) ? "#1e3a8a" : "#ccc",
        }}
      /> */}

      <div className="w-full h-64 flex justify-center items-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <ImageComponent
            src={item?.attributes?.image?.data?.attributes?.url
      ? `http://13.201.41.1:1337${item.attributes.image.data.attributes.url}`
      : "/placeholder.png"}
            cardCss="w-full h-full"
            imgCss="object-contain w-full h-full"
          />
        </motion.div>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <h3 className="text-lg font-medium text-gray-800 text-center">
          {item?.attributes?.title || "Product Name"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          ₹{item?.attributes?.price || "0.00"}
        </p>
      </div>
    </div>
  );
};
