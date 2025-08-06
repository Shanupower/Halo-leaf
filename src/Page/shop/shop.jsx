import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShopCard } from "./shop-card";
import { Pagination } from "./Pagination";

export const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null); // null means All Products
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://97.74.93.91:1330/api/categories");
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever activeCategoryId changes
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      let url = "http://97.74.93.91:1330/api/products?populate=*";

      if (activeCategoryId) {
        url += `&filters[category][documentId][$eq]=${activeCategoryId}`;
      }

      const res = await axios.get(url);
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };
  fetchProducts();
}, [activeCategoryId]);

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const displayedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handle category click
  const handleCategoryClick = (id, name) => {
    setActiveCategoryId(id);
    setActiveCategory(name);
    setCurrentPage(1);
  };

  return (
    <div className="px-4 md:px-20 py-10">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 mt-20">
        Discover Our Products
      </h2>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
            activeCategoryId === null
              ? "bg-black text-white"
              : "text-gray-700 border-gray-300 hover:border-black"
          }`}
          onClick={() => handleCategoryClick(null, "All Products")}
        >
          All Products
        </button>
        {categories.map((category) => {
          const isActive = activeCategoryId === category.documentId;
          return (
            <button
              key={category.documentId}
              className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 border-gray-300 hover:border-black"
              }`}
              onClick={() => handleCategoryClick(category.documentId, category.Name)}
            >
              {category.Name}
            </button>
          );
        })}
      </div>

      {/* Products grid */}
      {displayedProducts.length === 0 ? (
        <div className="flex justify-center items-center h-[50vh]">
          <h1 className="text-2xl">No items in the Product</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {displayedProducts.map((item, index) => (
            <ShopCard key={index} id={index} item={item} />
          ))}
        </div>
      )}

      {/* Pagination Component */}
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
