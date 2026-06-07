import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./style.css";
import Testimonial1 from "../../assets/testimonial1.png";
import Quote from "../../assets/icons8-quote-40.png";
import StarSharpIcon from "@mui/icons-material/StarSharp";
import { Pagination, Navigation } from "swiper/modules";
import ImageComponent from "../../component/image/ImageComponent";
import { useSelector } from "react-redux";

export const Testimonials = () => {
  const { testimonials, dataStatus } = useSelector((state) => state.leaf);
  const testimonialStatus = dataStatus?.testimonials || {};

  return (
    <section className="px-4 py-12 sm:px-[5%] md:px-[8%] md:py-20">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
          Testimonials
        </p>
        <h2 className="text-3xl font-bold text-gray-950 md:text-5xl">
          What customers say about HaloLeaf
        </h2>
        <p className="mt-4 text-base leading-7 text-gray-600">
          Managed from Medusa store metadata through the storefront API.
        </p>
      </div>

      {testimonialStatus.loading && (
        <div className="rounded-3xl border border-green-100 bg-green-50 p-8 text-center text-green-800">
          Loading testimonials from Medusa...
        </div>
      )}

      {!testimonialStatus.loading && testimonialStatus.error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-red-700">
          {testimonialStatus.error}
        </div>
      )}

      {!testimonialStatus.loading && !testimonialStatus.error && testimonials.length === 0 && (
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-8 text-center text-amber-800">
          No testimonials found. Add a `testimonials` array to Medusa store
          metadata to populate this section.
        </div>
      )}

      {!testimonialStatus.loading && !testimonialStatus.error && testimonials.length > 0 && (
      <Swiper
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        slidesPerView={"auto"}
        navigation={true}
        spaceBetween={100}
        modules={[Pagination, Navigation]}
        className="mt-10 cursor-grab"
      >
        {testimonials?.map((testimonial, index) => {
          const imageUrl = testimonial.imageUrl || Testimonial1;

          return (
            <SwiperSlide
              key={testimonial.id || index}
              className="relative rounded-[2rem] border border-green-100 bg-white p-5 shadow-sm sm:p-6 md:p-10"
            >
              <p className="text-lg leading-8 text-gray-800">
                {testimonial.testimonial || testimonial.attributes?.testimonial}
              </p>
              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="relative flex items-center gap-1">
                  <ImageComponent
                    src={imageUrl}
                    cardCss="h-20 w-20 overflow-hidden rounded-full border border-green-100 bg-green-50"
                    imgCss="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = Testimonial1;
                    }}
                  />
                  <div className="absolute -top-2 -left-2">
                    <ImageComponent src={Quote} imgCss=" size-6" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold ">
                      {testimonial.name || testimonial.attributes?.Name || "Happy Customer"}
                    </h3>
                    <p className="text-sm  text-gray-600 ">
                      {testimonial.designation || testimonial.attributes?.designation || "Customer"}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-green-800">
                  <StarSharpIcon /> {testimonial.rating || testimonial.attributes?.rating || "5.0"}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      )}
    </section>
  );
};
