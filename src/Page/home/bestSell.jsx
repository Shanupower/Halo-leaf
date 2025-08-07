import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlipCard from 'reactjs-flip-card';
import 'reactjs-flip-card/dist/ReactFlipCard.css';
import { motion } from "framer-motion";

// Importing images
import ProductImage1 from '../../assets/Homepage/1.png';
import ProductImage2 from '../../assets/Homepage/2.png';
import ProductImage3 from '../../assets/Homepage/3.png';
import ProductImage4 from '../../assets/Homepage/4.png';
import ProductImage5 from '../../assets/Homepage/5.png';
import ProductImage6 from '../../assets/Homepage/6.png';
import ProductImage7 from '../../assets/Homepage/7.png';
import ProductImage8 from '../../assets/Homepage/8.png';
import ProductImage9 from '../../assets/Homepage/9.png';

// Hook to detect mobile screen
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

// Data
const cards = [
  {
    image: ProductImage1,
    content: "Harness nature’s microbes to enrich soil fertility and boost plant vigor",
    list1: "Naturally fixes atmospheric nitrogen (Rhizobium, Azospirillum)",
    list2: "Enhances root nodulation and early growth",
    list3: "Builds long-term organic matter in soil",
    list4: "Safe for organic and conventional farming",
    categoryId: "uya2xkeoz2c2yysibndo2nib",
    category: "bio-fertilizers",
  },
  {
    image: ProductImage2,
    content: "Keep fungal diseases under control with powerful, living formulations.",
    list1: "Uses Trichoderma and antagonistic microbes to suppress root rot, blights, mildews",
    list2: "Colonizes rhizosphere for ongoing disease protection",
    list3: "Non-toxic, residue-free and safe for the environment",
    list4: "Proven efficacy on fruits, vegetables, cereals and ornamentals",
    categoryId: "axs3xv48f4gcbzto0wfqxb15",
    category: "bio-fungicides"
  },
  {
    image: ProductImage3,
    content: "Precision pest control that protects crops without chemical residues.",
    list1: "Targets caterpillars, aphids, whiteflies and other major pests",
    list2: "Based on Bacillus thuringiensis and other eco-friendly strains",
    list3: "Harmless to pollinators, soil fauna and beneficial insects",
    list4: "Fully compatible with Integrated Pest Management (IPM)",
    categoryId: "u1vc546apu4q4zabnaqehojj",
    category: "bio-insecticides",
  },
  {
    image: ProductImage4,
    content: "Defend your root zone from damaging nematodes naturally.",
    list1: "Contains specialized fungi that invade and neutralize root-knot and lesion nematodes",
    list2: "Restores healthy root architecture and nutrient uptake",
    list3: "Fully biodegradable with zero chemical residues",
    list4: "Ideal for high-value and sensitive crops",
    categoryId: "xkvt03fkolfqdiem3s1s6kxs",
    category: "bio-nematicides",
  },
  {
    image: ProductImage8,
    content: "Deliver essential trace elements where plants need them most.",
    list1: "Precision-chelated zinc, iron, manganese and more for rapid uptake",
    list2: "Boosts chlorophyll synthesis and enzyme function",
    list3: "Corrects hidden deficiencies to improve crop quality",
    list4: "Tailored formulations for horticultural and row crops",
  },
  {
    image: ProductImage5,
    content: "Supercharge plant growth and stress resilience with botanical extracts.",
    list1: "Seaweed concentrates and amino acids accelerate germination and flowering",
    list2: "Improves drought, heat and salinity tolerance",
    list3: "Enhances nutrient uptake when used with fertilizers and bio-inputs",
    list4: "Safe, sustainable support for every growth stage",
    categoryId: "optx1dl0o3jafx8o4y8ns3qk",
    category: "bio-stimulants",
  },
  {
    image: ProductImage6,
    content: "Transform depleted soils into moisture-holding, fertile substrates.",
    list1: "Mycorrhizal fungi and humic substances improve aggregation and aeration",
    list2: "Increases water retention and root penetration",
    list3: "Builds organic matter for sustained soil health",
    list4: "Supports robust crop growth season after season",
  },
  {
    image: ProductImage7,
    content: "Rebalance your soil microbiome to foster healthier crops.",
    list1: "Introduces beneficial Bacillus, Pseudomonas and Streptomyces strains",
    list2: "Outcompetes pathogens and accelerates nutrient cycling",
    list3: "Strengthens root systems for durable plant health",
    list4: "Reduces reliance on synthetic inputs over time",
    categoryId: "n4xs5hxc3ys1538w9vb58z5n",
    category: "probiotics",
  },
  {
    image: ProductImage9,
    content: "Tailored bio-solutions for unique agronomic challenges.",
    list1: "Omega Aqua™: Pond bioremediation and algae control systems",
    list2: "Sil-Mo™: Silica mobilizers to reinforce cell walls and enhance stress tolerance",
    list3: "Custom blends designed for your specific environment and crop needs",
    list4: "Safe for organic and conventional farming",
    categoryId: "d8msvofzwys2vipqq8xmy3et",
    category: "special-products",
  },
];

export const BestSell = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleNavigate = (categoryId) => {
    if (categoryId) {
      navigate(`/product/category/${categoryId}`);
    } else {
      navigate("/product");
    }
  };

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
                textAlign: 'left',
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
                  <span className="font-bold text-lg text-black">{card.content}</span>
                  <ul className='mt-2 text-sm text-gray-700'>
                    <li>1. {card.list1}</li>
                    <li>2. {card.list2}</li>
                    <li>3. {card.list3}</li>
                    <li>4. {card.list4}</li>
                  </ul>
                  {card.categoryId && (
                    <button
                      className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition duration-300"
                      onClick={() => handleNavigate(card.categoryId)}
                    >
                      View Products
                    </button>
                  )}
                </>
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
};
