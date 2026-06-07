import { PATHS, productCategoryPath } from '../../routes/paths';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";
import Placeholder1 from '../../assets/product-placeholder-1.png';

export const BestSell = () => {
  const navigate = useNavigate();
  const { category, dataStatus } = useSelector((state) => state.leaf);
  const categoryStatus = dataStatus?.categories || {};

  const categoriesToShow = [...(category || [])]
    .filter((item) => item.isHomepageFeatured || category.length <= 5)
    .sort((a, b) => (a.homepageOrder || 999) - (b.homepageOrder || 999))
    .slice(0, 6);

  const handleNavigate = (categoryId) => {
    if (categoryId) {
      navigate(productCategoryPath(categoryId));
    } else {
      navigate(PATHS.products);
    }
  };

  return (
    <section id="categories-section" className="px-4 sm:px-[5%] md:px-[8%] py-12 md:py-20">
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
          Shop by category
        </p>
        <h2 className="text-3xl font-bold text-gray-950 md:text-5xl">
          Shop leaf plates, bowls, and tableware
        </h2>
        <p className="mt-4 text-base leading-7 text-gray-600">
          Browse compostable areca-leaf categories for homes, events, and food service.
        </p>
      </header>

      {categoryStatus.loading && (
        <div className="rounded-3xl border border-green-100 bg-green-50 p-8 text-center text-green-800">
          Loading categories...
        </div>
      )}

      {!categoryStatus.loading && categoryStatus.error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-red-700">
          {categoryStatus.error}
        </div>
      )}

      {!categoryStatus.loading && !categoryStatus.error && categoriesToShow.length === 0 && (
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-8 text-center text-amber-800">
          No categories available yet. Check back soon for leaf tableware collections.
        </div>
      )}

      {!categoryStatus.loading && !categoryStatus.error && categoriesToShow.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesToShow.map((item, idx) => {
            const imageUrl = item.imageUrl || Placeholder1;
            const categoryName = item.name || item.attributes?.Name || "Category";
            const description =
              item.description ||
              item.attributes?.description ||
              "Explore sustainable tableware crafted for everyday use.";

            return (
              <motion.article
                key={item.id || idx}
                className="group overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <button
                  type="button"
                  className="block h-full w-full text-left"
                  onClick={() => handleNavigate(item.id)}
                >
                  <div className="relative h-64 overflow-hidden bg-green-50">
                    <img
                      src={imageUrl}
                      alt={categoryName}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.src = Placeholder1;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-green-800">
                      Category
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-950">
                      {categoryName}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {description}
                    </p>
                    <span className="mt-6 inline-flex items-center text-sm font-semibold text-green-700">
                      View products
                      <span className="ml-2 transition group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </span>
                  </div>
                </button>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
};
