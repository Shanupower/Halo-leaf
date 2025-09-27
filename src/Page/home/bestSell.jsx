import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactFlipCard from 'reactjs-flip-card';
import 'reactjs-flip-card/dist/ReactFlipCard.css';
import { motion } from "framer-motion";

// Import placeholder images
import Placeholder1 from '../../assets/product-placeholder-1.png';
import Placeholder2 from '../../assets/product-placeholder-2.png';
import Placeholder3 from '../../assets/product-placeholder-3.png';
import Placeholder4 from '../../assets/product-placeholder-4.png';
import Placeholder5 from '../../assets/product-placeholder-5.png';
import Placeholder6 from '../../assets/product-placeholder-6.png';

// Hook to detect mobile screen
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

export const BestSell = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { category } = useSelector((state) => state.leaf);

  // Debug logging for categories
  console.log("Categories from Redux:", category);
  console.log("Categories length:", category?.length);

  // Fallback categories for when Strapi data is not available
  const fallbackCategories = [
    {
      id: 1,
      attributes: {
        Name: 'Premium Leaf Plates',
        description: 'Handcrafted biodegradable plates made from naturally fallen leaves',
        image: { data: { attributes: { url: Placeholder1 } } }
      }
    },
    {
      id: 2,
      attributes: {
        Name: 'Eco-Friendly Bowls',
        description: 'Sustainable leaf bowls perfect for soups and salads',
        image: { data: { attributes: { url: Placeholder2 } } }
      }
    },
    {
      id: 3,
      attributes: {
        Name: 'Natural Leaf Cups',
        description: 'Biodegradable cups made from traditional leaf crafting',
        image: { data: { attributes: { url: Placeholder3 } } }
      }
    },
    {
      id: 4,
      attributes: {
        Name: 'Leaf Trays',
        description: 'Elegant serving trays crafted from sustainable leaf materials',
        image: { data: { attributes: { url: Placeholder4 } } }
      }
    },
    {
      id: 5,
      attributes: {
        Name: 'Leaf Containers',
        description: 'Versatile containers for food storage and serving',
        image: { data: { attributes: { url: Placeholder5 } } }
      }
    }
  ];

  // Use Strapi categories if available, otherwise use fallback
  const categoriesToShow = category && category.length > 0 ? category.slice(0, 5) : fallbackCategories;
  
  console.log("Categories to show:", categoriesToShow);

  const handleNavigate = (categoryId) => {
    if (categoryId) {
      navigate(`/product/category/${categoryId}`);
    } else {
      navigate("/product");
    }
  };

  return (
    <section id="best-sell-section" className="md:px-[10%] sm:px-[5%] px-2 py-4 md:mt-8 sm:mt-4">
      <header className="text-center mb-6">
        <h2 className="md:text-2xl text-xl font-semibold">Our Premium Products</h2>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categoriesToShow.map((category, idx) => {
          // Debug logging for each category
          console.log(`Category ${idx}:`, category);
          console.log(`Category ${idx} attributes:`, category.attributes);
          console.log(`Category ${idx} image:`, category.attributes?.image);
          
          const imageUrl = category.attributes?.image?.data?.attributes?.url
            ? `http://13.201.41.1:1337${category.attributes.image.data.attributes.url}`
            : Placeholder1; // Use actual placeholder image
          
          console.log(`Category ${idx} imageUrl:`, imageUrl);
          
          const categoryId = category.id;
          const categoryName = category.attributes?.Name || 'Category';

          return (
            <div key={category.id || idx} className="w-full aspect-[3/4]">
              <ReactFlipCard
                containerStyle={{ width: '100%', height: '100%' }}
                containerCss="clickable"
                flipTrigger={isMobile ? 'onClick' : 'onHover'}
                direction="horizontal"
                frontStyle={{
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  backgroundColor: "#1b7b31"
                }}
                backStyle={{
                  borderRadius: '1rem',
                  backgroundColor: '#ffffff',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.2rem',
                  textAlign: 'left',
                  border: "2px solid green",
                  flexDirection: 'column'
                }}
                frontComponent={
                  <motion.img
                    src={imageUrl}
                    alt={categoryName}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    onError={(e) => {
                      console.error(`Failed to load image for category ${idx}:`, imageUrl);
                      e.target.src = Placeholder1; // Use actual placeholder image
                    }}
                  />
                }
                backComponent={
                  <>
                    <span className="font-bold text-lg text-black mb-3">
                      {categoryName}
                    </span>
                    <p className="text-sm text-gray-700 mb-4 text-center">
                      {category.attributes?.description || 'High-quality, sustainable products designed with environmental responsibility in mind.'}
                    </p>
                    <div className="mt-2 mb-4">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        100% Biodegradable
                      </span>
                    </div>
                    {categoryId && (
                      <button
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition duration-300"
                        onClick={() => handleNavigate(categoryId)}
                      >
                        View {categoryName}
                      </button>
                    )}
                  </>
                }
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
