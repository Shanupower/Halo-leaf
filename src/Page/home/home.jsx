import { About } from "./about";
import { BestSell } from "./bestSell";
import { FeaturedProducts } from "./featuredProducts";
import { Hero } from "./hero";
import { Testimonials } from "./testimonials";
import ContactForm from "./contact";

export const Home = () => {
  return (
    <div className="">
      <Hero />
      <BestSell />
      <FeaturedProducts />
      <About />
      <Testimonials />
      <ContactForm />
    </div>
  );
};
