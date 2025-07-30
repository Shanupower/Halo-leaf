import React from 'react';
import ReactFlipCard from 'reactjs-flip-card';
import 'reactjs-flip-card/dist/ReactFlipCard.css';
import ProductImage from '../../assets/Homepage/3.png';
import { motion } from "framer-motion";

const cards = [
  { description: 'This is the description for Card 1.', image: ProductImage },
  { description: 'This is the description for Card 2.', image: ProductImage },
  { description: 'This is the description for Card 3.', image: ProductImage },
  { description: 'This is the description for Card 4.', image: ProductImage },
  { description: 'This is the description for Card 5.', image: ProductImage },
  { description: 'This is the description for Card 6.', image: ProductImage },
  { description: 'This is the description for Card 7.', image: ProductImage },
  { description: 'This is the description for Card 8.', image: ProductImage },
  { description: 'This is the description for Card 9.', image: ProductImage },
];

export const BestSell = () => (
  <section
    id="best-sell-section"
    className="md:px-[10%] sm:px-[5%] px-2 py-4 md:mt-8 sm:mt-4"
  >
    <header className="text-center mb-6">
      <h2 className="md:text-2xl text-xl font-semibold">Explore Our Products</h2>
    </header>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="w-full h-[60vh]">
          <ReactFlipCard
            // Ensure the card fills its parent container
            containerStyle={{ width: '100%', height: '100%' }}
            containerCss="clickable"
            // Use the correct flip trigger
            flipTrigger="onHover"
            direction="horizontal"
            frontStyle={{ borderRadius: '1rem', overflow: 'hidden', backgroundColor: "#1b7b31" }}
            backStyle={{
              borderRadius: '1rem',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              display: 'flex',
              flexWrap: "wrap",
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.2rem',
              textAlign: 'center',
              border: "2px solid green",
            }}
            frontComponent={
              <>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
              >
              <img
                src={card.image}
                alt={`Product ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              </motion.div>
              </>
            }
            backComponent={
            <>
            <span className="font-bold text-lg">{card.description}</span>
            <div>
            <button
            className="mt-5 bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-full mx-auto block transition duration-300"
          >
          Show More Products
          </button>
          </div>
          </>}
          />
        </div>
      ))}
    </div>
  </section>
);

export default BestSell;
