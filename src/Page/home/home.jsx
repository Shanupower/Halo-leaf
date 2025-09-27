import { useSelector } from "react-redux";
import { About } from "./about";
import { BestSell } from "./bestSell";
import { Hero } from "./hero";
import { Testimonials } from "./testimonials";
import ContactForm from "./contact";

export const Home = () => {
  const leaf = useSelector((state) => state.leaf);

  return (
    <div className="">
      <Hero />
      <BestSell />
      <About />
      <Testimonials />
      <ContactForm />
    </div>
  );
};
