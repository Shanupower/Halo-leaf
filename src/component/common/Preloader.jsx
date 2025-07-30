import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import logo from '../../assets/new-logo.png';

export default function Preloader({ onFinish, logoRef }) {
  const loaderRef = useRef();
  const [percent, setPercent] = useState(0);
  const hasAnimatedRef = useRef(false); // ✅ track if animation already ran

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev < 100) return prev + 1;
        clearInterval(interval);
        return 100;
      });
    }, 25);

    const watcher = setInterval(() => { 
      if (percent >= 100 && !hasAnimatedRef.current) {
        hasAnimatedRef.current = true; // ✅ mark as animated

        const tl = gsap.timeline({
          onComplete: onFinish,
        });

        // 1. Move and shrink logo
        tl.to(logoRef.current, {
          scale: 0.25,
          x: '-38vw',
          y: '-38vh',
          duration: 1.2,
          ease: 'power3.inOut',
        }, 0);

        // 2. Move preloader up, starting before logo finishes
        tl.to(loaderRef.current, {
          y: '-100%',
          duration: 1,
          ease: 'power3.inOut',
        }, 0.2);

        clearInterval(watcher);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(watcher);
    };
  }, [percent, onFinish, logoRef]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 bg-white overflow-hidden"
    >
     <div className="h-full w-full flex items-center justify-center">
  <img
    ref={logoRef}
    src={logo}
    alt="logo"
    className="w-48 h-48 object-contain transition-transform duration-300 hover:scale-[1.05]"
  />
</div>


      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-2xl text-gray-500">
        {percent}%
      </div>
    </div>
  );
} 