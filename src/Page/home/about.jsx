import React, { useState } from 'react';

export const About = () => {
  const [hoveredCircle, setHoveredCircle] = useState(null);

  return (
    <div className="py-8 md:py-16 px-4 md:px-8 max-w-6xl mx-auto relative">
      {/* Vertical connecting lines - broken into segments */}
      {/* Line segment 1: Above "Our vision" */}
      <div className="absolute left-1/2 top-4 md:top-8 w-px bg-gray-300 transform -translate-x-1/2 z-0 h-8 md:h-16"></div>
      
      {/* Line segment 2: Between vision and missions */}
      <div className="absolute left-1/2 top-48 md:top-72 w-px bg-gray-300 transform -translate-x-1/2 z-0 h-12 md:h-24"></div>
      
      {/* Line segment 3: Above "Our missions" */}
      <div className="absolute left-1/2 top-64 md:top-108 w-px bg-gray-300 transform -translate-x-1/2 z-0 h-8 md:h-16"></div>
      
      {/* Line segment 4: After the circles */}
      <div className="absolute left-1/2 bottom-4 md:bottom-8 w-px bg-gray-300 transform -translate-x-1/2 z-0 h-8 md:h-16"></div>

      {/* Vision Section */}
      <div className="text-center mb-12 md:mb-20 relative z-10">
        {/* Title with line through */}
        <div className="relative mb-4 md:mb-8">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 transform -translate-y-1/2"></div>
          <h2 className="relative inline-block bg-white px-4 md:px-8 text-4xl md:text-7xl lg:text-8xl text-gray-300 tracking-[0.2em] md:tracking-[0.3em]" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '100'}}>
            Our Vision
          </h2>
        </div>
        
        <p className="text-[1rem] md:text-[1.4rem] md:text-base text-gray-700 max-w-3xl md:max-w-2xl mx-auto leading-relaxed px-3" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '700', fontStyle: 'italic'}}>
        To Break through the Barriers of Science and <br /> Develop Cutting-Edge Biological Solutions For The World
    </p>
      </div>

      {/* Missions Section */}
      <div className="text-center mb-8 md:mb-16 relative z-10">
        {/* Title with line through */}
        <div className="relative mb-6 md:mb-12 flex justify-center">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 transform -translate-y-1/2 z-0"></div>
          <h2 className="relative bg-white px-4 md:px-8 text-4xl md:text-7xl lg:text-8xl text-gray-300 tracking-[0.2em] md:tracking-[0.3em] z-10" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '100'}}>
            Our Mission
          </h2>
        </div>

        <p className="text-base md:text-lg text-gray-600 max-w-2xl md:max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed px-4" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '400'}}>
        Advance sustainable agriculture with research-backed Biologicals that Protect Soil, Boost Yields, and Deliver Clean Food—today and long into the future.
        </p>

        <div className="flex items-center justify-center flex-wrap md:flex-nowrap relative mt-10">
  {/* Left Circle */}
  <div 
    className="z-30 relative group cursor-pointer flex-shrink-0"
    onMouseEnter={() => setHoveredCircle('left')}
    onMouseLeave={() => setHoveredCircle(null)}
  >
    <div className={`w-56 h-56 md:w-67 md:h-67 rounded-full border border-gray-300 flex items-center justify-center text-center p-6 transition-all duration-500 ease-in-out ${hoveredCircle === 'left' ? 'text-white border-[#5ab334] transform scale-110' : ' text-gray-700'}`} style={hoveredCircle === 'left' ? {backgroundColor: '#5ab33480'} : {}}>
      {hoveredCircle === 'left' ? (
        <div className="text-sm leading-tight font-normal font-inter" style={{fontWeight: '600'}}>
          Develop cutting-edge microbial formulations that promote sustainable agriculture while boosting crop productivity
        </div>
      ) : (
        <div className="text-lg leading-tight font-semibold font-inter">
          Innovate with Impact
        </div>
      )}
    </div>
  </div>

  {/* Center Circle - overlapping left */}
  <div
  className="-ml-5 z-1 relative group cursor-pointer flex-shrink-0"
  onMouseEnter={() => setHoveredCircle('center')}
  onMouseLeave={() => setHoveredCircle(null)}
>
  <div
    className={`w-56 h-56 md:w-67 md:h-67 rounded-full border flex items-center justify-center text-center p-6 transition-all duration-500 ease-in-out transform ${
      hoveredCircle === 'center'
        ? 'bg-white text-[#f9731699] scale-110'
        : 'bg-[#f9731699] text-white'
    }`}
  
  >
    {hoveredCircle === 'center' ? (
      <div className="text-sm leading-tight font-normal font-inter" style={{fontWeight: '600'}}>
        Provide agronomic guidance and tailored bio-solutions that deliver measurable on-field results
      </div>
    ) : (
      <div className="text-lg leading-tight font-semibold font-inter">
        Empower Farmers
      </div>
    )}
  </div>
</div>

  {/* Right Circle - overlapping center */}
  <div 
    className="-ml-5 z-1 relative group cursor-pointer flex-shrink-0"
    onMouseEnter={() => setHoveredCircle('right')}
    onMouseLeave={() => setHoveredCircle(null)}
  >
    <div className={`w-56 h-56 md:w-67 md:h-67 rounded-full border border-gray-300 flex items-center justify-center text-center p-6 transition-all duration-500 ease-in-out ${hoveredCircle === 'right' ? 'text-white border-[#5ab334] transform scale-110' : ' text-gray-700'}`} style={hoveredCircle === 'right' ? {backgroundColor: '#5ab33480'} : {}}>
      {hoveredCircle === 'right' ? (
        <div className="text-sm leading-tight font-normal font-inter" style={{fontWeight: '600'}}>
          Forge strategic partnerships with Innovators, Companies and Distributors worldwide to cater to the growing agri-biological sector
        </div>
      ) : (
        <div className="text-lg leading-tight font-semibold font-inter">
          Distribute Globally
        </div>
      )}
    </div>
  </div>

        </div>
      </div>
    </div>
  );
};

export default About;