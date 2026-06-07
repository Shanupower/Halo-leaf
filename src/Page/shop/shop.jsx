import { useEffect, useState } from "react";
import { ShopCard } from "./shop-card";
import { Pagination } from "./Pagination";
import { PATHS, productCategoryPath } from "../../routes/paths";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export const Shop = () => {
  const [activeCategoryName, setActiveCategoryName] = useState("All Products");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { category, product, dataStatus } = useSelector((state) => state.leaf);
  const productStatus = dataStatus?.products || {};
  const categoryStatus = dataStatus?.categories || {};

  useEffect(() => {
    if (categoryId) {
      const selectedCategory = category?.find(
        (cat) => cat.id === categoryId
      );
      if (selectedCategory) {
        setActiveCategoryName(selectedCategory.name || selectedCategory.attributes?.Name || "Unknown Category");
      } else {
        setActiveCategoryName("Unknown Category");
      }
    } else {
      setActiveCategoryName("All Products");
    }
  }, [categoryId, category]);

  const filteredProducts = categoryId
    ? product?.filter((item) => {
        const categoryIds =
          item.category_ids ||
          item.categories?.map((cat) => cat.id).filter(Boolean) ||
          item.attributes?.categories?.data?.map((cat) => cat.id) ||
          [];
        return categoryIds.includes(categoryId);
      })
    : product;

  const totalPages = Math.ceil((filteredProducts?.length || 0) / productsPerPage);
  const displayedProducts = filteredProducts?.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  ) || [];

  const handleCategoryClick = (id) => {
    setCurrentPage(1);
    if (id) {
      navigate(productCategoryPath(id));
    } else {
      navigate(PATHS.products);
    }
  };

  return (
    <div className="px-4 py-10 sm:px-[5%] md:px-[8%]">
      <section className="mb-10 rounded-[2rem] bg-[#f7fbf4] px-6 py-10 text-center md:px-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
          Catalog
        </p>
        <h1 className="text-3xl font-bold text-gray-950 md:text-5xl">
          {activeCategoryName}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
          Browse live products, pricing, categories, and images from Medusa.
        </p>
      </section>

      {/* Category Buttons */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        <button
          className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
            !categoryId
              ? "border-green-700 bg-green-700 text-white"
              : "border-green-100 bg-white text-gray-700 hover:border-green-700 hover:text-green-800"
          }`}
          onClick={() => handleCategoryClick(null, "All Products")}
        >
          All Products
        </button>

        {category?.map((cat) => {
          const isActive = cat.id === categoryId;
          return (
            <button
              key={cat.id}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "border-green-700 bg-green-700 text-white"
                  : "border-green-100 bg-white text-gray-700 hover:border-green-700 hover:text-green-800"
              }`}
              onClick={() =>
                handleCategoryClick(cat.id, cat.name || cat.attributes?.Name)
              }
            >
              {cat.name || cat.attributes?.Name}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {(productStatus.loading || categoryStatus.loading) && (
        <div className="rounded-3xl border border-green-100 bg-green-50 p-8 text-center text-green-800">
          Loading Medusa catalog...
        </div>
      )}

      {!productStatus.loading && productStatus.error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-red-700">
          {productStatus.error}
        </div>
      )}

      {!productStatus.loading && !productStatus.error && displayedProducts.length === 0 && (
        <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-amber-100 bg-amber-50 p-8 text-center text-amber-800">
          <h2 className="text-xl font-semibold">
            No Medusa products found for this category.
          </h2>
        </div>
      )}

      {!productStatus.loading && !productStatus.error && displayedProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedProducts.map((item, index) => (
            <ShopCard key={item.id || index} id={item.id || index} item={item} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
          }
        }}
      />
    </div>
  );
};

export default Shop;
