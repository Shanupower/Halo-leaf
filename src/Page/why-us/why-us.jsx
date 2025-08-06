// src/pages/WhyUs.jsx
import React, { useEffect, useRef, useState } from 'react';
import './AboutUs.css';

// Import your images
import img2003 from '../../assets/Aboutus/2003-2008.jpg';
import img2009 from '../../assets/Aboutus/2009-2012.jpg';
import img2013 from '../../assets/Aboutus/2013-2016.jpg';
import img2017 from '../../assets/Aboutus/2017-2021.jpg';
import imgToday from '../../assets/Aboutus/today.jpg';

const timelineData = [
  {
    period: '2003–2008',
    title: 'Laying the Scientific Foundations',
    image: img2003,
    entries: [
      `2003: Small team of microbiologists and agronomists unite to develop eco-friendly bio-inputs.`,
      `2006: First major research partnership with Tamil Nadu Agricultural University on nitrogen-fixing strains.`,
      `2007: Collaboration with ICFAI Centre for Biosciences on microbial formulation.`,
      `2008: MOU with Indian Institute of Oilseeds Research and accreditation from Dun & Bradstreet.`,
    ],
  },
  {
    period: '2009–2012',
    title: 'Building Quality and Research Networks',
    image: img2009,
    entries: [
      `2009: ISO 9001:2008 certification; recognition by Indian Institute of Horticultural Research (IIHR).`,
      `2010: MOU with IIHR to trial horticultural bio-inputs.`,
      `2011: Joint studies with Loyola Academy on formulation stability.`,
      `2012: Collaborative research with KL University on crop-specific microbial blends.`,
    ],
  },
  {
    period: '2013–2016',
    title: 'Establishing In-House Excellence',
    image: img2013,
    entries: [
      `2013: DSIR recognition of our Hyderabad labs as an In-House R&D Centre.`,
      `2014: Partnership with Agri-Biotech Foundation at VIT for next-gen seed coating technologies.`,
      `2015: Collaboration with Tea Research Association on microbe-mediated stress tolerance.`,
      `2016: Work with Institute of Forest Genetics & Tree Breeding on bio-solutions for tree crops.`,
    ],
  },
  {
    period: '2017–2021',
    title: 'Certification, Awards & Global Reach',
    image: img2017,
    entries: [
      `2017: Ecocert Organic Certification and MOU with Assam Agricultural University.`,
      `2018: Collaboration with Prof. Jayashankar Telangana State Agricultural University.`,
      `2019: Launched India's first indigenous Bt biopesticide; Best R&D Product Development award.`,
      `2020: National Award for Excellence in R&D.`,
      `2021: Field trials with ICRISAT, taking our research global.`,
    ],
  },
  {
    period: 'Today',
    title: 'Leading the Bio-Ag Revolution',
    image: imgToday,
    entries: [
      `Serving thousands of farmers across India and partnering with global institutes.`,
      `Portfolio of nine product categories, powered by ongoing R&D, state-of-the-art manufacturing, and sustainability.`,
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
                <h2>Our Journey</h2>
              </div>
              <p className="paragraph-large">
                Over two decades of pioneering bio-agriculture innovation. <br />
                Discover our journey from research to revolutionizing sustainable farming.
              </p>
            </div>
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

                  {item.image && (
                    <div className="timeline_image-wrapper margin-bottom-medium">
                      <img 
                        src={item.image} 
                        loading="lazy" 
                        width="480" 
                        alt={item.title}
                      />
                    </div>
                  )}

                  {index === timelineData.length - 1 && (
                    <div className="margin-bottom-xlarge">
                      <div className="inline-block">
                        <a href="#contact" className="timeline_link inline-block">
                          Partner With Us Today
                        </a>
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