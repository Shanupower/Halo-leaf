import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import './style.css'; // make sure this loads your updated CSS

const stats = [
  { end: 19, label: 'CIB&RC Registered Products' },
  { end: 14, label: 'Biofertilizers under FCO, 1985' },
  { end: 15, label: 'Biostimulants under FCO, 1985' },
  { end: 13, label: 'Plant Nutrients under FCO, 1985' },
  { end: 23, label: 'Ecocert Certified Organic Products' },

];

export const Categories = () => (
  <section className="py-16 px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
    Reviving soils one application at a time    </h2>
    <p className="text-center text-gray-600 mb-12">
    Reviving soils one application at a time    </p>

    <div  className="stats-grid gap-8 max-w-6xl mx-auto px-4">
      {stats.map(({ end, label }, i) => (
        <StatCircle key={i} end={end} label={label} />
      ))}
    </div>
  </section>
);

function StatCircle({ end, label }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div ref={ref} className="stat-circle group flex items-center justify-center">
      <svg className="w-50 h-50" viewBox="0 0 100 100">
        <circle className="ring-bg" cx="50" cy="50" r="45" />
        <circle className="ring-fg" cx="50" cy="50" r="45" />
      </svg>
      <div className="inner-text">
        {inView && (
          <CountUp
            end={end}
            duration={10}
            separator=","
            suffix="+"
            className="count"
          />
        )}
        <div className="label">{label}</div>
      </div>
    </div>
  );
}