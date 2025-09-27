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
  const { testimonials } = useSelector((state) => state.leaf);

  // Fallback testimonials for when Strapi data is not available
  const fallbackTestimonials = [
    {
      id: 1,
      attributes: {
        Name: 'Sarah Johnson',
        designation: 'Restaurant Owner',
        testimonial: "HaloLeaf's biodegradable plates are absolutely amazing! They're sturdy, beautiful, and completely eco-friendly. Perfect for our restaurant's sustainable dining initiative.",
        rating: '5.0',
        image: { data: { attributes: { url: '/placeholder.png' } } }
      }
    },
    {
      id: 2,
      attributes: {
        Name: 'Michael Chen',
        designation: 'Event Planner',
        testimonial: "We used HaloLeaf products for our corporate event and received countless compliments. The quality is outstanding and the environmental impact is exactly what we wanted.",
        rating: '5.0',
        image: { data: { attributes: { url: '/placeholder.png' } } }
      }
    },
    {
      id: 3,
      attributes: {
        Name: 'Emily Rodriguez',
        designation: 'Catering Manager',
        testimonial: "These leaf plates have revolutionized our catering business. They're elegant, functional, and our clients love knowing they're making an eco-friendly choice.",
        rating: '5.0',
        image: { data: { attributes: { url: '/placeholder.png' } } }
      }
    }
  ];

  // Use Strapi testimonials if available, otherwise use fallback
  const testimonialsToShow = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <div className="md:px-[10%] sm:px-[5%] px-2 py-4 md:mt-8 sm:mt-4 mb-20 ">
      <div>
        <h3 className="md:text-2xl text-xl md:text-left text-center font-semibold md:w-[26%]">
          What customers say about HaloLeaf?
        </h3>
      </div>
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
        {testimonialsToShow?.map((testimonial, index) => {
          const imageUrl = testimonial.attributes?.image?.data?.attributes?.url
            ? `http://13.201.41.1:1337${testimonial.attributes.image.data.attributes.url}`
            : Testimonial1;

          return (
            <SwiperSlide
              key={testimonial.id || index}
              className="bg-[var(--color-secondry)] opacity-90 rounded-xl md:p-10 sm:p-6 p-4 relative"
            >
              <p className="text-gray-800">
                {testimonial.attributes?.testimonial || 
                 "HaloLeaf's biodegradable plates are absolutely amazing! They're sturdy, beautiful, and completely eco-friendly. Perfect for our restaurant's sustainable dining initiative."}
              </p>
              <div className="flex justify-between items-center ">
                <div className="relative flex items-center gap-1">
                  <ImageComponent
                    src={imageUrl}
                    cardCss="md:w-[100px] w-[80px] mt-2 h-[20vh] "
                    onError={(e) => {
                      console.error(`Failed to load testimonial image ${index}:`, imageUrl);
                      e.target.src = Testimonial1;
                    }}
                  />
                  <div className="absolute top-8 left-0">
                    <ImageComponent src={Quote} imgCss=" size-6" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold ">
                      {testimonial.attributes?.Name || 'Happy Customer'}
                    </h3>
                    <p className="text-sm  text-gray-600 ">
                      {testimonial.attributes?.designation || 'Customer'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <StarSharpIcon /> {testimonial.attributes?.rating || '5.0'}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
