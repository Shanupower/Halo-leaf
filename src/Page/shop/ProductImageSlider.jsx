import React, { useState, useEffect } from 'react';
import './product.css'; // keep your CSS or adjust styles here

const ProductImageSlider = ({ images }) => {
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    if (images && images.length > 0) {
      setMainImage(images[0]);
    }
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="image-slider-wrapper">
      <div className="main-image-container">
        <img src={mainImage} alt="Main Product" className="main-image" />
        
        <div className="thumbnail-inside-container">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index}`}
              className={`thumbnail ${mainImage === img ? 'active' : ''}`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageSlider;
