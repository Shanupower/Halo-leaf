import { useDispatch, useSelector } from "react-redux";
import { PATHS, productPath } from "../../routes/paths";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Placeholder from "../../assets/product-placeholder-1.png";
import { addToCart } from "../../feature/leafSlice";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price || 0));

export const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, dataStatus } = useSelector((state) => state.leaf);
  const productStatus = dataStatus?.products || {};

  const featured = [...(product || [])]
    .sort((a, b) => Number(Boolean(b.isHomepageFeatured)) - Number(Boolean(a.isHomepageFeatured)))
    .slice(0, 4);

  const handleAddToCart = (event, item) => {
    event.stopPropagation();
    if (!item?.variant_id && !item?.variants?.[0]?.id) {
      toast.error("This product cannot be added to the cart yet.");
      return;
    }

    dispatch(addToCart({ item, quantity: 1 }))
      .unwrap()
      .then(() => toast.success("Added to cart"))
      .catch((error) =>
        toast.error(typeof error === "string" ? error : "Could not add to cart")
      );
  };

  return (
    <section className="bg-[#f7fbf4] px-4 py-12 sm:px-[5%] md:px-[8%] md:py-20">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
            Featured products
          </p>
          <h2 className="text-3xl font-bold text-gray-950 md:text-5xl">
            Featured leaf tableware
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Popular plates, bowls, and serving pieces for everyday meals and catering.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(PATHS.products)}
          className="w-fit rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          Shop all products
        </button>
      </div>

      {productStatus.loading && (
        <div className="rounded-3xl border border-green-100 bg-white p-8 text-center text-green-800">
          Loading products...
        </div>
      )}

      {!productStatus.loading && productStatus.error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-red-700">
          {productStatus.error}
        </div>
      )}

      {!productStatus.loading && !productStatus.error && featured.length === 0 && (
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-8 text-center text-amber-800">
          No products available yet. Leaf tableware will appear here once published.
        </div>
      )}

      {!productStatus.loading && !productStatus.error && featured.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((item, index) => {
            const imageUrl = item.imageUrl || Placeholder;
            const title = item.title || item.attributes?.title || "Product";
            const description =
              item.shortDescription ||
              item.description ||
              "Sustainable leaf product from HaloLeaf.";

            return (
              <motion.article
                key={item.id || index}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div
                  className="flex h-full flex-col"
                >
                  <button
                    type="button"
                    className="relative h-64 overflow-hidden bg-white text-left"
                    onClick={() => navigate(productPath(item.documentId || item.id))}
                  >
                    <img
                      src={imageUrl}
                      alt={title}
                      className="h-full w-full object-contain p-6 transition duration-700 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.src = Placeholder;
                      }}
                    />
                    {(item.badge || item.isHomepageFeatured) && (
                      <span className="absolute left-4 top-4 rounded-full bg-green-700 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
                        {item.badge || "Featured"}
                      </span>
                    )}
                  </button>
                  <div className="flex flex-1 flex-col p-6">
                    <button
                      type="button"
                      onClick={() => navigate(productPath(item.documentId || item.id))}
                      className="text-left"
                    >
                      <h3 className="text-xl font-bold text-gray-950 transition group-hover:text-green-800">
                        {title}
                      </h3>
                    </button>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-gray-600">
                      {description}
                    </p>
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <span className="text-lg font-bold text-green-800">
                        {formatPrice(item.price)}
                      </span>
                      <button
                        type="button"
                        onClick={(event) => handleAddToCart(event, item)}
                        className="inline-flex items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-950"
                      >
                        <ShoppingCartCheckoutIcon fontSize="small" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
};
