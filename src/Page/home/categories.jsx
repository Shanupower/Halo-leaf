import React, { useEffect } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { FlipCard } from '../../component/common/FlipCard';

// Import placeholder images for categories
import CategoryPlaceholder1 from '../../assets/category-placeholder-1.png';
import CategoryPlaceholder2 from '../../assets/category-placeholder-2.png';
import CategoryPlaceholder3 from '../../assets/category-placeholder-3.png';
import CategoryPlaceholder4 from '../../assets/category-placeholder-4.png';
import CategoryPlaceholder5 from '../../assets/category-placeholder-5.png';

// AI-generated descriptions for each category
const categoryDescriptions = {
  'Leaf Plates': 'Premium biodegradable plates crafted from naturally fallen leaves, perfect for eco-conscious dining experiences.',
  'Leaf Bowls': 'Durable and elegant bowls made from sustainable leaf materials, ideal for soups, salads, and main courses.',
  'Leaf Cups': 'Lightweight and sturdy cups designed for hot and cold beverages, combining functionality with environmental responsibility.',
  'Leaf Trays': 'Versatile serving trays that add natural elegance to any dining setting while supporting sustainable practices.',
  'Leaf Containers': 'Multi-purpose containers perfect for takeaway meals, picnics, and outdoor dining adventures.',
  'Leaf Utensils': 'Completely biodegradable utensils that provide a natural alternative to plastic cutlery.',
  'Leaf Packaging': 'Eco-friendly packaging solutions that protect your food while protecting the environment.',
  'Leaf Decorations': 'Beautiful decorative elements that bring nature\'s beauty to your special events and celebrations.'
};

