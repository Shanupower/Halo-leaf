import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";

const categories = [
  "LEAF PLATES",
  "LEAF BOWLS",
  "LEAF CUPS",
  "LEAF TRAYS",
  "LEAF CONTAINERS",
  "LEAF UTENSILS",
  "LEAF PACKAGING",
  "LEAF DECORATIONS",
  "CUSTOM DESIGNS",
  "ECO-FRIENDLY SOLUTIONS",
];

export const Hero = () => {
  const videoRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipStage, setFlipStage] = useState("show"); // 'show' or 'hide'

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipStage("hide"); // start flipping out
      setTimeout(() => {
        // change text at the midpoint of the animation
        setCurrentIndex((prev) => (prev + 1) % categories.length);
        setFlipStage("show"); // flip back in
      }, 250); // half of animation duration
    }, 1250); // every 2.5s
    return () => clearInterval(interval);
  }, []);

  return (
      <section className="hero-top relative h-screen w-full overflow-hidden">
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
        <div className="absolute inset-0 backdrop-blur-md border border-white/10" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white pt-28">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-shadow">
        Leaf Plates &amp; Tableware for Sustainable Dining
        </h1>
        
        {/* Static + Animated Part */}
        <div className="text-xl md:text-3xl font-medium text-green-200 mb-6 flex justify-center">
  <div className="inline-flex items-center gap-2">
    <span>Handcrafted areca leaf</span>
    <span
      className="relative inline-block"
      style={{ minWidth: "28ch", textAlign: "left" }}
    >
      <span
        className={`inline-block transition-transform duration-500 ease-in-out`}
        style={{
          display: "inline-block",
          transform: flipStage === "hide" ? "rotateX(90deg)" : "rotateX(0deg)",
          transformOrigin: "center",
          backfaceVisibility: "hidden",
        }}
      >
        {categories[currentIndex]}
      </span>
    </span>
  </div>
</div>

        <div className="mt-6 flex flex-col md:flex-row gap-4 justify-left">
          <Link
            to={PATHS.products}
            className="px-6 py-3 bg-white text-green-700 rounded-full font-semibold hover:bg-green-100 transition"
          >
            See Products
          </Link>
          <Link
            to={PATHS.contact}
            className="px-6 py-3 border border-white rounded-full font-semibold hover:bg-white hover:text-green-700 transition"
          >
            Contact Us
          </Link>
        </div>

        {/* Scroll Down Button */}
        <button
          onClick={() => {
            const nextSection = document.getElementById("categories-section");
            if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-10 animate-bounce"
          aria-label="Scroll Down"
        >
          <svg
            className="w-8 h-8 text-white-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
};
