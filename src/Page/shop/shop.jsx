import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ShopCard } from "./shop-card"; // Make sure Pagination is exported from shop-card
import { Pagination } from "./Pagination";

const categories = [
  "All Products",
  "Earrings",
  "Necklace",
  "Bracelet",
  "Rings",
  "Watches",
];

export const Shop = () => {
  const { product } = useSelector((state) => state.leaf);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Filter products based on selected category
  const filteredProducts =
    activeCategory === "All Products"
      ? product
      : product.filter((p) =>
          p.title.toLowerCase().includes(activeCategory.toLowerCase())
        );

  // Slice the products for pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="px-4 md:px-20 py-10">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 mt-20">
        Discover Our Products
      </h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
              activeCategory === cat
                ? "bg-black text-white"
                : "text-gray-700 border-gray-300 hover:border-black"
            }`}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentPage(1); // Reset to first page when category changes
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {displayedProducts.length === 0 ? (
        <div className="flex justify-center items-center h-[50vh]">
          <h1 className="text-2xl">No items in the Product</h1>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {displayedProducts.map((item, index) => (
              <ShopCard key={index} id={index} item={item} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
