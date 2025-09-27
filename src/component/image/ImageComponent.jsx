import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";

const ImageComponent = ({ src, alt, imgCss, cardCss, variant, onError }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div
      className={`relative flex items-center justify-center   ${
        cardCss || "w-full h-auto  "
      }`}
    >
      {loading && (
        <Skeleton
          variant={variant || "rounded"}
          width="100%"
          height="100%"
          className="absolute inset-0"
        />
      )}

      <img
        src={src}
        alt={alt || "Image"}
        className={`rounded-lg ${imgCss || "object-contain"} 
          transition-opacity duration-500 
          ${loading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setLoading(false)}
        onError={(e) => {
          setLoading(false);
          if (onError) {
            onError(e);
          }
        }}
        loading="lazy"
      />
    </div>
  );
};

export default ImageComponent;
