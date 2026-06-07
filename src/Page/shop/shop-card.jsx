import ImageComponent from "../../component/image/ImageComponent";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { productPath } from "../../routes/paths";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../feature/leafSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Placeholder from "../../assets/product-placeholder-1.png";

export const ShopCard = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showProductDetails = (pid) => {
    navigate(productPath(pid));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!item?.variant_id && !item?.variants?.[0]?.id) {
      toast.error("This product cannot be added to the cart yet.");
      return;
    }
    dispatch(addToCart({ item, quantity: 1 }))
      .unwrap()
      .then(() => toast.success("Added to cart"))
      .catch((err) =>
        toast.error(typeof err === "string" ? err : "Could not add to cart")
      );
  };

  const imageUrl = item?.imageUrl || Placeholder;
  const title = item?.title || item?.attributes?.title || "Product";
  const description =
    item?.shortDescription ||
    item?.description ||
    "Sustainable leaf product from HaloLeaf.";

  return (
    <motion.article
      onClick={() => showProductDetails(item?.documentId || item?.id)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true }}
    >
      <div className="relative flex h-64 w-full items-center justify-center overflow-hidden bg-[#f7fbf4]">
        {(item?.badge || item?.isHomepageFeatured) && (
          <span className="absolute left-4 top-4 rounded-full bg-green-700 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
            {item.badge || "Featured"}
          </span>
        )}
        <ImageComponent
          src={imageUrl}
          cardCss="h-full w-full"
          imgCss="h-full w-full object-contain p-6 transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-gray-950 transition group-hover:text-green-800">
          {title}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-gray-600">
          {description}
        </p>
        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="text-lg font-bold text-green-800">
            ₹{item?.price || item?.attributes?.price || "0.00"}
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-950"
          >
            <ShoppingCartCheckoutIcon fontSize="small" />
            Add
          </button>
        </div>
      </div>
    </motion.article>
  );
};
