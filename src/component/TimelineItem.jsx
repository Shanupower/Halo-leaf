import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const TimelineItem = ({ period, text, image, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  React.useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  // decide slide direction
  const fromLeft = index % 2 === 0;
  const initial = fromLeft ? { opacity: 0, x: -80 } : { opacity: 0, x: 80 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={controls}
      variants={{ visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
      className="relative flex flex-col md:flex-row items-center my-16"
    >
      {/* Left: period */}
      <div className="w-full md:w-1/4 text-center md:text-right mb-6 md:mb-0 md:pr-8">
        <span className="text-4xl font-bold text-gray-800">{period}</span>
      </div>

      {/* Center line + dot */}
      <div className="relative w-full md:w-0 flex justify-center mb-6 md:mb-0">
        <div className="absolute h-full w-px bg-gray-300"></div>
        <div className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full"></div>
      </div>

      {/* Right: text + image */}
      <div className="w-full md:w-3/4 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="md:w-1/2 text-gray-700 leading-relaxed">
          {text}
        </div>
        <img
          src={image}
          alt=""
          className="md:w-1/2 w-full rounded-xl object-cover"
        />
      </div>
    </motion.div>
  );
};
export default TimelineItem;
