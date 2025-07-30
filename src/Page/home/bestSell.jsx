import React from 'react';
import ReactFlipCard from 'reactjs-flip-card';
import 'reactjs-flip-card/dist/ReactFlipCard.css';
import ProductImage from '../../assets/Homepage/3.png';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';

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

const cards = Array(9).fill({
  description: 'Eco-friendly, high-quality product for sustainable living.',
  image: ProductImage
});

export const BestSell = () => {
  const isMobile = useIsMobile();

  return (
    <section id="best-sell-section" className="md:px-[10%] sm:px-[5%] px-2 py-4 md:mt-8 sm:mt-4">
      <header className="text-center mb-6">
        <h2 className="md:text-2xl text-xl font-semibold">Explore Our Products</h2>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="w-full aspect-[3/4]">
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
                textAlign: 'center',
                border: "2px solid green",
                flexDirection: 'column'
              }}
              frontComponent={
                <motion.img
                  src={card.image}
                  alt={`Product ${idx + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                />
              }
              backComponent={
                <>
                  <span className="font-bold text-lg text-black">{card.description}</span>
                  <button
                    className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition duration-300"
                  >
                    Show More
                  </button>
                </>
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSell;