export const Categories = () => {
  const { category } = useSelector((state) => state.leaf);

  // Debug logging for category data
  console.log("Categories component - category data:", category);
  console.log("Categories component - category type:", typeof category);
  console.log("Categories component - category length:", category?.length);
  
  // Log first category structure for debugging
  if (category && category.length > 0) {
    console.log("First category structure:", category[0]);
    console.log("First category image:", category[0].image);
  }

  // Test image URL accessibility
  useEffect(() => {
    if (category && category.length > 0) {
      category.forEach((cat, index) => {
        if (cat.image?.url) {
          const testUrl = `http://13.201.41.1:1337${cat.image.url}`;
          console.log(`Testing image URL ${index}:`, testUrl);
          
          // Create a test image to check if URL is accessible
          const testImg = new Image();
          testImg.onload = () => {
            console.log(`✅ Image URL ${index} is accessible:`, testUrl);
          };
          testImg.onerror = (e) => {
            console.error(`❌ Image URL ${index} is NOT accessible:`, testUrl);
            console.error(`   - Error:`, e);
          };
          testImg.src = testUrl;
        }
      });
    }
  }, [category]);

  // Fallback categories if Strapi data is not available
  const fallbackCategories = [
    { 
      id: 1, 
      attributes: { 
        Name: 'Leaf Plates', 
        description: 'Premium biodegradable plates crafted from naturally fallen leaves',
        image: { data: { attributes: { url: CategoryPlaceholder1 } } }
      } 
    },
    { 
      id: 2, 
      attributes: { 
        Name: 'Leaf Bowls', 
        description: 'Durable and elegant bowls made from sustainable leaf materials',
        image: { data: { attributes: { url: CategoryPlaceholder2 } } }
      } 
    },
    { 
      id: 3, 
      attributes: { 
        Name: 'Leaf Cups', 
        description: 'Lightweight and sturdy cups designed for hot and cold beverages',
        image: { data: { attributes: { url: CategoryPlaceholder3 } } }
      } 
    },
    { 
      id: 4, 
      attributes: { 
        Name: 'Leaf Trays', 
        description: 'Versatile serving trays that add natural elegance to any dining setting',
        image: { data: { attributes: { url: CategoryPlaceholder4 } } }
      } 
    },
    { 
      id: 5, 
      attributes: { 
        Name: 'Leaf Containers', 
        description: 'Multi-purpose containers perfect for takeaway meals and picnics',
        image: { data: { attributes: { url: CategoryPlaceholder5 } } }
      } 
    }
  ];

  // Use Strapi categories if available, otherwise use fallback (limit to 5)
  const categoriesToShow = category && category.length > 0 ? category.slice(0, 5) : fallbackCategories;

  return (
    <section className="py-8 md:py-16 px-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 md:mb-4">
        Our Categories
      </h2>
      <p className="text-center text-gray-600 mb-8 md:mb-12 text-sm md:text-base">
        Discover our range of eco-friendly leaf products crafted with care for the environment
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto px-2 md:px-4">
        {categoriesToShow?.map((category, index) => {
          // Debug logging for individual category
          console.log(`Category ${index}:`, category);
          console.log(`Category ${index} has attributes:`, !!category.attributes);
          console.log(`Category ${index} has image:`, !!category.image);
          console.log(`Category ${index} image structure:`, category.image);
          
          // Handle both API response structure and fallback structure
          const isApiResponse = !category.attributes;
          console.log(`Category ${index} isApiResponse:`, isApiResponse);
          
          const categoryName = isApiResponse ? category.Name : category.attributes?.Name || 'Category';
          const categoryDescription = categoryDescriptions[categoryName] || 'Premium quality products';
          
          // Handle image URL for both API response and fallback
          let imageUrl = CategoryPlaceholder1;
          let imageSources = []; // Array to store multiple image source options
          
          if (isApiResponse && category.image?.url) {
            const baseUrl = `http://13.201.41.1:1337${category.image.url}`;
            imageUrl = baseUrl;
            imageSources = [baseUrl];
            
            console.log(`✅ Using API image for ${categoryName}:`, imageUrl);
            console.log(`   - Original image.url:`, category.image.url);
            console.log(`   - Constructed URL:`, baseUrl);
            console.log(`   - Image formats available:`, category.image.formats);
          } else if (!isApiResponse && category.attributes?.image?.data?.attributes?.url) {
            imageUrl = `http://13.201.41.1:1337${category.attributes.image.data.attributes.url}`;
            imageSources = [imageUrl];
            console.log(`✅ Using fallback image for ${categoryName}:`, imageUrl);
          } else {
            console.log(`❌ Using placeholder image for ${categoryName} - API image check failed`);
            console.log(`   - isApiResponse: ${isApiResponse}`);
            console.log(`   - category.image?.url: ${category.image?.url}`);
            console.log(`   - category.attributes?.image?.data?.attributes?.url: ${category.attributes?.image?.data?.attributes?.url}`);
            imageSources = [CategoryPlaceholder1];
          }

          // Simplified image component - the URL is confirmed to work
          const ImageWithFallback = () => {
            const [hasError, setHasError] = React.useState(false);

            const handleImageError = (e) => {
              console.error(`❌ Failed to load image for ${categoryName}:`, imageUrl);
              console.error(`   - Error details:`, e);
              setHasError(true);
            };

            const handleImageLoad = () => {
              console.log(`✅ Image loaded successfully for ${categoryName}:`, imageUrl);
            };

            if (hasError) {
              return (
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {categoryName[0].toUpperCase()}
                  </span>
                </div>
              );
            }

            return (
              <img 
                src={imageUrl}
                alt={categoryName}
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            );
          };

          return (
            <FlipCard
              key={category.id || index}
              frontContent={
                <div className="text-center p-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                    <ImageWithFallback />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {categoryName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {categoryDescription}
                  </p>
                </div>
              }
              backContent={
                <div className="text-center p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {categoryName}
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {categoryDescription}
                  </p>
                  <div className="mt-4">
                    <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs">
                      100% Biodegradable
                    </span>
                  </div>
                </div>
              }
            />
          );
        })}
      </div>
    </section>
  );
};
