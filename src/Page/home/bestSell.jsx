import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import ImageComponent from "../../component/image/ImageComponent";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";

export const BestSell = () => {
  const [hideDetails, setHideDetails] = useState(false);
  const isMd = useMediaQuery("(min-width:768px)");
  const { product } = useSelector((state) => state.leaf);

  return (
    <div id="best-sell-section" className="md:px-[10%] md:h-[60vh] sm:px-[5%] px-2 py-4 md:mt-8 sm:mt-4 flex md:flex-row flex-col gap-6   justify-between">
      {/* Left Side Details with Animation */}
      <motion.div
        initial={{ opacity: 1, x: 0 }}
        animate={{ opacity: hideDetails ? 0 : 1, x: hideDetails ? -100 : 0 }}
        transition={{ duration: 0.5 }}
        className={`transition-all  ${hideDetails ? "w-0" : "md:w-1/3"}`}
      >
        <h3 className="md:text-3xl sm:text-2xl text-xl font-semibold">
          Best Selling Products
        </h3>
        <p className="text-gray-500 mt-2">
          “Every product at Halo Leaf is designed with the environment in mind.
          Discover how our eco-friendly practices make a difference.
        </p>
        <Link
          to="/shop"
          className="bg-[var(--color-secondry)] w-max px-2 py-2 rounded-md flex items-center gap-1 mt-4"
        >
          See more <ArrowRightAltIcon />
        </Link>
      </motion.div>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={3}
        className={`max-h-[54vh]   ${
          hideDetails ? "w-full" : "md:w-2/3 w-full"
        }`}
        onSlideChange={(swiper) => {
          if (isMd) {
            setHideDetails(swiper.activeIndex !== 0);
          }
        }}
      >
        {Array.isArray(product) &&
          product.map((item) => (
            <SwiperSlide key={item.id}>
              <Link
                to={`/product/${item.documentId}`}
                className="flex flex-col items-center justify-center "
              >
                <ImageComponent
                  src={
                    item?.image?.[0]?.formats?.large?.url
                      ? `${import.meta.env.VITE_Image_BASE_URL}${
                          item.image[0].formats?.large?.url
                        }`
                      : "/fallback-image.png"
                  }
                  alt={item.name}
                  cardCss="md:h-[45vh] rounded-md border-2 border-gray-200 hover:shadow-lg transition-shadow duration-300"
                  imgCss=" object-contain"
                />
                <p className="sm:text-[18px] mt-2">{item?.title}</p>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};
