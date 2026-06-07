import ImageComponent from "../../component/image/ImageComponent";
import { Link } from "react-router-dom";
import { productPath as buildProductPath } from "../../routes/paths";
import { buildImageUrl } from "../../utils/media";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../feature/leafSlice";

export const CartCard = ({ item }) => {
  const dispatch = useDispatch();
  const { cartSyncing } = useSelector((state) => state.leaf);
  const imageUrl =
    item?.image?.[0]?.formats?.thumbnail?.url || item?.image?.[0]?.url;
  const quantity = item?.quantity || 1;
  const unitPrice = Number(item?.OrigialPrice || item?.price || 0);
  const subtotal = unitPrice * quantity;
  const itemProductPath = buildProductPath(item?.documentId || item?.id);

  const updateQuantity = (nextQuantity) => {
    dispatch(updateCartItemQuantity({ id: item.id, quantity: nextQuantity }));
  };

  const removeItem = () => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-green-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
      <Link
        to={itemProductPath}
        className="block overflow-hidden rounded-2xl bg-[#f7fbf4]"
      >
          <ImageComponent
            src={buildImageUrl(imageUrl) || "/placeholder.png"}
            cardCss="h-36 w-full"
            imgCss="h-full w-full object-contain p-4"
          />
      </Link>

      <div className="flex min-w-0 flex-col justify-between gap-4">
        <div>
          <Link to={itemProductPath}>
            <h3 className="line-clamp-2 text-lg font-bold text-gray-950 transition hover:text-green-800">
              {item?.title || "Product"}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-gray-500">
            Unit price: ₹{unitPrice.toFixed(2)}
          </p>
          <p className="mt-2 text-lg font-bold text-green-800">
            Subtotal: ₹{subtotal.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center overflow-hidden rounded-full border border-green-100 bg-white">
            <button
              type="button"
              disabled={cartSyncing || quantity <= 1}
              onClick={() => updateQuantity(quantity - 1)}
              className="px-4 py-2 font-semibold disabled:opacity-40"
            >
              -
            </button>
            <span className="border-x border-green-100 px-4 py-2">{quantity}</span>
            <button
              type="button"
              disabled={cartSyncing}
              onClick={() => updateQuantity(quantity + 1)}
              className="px-4 py-2 font-semibold disabled:opacity-40"
            >
              +
            </button>
          </div>
          <button
            type="button"
            disabled={cartSyncing}
            onClick={removeItem}
            className="rounded-full border border-red-100 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      </div>
      </div>
    </article>
  );
};
