import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const stats = [
  { end: 19, label: 'CIB&RC Registered Products' },
  { end: 14, label: 'Biofertilizers under FCO, 1985' },
  { end: 15, label: 'Biostimulants under FCO, 1985' },
  { end: 13, label: 'Plant Nutrients under FCO, 1985' },
  { end: 23, label: 'Ecocert Certified Organic Products' },
];

export const Categories = () => (
  <section className="py-8 md:py-16 px-4">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 md:mb-4">
      Reviving soils one application at a time    
    </h2>
    <p className="text-center text-gray-600 mb-8 md:mb-12 text-sm md:text-base">
      Reviving soils one application at a time    
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-8 max-w-7xl mx-auto px-2 md:px-4">
      {stats.map(({ end, label }, i) => (
        <StatCircle key={i} end={end} label={label} index={i} />
      ))}
    </div>
  </section>
);

function StatCircle({ end, label, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const circleStyles = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    minHeight: '120px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  };

  const svgStyles = {
    width: '100%',
    height: 'auto',
    display: 'block',
    maxWidth: '120px',
  };

  const ringBgStyles = {
    fill: 'none',
    stroke: '#e5e7eb',
    strokeWidth: '0.5',
  };

  const ringFgStyles = {
    fill: 'none',
    stroke: '#f97316',
    strokeWidth: '1',
    strokeDasharray: '283',
    strokeDashoffset: '141.5',
    transition: 'stroke-dashoffset 1s ease',
    transform: index % 2 === 0 ? 'rotate(0deg)' : 'rotate(180deg)',
    transformOrigin: '50% 50%',
  };

  const innerTextStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    lineHeight: '1.2',
    width: '80%',
  };

  const countStyles = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1f2937',
    display: 'block',
  };

  const labelStyles = {
    fontSize: '0.65rem',
    color: '#374151',
    lineHeight: '1.3',
    marginTop: '0.25rem',
    fontWeight: '500',
  };

  // Media query styles using CSS-in-JS approach
  const getResponsiveStyles = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      
      if (width >= 1280) {
        return {
          svg: { ...svgStyles, maxWidth: '200px' },
          circle: { ...circleStyles, minHeight: '200px' },
          count: { ...countStyles, fontSize: '3rem' },
          label: { ...labelStyles, fontSize: '0.8rem', marginTop: '0.5rem' },
        };
      } else if (width >= 1024) {
        return {
          svg: { ...svgStyles, maxWidth: '180px' },
          circle: { ...circleStyles, minHeight: '180px' },
          count: { ...countStyles, fontSize: '2.5rem' },
          label: { ...labelStyles, fontSize: '0.75rem' },
        };
      } else if (width >= 768) {
        return {
          svg: { ...svgStyles, maxWidth: '160px' },
          circle: { ...circleStyles, minHeight: '160px' },
          count: { ...countStyles, fontSize: '2.2rem' },
          label: { ...labelStyles, fontSize: '0.7rem' },
        };
      } else if (width >= 480) {
        return {
          svg: { ...svgStyles, maxWidth: '140px' },
          circle: { ...circleStyles, minHeight: '140px' },
          count: { ...countStyles, fontSize: '2rem' },
          label: { ...labelStyles, fontSize: '0.68rem' },
        };
      }
    }
    
    return {
      svg: svgStyles,
      circle: circleStyles,
      count: countStyles,
      label: labelStyles,
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <div 
      ref={ref} 
      className="group"
      style={responsiveStyles.circle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        const ring = e.currentTarget.querySelector('.ring-fg');
        if (ring) ring.style.strokeDashoffset = '0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        const ring = e.currentTarget.querySelector('.ring-fg');
        if (ring) ring.style.strokeDashoffset = '141.5';
      }}
    >
      <svg style={responsiveStyles.svg} viewBox="0 0 100 100">
        <circle 
          style={ringBgStyles}
          cx="50" 
          cy="50" 
          r="45" 
        />
        <circle 
          className="ring-fg"
          style={ringFgStyles}
          cx="50" 
          cy="50" 
          r="45" 
        />
      </svg>
      <div style={innerTextStyles}>
        {inView && (
          <CountUp
            end={end}
            duration={10}
            separator=","
            suffix="+"
            style={responsiveStyles.count}
          />
        )}
        <div style={responsiveStyles.label}>{label}</div>
      </div>
    </div>
  );
}