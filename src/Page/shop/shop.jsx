import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShopCard } from "./shop-card";
import { Pagination } from "./Pagination";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export const Shop = () => {
  const [activeCategoryName, setActiveCategoryName] = useState("All Products");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { category, product } = useSelector((state) => state.leaf);

  useEffect(() => {
    if (categoryId) {
      const selectedCategory = category?.find(
        (cat) => cat.id === categoryId
      );
      if (selectedCategory) {
        setActiveCategoryName(selectedCategory.attributes?.Name || "Unknown Category");
      } else {
        setActiveCategoryName("Unknown Category");
      }
    } else {
      setActiveCategoryName("All Products");
    }
  }, [categoryId, category]);

  const filteredProducts = categoryId 
    ? product?.filter(item => item.attributes?.category?.data?.id === parseInt(categoryId))
    : product;

  const totalPages = Math.ceil((filteredProducts?.length || 0) / productsPerPage);
  const displayedProducts = filteredProducts?.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  ) || [];

  const handleCategoryClick = (id, name) => {
    setCurrentPage(1);
    if (id) {
      navigate(`/product/category/${id}`);
    } else {
      navigate("/product");
    }
  };

  return (
    <div className="px-4 md:px-20 py-10">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 mt-20">
        {activeCategoryName}
      </h2>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
            !categoryId
              ? "bg-black text-white"
              : "text-gray-700 border-gray-300 hover:border-black"
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
              className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 border-gray-300 hover:border-black"
              }`}
              onClick={() =>
                handleCategoryClick(cat.id, cat.attributes?.Name)
              }
            >
              {cat.attributes?.Name}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {displayedProducts.length === 0 ? (
        <div className="flex justify-center items-center h-[50vh]">
          <h1 className="text-2xl">No items in this category</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
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
