import React, { useState } from 'react';

export const FlipCard = ({ frontContent, backContent, className = "" }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flip-card ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="flip-card-front">
          {frontContent}
        </div>
        <div className="flip-card-back">
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
