import React, { useRef, useEffect, useState } from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';

export const TimelineDotScroller = ({ containerRef, items }) => {
  const { scrollY } = useViewportScroll();
  const [positions, setPositions] = useState([]);
  const [containerTop, setContainerTop] = useState(0);

  // Collect the Y-offset of each marker
  useEffect(() => {
    if (!containerRef.current) return;
    
    const markerEls = Array.from(
      containerRef.current.querySelectorAll('.timeline-item .timeline-marker')
    );
    
    if (markerEls.length === 0) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerTopOffset = containerRect.top + window.scrollY;
    setContainerTop(containerTopOffset);
    
    const markerPositions = markerEls.map(el => {
      const rect = el.getBoundingClientRect();
      return rect.top + window.scrollY;
    });
    
    setPositions(markerPositions);
  }, [containerRef, items]);

  // Only create transform if we have valid positions
  const dotY = positions.length > 0 
    ? useTransform(
        scrollY, 
        positions, // input: scroll positions where transitions happen
        positions.map(p => p - containerTop), // output: relative positions within container
        { clamp: false }
      )
    : useTransform(scrollY, [0], [0]); // fallback transform

  // Don't render if no positions yet
  if (positions.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="absolute left-1/2 w-4 h-4 bg-green-500 rounded-full z-10"
      style={{ 
        y: dotY, 
        x: '-50%',
        transformOrigin: 'center'
      }}
    />
  );
};