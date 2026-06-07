// src/pages/WhyUs.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import './AboutUs.css';

// Images removed from process section

const timelineData = [
  {
    period: 'Step 1',
    title: 'Leaf Collection & Selection',
    entries: [
      `Carefully hand-picked fresh leaves from sustainable sources.`,
      `Quality inspection ensures only the finest leaves are selected.`,
      `Leaves are sorted by size, thickness, and quality standards.`,
      `Natural drying process begins to preserve leaf integrity.`,
    ],
  },
  {
    period: 'Step 2',
    title: 'Cleaning & Preparation',
    entries: [
      `Thorough cleaning removes dirt and impurities.`,
      `Gentle washing with natural spring water.`,
      `Careful inspection for any defects or damage.`,
      `Preparation for the molding process begins.`,
    ],
  },
  {
    period: 'Step 3',
    title: 'Molding & Shaping',
    entries: [
      `Leaves are carefully molded into desired shapes.`,
      `Traditional techniques combined with modern precision.`,
      `Each plate is individually crafted for consistency.`,
      `Quality control ensures perfect form and structure.`,
    ],
  },
  {
    period: 'Step 4',
    title: 'Drying & Curing',
    entries: [
      `Natural air-drying process preserves leaf properties.`,
      `Controlled temperature and humidity conditions.`,
      `Curing process enhances durability and strength.`,
      `Final quality inspection before packaging.`,
    ],
  },
  {
    period: 'Step 5',
    title: 'Quality Control & Packaging',
    entries: [
      `Rigorous quality testing for strength and durability.`,
      `Eco-friendly packaging materials used.`,
      `Final inspection ensures product excellence.`,
      `Ready for distribution to customers worldwide.`,
    ],
  },
  {
    period: 'Final',
    title: 'Sustainable & Biodegradable',
    entries: [
      `100% biodegradable and compostable products.`,
      `Zero chemical treatment or harmful additives.`,
      `Perfect for eco-conscious dining experiences.`,
      `Supporting sustainable living and environmental protection.`,
    ],
  },
];

export const WhyUs = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const timelineRefs = useRef([]);

  useEffect(() => {
    const observers = [];
    
    timelineRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleItems(prev => new Set([...prev, index]));
            }
          },
          {
            threshold: 0.3,
            rootMargin: '-20% 0px -20% 0px'
          }
        );
        
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <div className="page-wrapper">
       <div className="section-timeline-heading">
        <div className="container">
          <div className="padding-vertical-xlarge">
            <div className="timeline-main_heading-wrapper">
              <div className="margin-bottom-medium">
                <h2>Why Us ?</h2>
              </div>
              <p className="paragraph-large">
              HaloLeaf is dedicated to revolutionizing sustainable dining with our premium biodegradable leaf plates. We combine traditional craftsmanship with modern quality standards to create eco-friendly alternatives to plastic and paper products.
Our commitment to environmental sustainability drives every aspect of our production process. From carefully selecting the finest leaves to our meticulous manufacturing process, we ensure each product meets the highest standards of quality and environmental responsibility.
Founded with the vision of creating a greener future, HaloLeaf specializes in crafting beautiful, functional, and completely biodegradable leaf plates. Our products are perfect for eco-conscious consumers, restaurants, and events looking to reduce their environmental footprint.
We believe that sustainable living should be beautiful, practical, and accessible to everyone. Every HaloLeaf product represents our commitment to protecting our planet for future generations.

              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="section-timeline-heading">
        <div className="container">
            <div className="timeline-main_heading-wrapper">
              <div className="margin-bottom-medium">
                <h2>Our Legacy </h2>
              </div>
              <p className="paragraph-large">
                Crafting sustainable dining solutions with traditional expertise. <br />
                Discover our meticulous process from leaf selection to your table.
              </p>
            </div>
        </div>
      </div>

      <div className="section-timeline">
        <div className="container">
          <div className="timeline_component">
            <div className="timeline_progress">
              <div className="timeline_progress-bar"></div>
            </div>

            {timelineData.map((item, index) => (
              <div 
                key={index} 
                className="timeline_item"
                ref={el => timelineRefs.current[index] = el}
              >
                <div className="timeline_left">
                  <div className="timeline_date-text">{item.period}</div>
                </div>
                <div className="timeline_centre">
                  <div className="timeline_circle"></div>
                </div>
                <div className={`timeline_right ${visibleItems.has(index) ? 'animate-in' : ''}`}>
                  <div className="margin-bottom-medium">
                    <div className="timeline_text">
                      <strong>{item.title}</strong>
                    </div>
                  </div>
                  
                  <div className="timeline_entries margin-bottom-medium">
                    {item.entries.map((entry, entryIndex) => (
                      <p key={entryIndex} className="timeline_entry">
                        {entry}
                      </p>
                    ))}
                  </div>

                  {index === timelineData.length - 1 && (
                    <div className="margin-bottom-xlarge">
                      <div className="inline-block">
                        <Link to={PATHS.contact} className="timeline_link inline-block">
                          Partner With Us Today
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="overlay-fade-top"></div>
            <div className="overlay-fade-bottom"></div>
          </div>
        </div>
        <div style={{height: '50vh'}}></div>
      </div>
    </div>
  );
};

export default WhyUs;