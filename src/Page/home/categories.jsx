import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Autoplay,
  Navigation,
} from "swiper/modules";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./style.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import ImageComponent from "../../component/image/ImageComponent";
import { useSelector } from "react-redux";
export const Categories = () => {
  const isSm = useMediaQuery("(max-width:760px)"); // Mobile
  const isMd = useMediaQuery("(max-width:1060px)"); // Tablet
  const { category } = useSelector((state) => state.leaf);

  return (
    <div className="md:px-[10%] sm:px-[5%] px-2">
      <div className="rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl px-2 py-8 md:mt-8 sm:mt-4 transition-all duration-500">
        <div className="text-center">
          <h2 className="md:text-4xl  text-xl  font-semibold">Categories</h2>
          <p className="md:text-[16px] text-gray-600 mt-1">
            Find what you are looking for
          </p>
        </div>

        <div className="mt-12">
          <Swiper
            grabCursor={true}
            centeredSlides={true}
            navigation={true}
            slidesPerView={isSm ? 1 : isMd ? 2 : 4}
            pagination={{
              dynamicBullets: true,
              clickable: true,
            }}
            modules={[Pagination, Autoplay, Navigation]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="gap-6"
          >
            {Array.isArray(category) &&
              category?.map((item, index) => (
                <SwiperSlide key={index} className="">
                  <div className="flex flex-col items-center">
                    <div className="w-[160px] h-[160px] md:w-[140px] md:h-[140px] sm:w-[120px] sm:h-[120px] rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-2xl">
                      <ImageComponent
                        src={item?.image?.formats?.large?.url ? `${import.meta.env.VITE_Image_BASE_URL}${item.image.formats?.large?.url}` : "http://13.204.64.227:1337/uploads/thumbnail_6_3941d44fee.png"}
                        alt="imt"
                        cardCss="w-[85%] h-[85%] object-contain rounded-xl shadow-md bg-white/10 backdrop-blur-md border border-white/10 border-opacity-20"
                      />
                    </div>
                    <div className="text-center mt-4">
                      <h3 className="text-[16px] font-semibold text-black/80 drop-shadow-sm">
                        {item?.Name}
                      </h3>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};
