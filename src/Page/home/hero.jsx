import React, { useRef } from 'react';
import { ReactTyped } from 'react-typed';

const textsToType = [
  'We provide solutions in BIO-FERTILIZERS',
  'We provide solutions in BIO-FUNGICIDES',
  'We provide solutions in BIO-INSECTICIDES',
  'We provide solutions in BIO-NEMATICIDES',
  'We provide solutions in BIO-STIMULANTS',
  'We provide solutions in MICRONUTRIENTS',
  'We provide solutions in PROBIOTICS',
  'We provide solutions in SOIL CONDITIONERS',
  'We provide solutions in SPECIALTY PRODUCTS',
  'We provide solutions in RESEARCH & DEVELOPMENT',
];

export const Hero = () => {
  const videoRef = useRef();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background video and overlay */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="src/assets/videoplayback.mp4"
          autoPlay
          muted
          loop
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/10" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white pt-28">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-shadow">
          Sustainable Tableware for a Greener Tomorrow
        </h1>

        <div className="text-xl md:text-3xl font-medium text-green-200 mb-6">
          <ReactTyped
            strings={textsToType}
            typeSpeed={60}
            backSpeed={40}
            loop
          />
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <a
            href="#products"
            className="px-6 py-3 bg-white text-green-700 rounded-full font-semibold hover:bg-green-100 transition"
          >
            See Products
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-white rounded-full font-semibold hover:bg-white hover:text-green-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};
