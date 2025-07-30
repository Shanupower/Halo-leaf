import React from 'react';
import ReactFlipCard from 'reactjs-flip-card';
import 'reactjs-flip-card/dist/ReactFlipCard.css';
import ProductImage from '../../assets/Homepage/1.png';

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
            frontStyle={{ borderRadius: '1rem', overflow: 'hidden' }}
            backStyle={{
              borderRadius: '1rem',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              textAlign: 'center',
            }}
            frontComponent={
              <img
                src={card.image}
                alt={`Product ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            }
            backComponent={<span className="font-bold text-lg">{card.description}</span>}
          />
        </div>
      ))}
    </div>
  </section>
);

export default BestSell;
