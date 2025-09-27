import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import Lottie from 'lottie-react';
import leafAnimation from '../../assets/Lotie/Leaf.json';
import { fetchProductList, fetchCategorytList, fetchTestimonialsList } from '../../feature/leafSlice';

export default function Preloader({ onFinish, logoRef }) {
  const dispatch = useDispatch();
  const loaderRef = useRef();
  const [percent, setPercent] = useState(0);
  const [apisLoaded, setApisLoaded] = useState(false);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const hasAnimatedRef = useRef(false);
  
  const { product, category, testimonials, loading } = useSelector((state) => state.leaf);

  // Debug logging for Redux state
  console.log("Preloader Redux state - product:", product);
  console.log("Preloader Redux state - category:", category);
  console.log("Preloader Redux state - testimonials:", testimonials);
  console.log("Preloader Redux state - loading:", loading);

  // Load all APIs when preloader starts
  useEffect(() => {
    const loadAllAPIs = async () => {
      try {
        console.log("Preloader: Starting to load all APIs...");
        // Dispatch all API calls
        await Promise.all([
          dispatch(fetchProductList()),
          dispatch(fetchCategorytList()),
          dispatch(fetchTestimonialsList())
        ]);
        console.log("Preloader: All APIs loaded successfully");
        setApisLoaded(true);
      } catch (error) {
        console.error('Preloader: Error loading APIs:', error);
        setApisLoaded(true); // Still continue even if APIs fail
      }
    };

    loadAllAPIs();
  }, [dispatch]);

  // Ensure animation plays for minimum duration (3 seconds)
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      console.log("Preloader: Animation minimum duration completed");
      setAnimationPlayed(true);
    }, 3000); // 3 seconds minimum

    return () => clearTimeout(animationTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev < 100) return prev + 2;
        clearInterval(interval);
        return 100;
      });
    }, 15);

    const watcher = setInterval(() => { 
      // Only finish when progress is 100%, APIs are loaded, AND animation has played for minimum duration
      if (percent >= 100 && apisLoaded && animationPlayed && !hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        console.log("Preloader: All conditions met, starting exit animation");

        const tl = gsap.timeline({
          onComplete: onFinish,
        });

        // 1. Move and shrink logo
        tl.to(logoRef.current, {
          scale: 0.25,
          x: '-38vw',
          y: '-38vh',
          duration: 0.8,
          ease: 'power3.inOut',
        }, 0);

        // 2. Move preloader up
        tl.to(loaderRef.current, {
          y: '-100%',
          duration: 0.6,
          ease: 'power3.inOut',
        }, 0.1);

        clearInterval(watcher);
      }
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(watcher);
    };
  }, [percent, apisLoaded, animationPlayed, onFinish, logoRef]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 bg-white overflow-hidden"
    >
     <div className="h-full w-full flex items-center justify-center">
  <div ref={logoRef} className="w-64 h-64 md:w-96 md:h-96 flex items-center justify-center"> {/* 50% larger on desktop (md: 384px = 256px * 1.5) */}
    <Lottie
      animationData={leafAnimation}
      loop={true}
      autoplay={true}
      style={{ width: '100%', height: '100%' }}
    />
  </div>
</div>


      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-2xl text-gray-500">
        {percent}%
      </div>
    </div>
  );
} 