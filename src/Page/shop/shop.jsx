import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShopCard } from "./shop-card";
import { Pagination } from "./Pagination";
import { useNavigate, useParams } from "react-router-dom";

export const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategoryName, setActiveCategoryName] = useState("All Products");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const { categoryId } = useParams(); // Get category from URL path
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://97.74.93.91:1330/api/categories");
        const fetched = res.data.data || [];
        setCategories(fetched);

        // Match URL categoryId to category name
        if (categoryId) {
          const selectedCategory = fetched.find(
            (cat) => cat.documentId === categoryId
          );
          if (selectedCategory) {
            setActiveCategoryName(selectedCategory.Name);
          } else {
            setActiveCategoryName("Unknown Category");
          }
        } else {
          setActiveCategoryName("All Products");
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, [categoryId]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "http://97.74.93.91:1330/api/products?populate=*";

        if (categoryId) {
          url += `&filters[category][documentId][$eq]=${categoryId}`;
        }

        const res = await axios.get(url);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, [categoryId]);

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const displayedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handle category change
  const handleCategoryClick = (id, name) => {
    setCurrentPage(1);
    if (id) {
      navigate(`/product/${id}`);
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

        {categories.map((category) => {
          const isActive = category.documentId === categoryId;
          return (
            <button
              key={category.documentId}
              className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 border-gray-300 hover:border-black"
              }`}
              onClick={() =>
                handleCategoryClick(category.documentId, category.Name)
              }
            >
              {category.Name}
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
            <ShopCard key={index} id={index} item={item} />
          ))}
        </div>
      )}

      {/* Pagination */}
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