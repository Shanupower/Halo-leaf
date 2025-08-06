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
            Our vision
          </h2>
        </div>
        
        <p className="text-sm md:text-base text-gray-700 max-w-xl md:max-w-2xl mx-auto leading-relaxed px-4" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '300', fontStyle: 'italic'}}>
          To transform agriculture into a regenerative, bio-driven ecosystem—where every farm thrives, soils heal, and communities flourish.
        </p>
      </div>

      {/* Missions Section */}
      <div className="text-center mb-8 md:mb-16 relative z-10">
        {/* Title with line through */}
        <div className="relative mb-6 md:mb-12 flex justify-center">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 transform -translate-y-1/2 z-0"></div>
          <h2 className="relative bg-white px-4 md:px-8 text-4xl md:text-7xl lg:text-8xl text-gray-300 tracking-[0.2em] md:tracking-[0.3em] z-10" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '100'}}>
            Our missions
          </h2>
        </div>

        <p className="text-base md:text-lg text-gray-600 max-w-2xl md:max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed px-4" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '400'}}>
          We are dedicated to pioneering sustainable bio-technologies and empowering farmers with science-backed solutions. Through relentless innovation, hands-on collaboration, and global partnerships, we aim to drive yield improvements, restore soil health, and build a greener future for all.
        </p>

        {/* Interactive Circles */}
        <div className="flex flex-row items-center justify-center gap-4 md:gap-8 flex-wrap md:flex-nowrap">
          {/* Left Circle */}
          <div 
            className="relative group cursor-pointer flex-shrink-0"
            onMouseEnter={() => setHoveredCircle('left')}
            onMouseLeave={() => setHoveredCircle(null)}
          >
            <div className={`w-56 h-56 md:w-67 md:h-67 rounded-full border border-gray-300 flex items-center justify-center text-center p-6 transition-all duration-500 ease-in-out ${hoveredCircle === 'left' ? 'text-white border-[#5ab334] transform scale-110' : 'bg-white text-gray-700'}`} style={hoveredCircle === 'left' ? {backgroundColor: '#5ab33480'} : {}}>
              {hoveredCircle === 'left' ? (
                <div className="text-sm leading-tight" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '400'}}>
                  <div>Develop cutting-edge microbial formulations that replace harmful chemicals and boost crop productivity</div>
                </div>
              ) : (
                <div className="text-lg leading-tight" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '600'}}>
                  Innovate with Impact
                </div>
              )}
            </div>
          </div>

          {/* Center Circle */}
          <div 
            className="relative group cursor-pointer flex-shrink-0"
            onMouseEnter={() => setHoveredCircle('center')}
            onMouseLeave={() => setHoveredCircle(null)}
          >
            <div className={`w-56 h-56 md:w-67 md:h-67 rounded-full border border-gray-300 flex items-center justify-center text-center p-6 transition-all duration-500 ease-in-out ${hoveredCircle === 'center' ? 'text-white border-[#5ab334] transform scale-110' : 'bg-white text-gray-700'}`} style={hoveredCircle === 'center' ? {backgroundColor: '#5ab33480'} : {}}>
              {hoveredCircle === 'center' ? (
                <div className="text-sm leading-tight" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '400'}}>
                  <div>Provide agronomic guidance and tailored bio-solutions that deliver measurable on-field results</div>
                </div>
              ) : (
                <div className="text-lg leading-tight" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '600'}}>
                  Empower Farmers
                </div>
              )}
            </div>
          </div>

          {/* Right Circle - Default Blue */}
          <div 
            className="relative group cursor-pointer flex-shrink-0"
            onMouseEnter={() => setHoveredCircle('right')}
            onMouseLeave={() => setHoveredCircle(null)}
          >
            <div className={`w-56 h-56 md:w-67 md:h-67 rounded-full border border-gray-300 flex items-center justify-center text-center p-6 transition-all duration-500 ease-in-out ${hoveredCircle === 'right' ? 'text-white border-[#5ab334] transform scale-110' : 'bg-white text-gray-700 border-gray-300'}`} style={hoveredCircle === 'right' ? {backgroundColor: '#5ab33480'} : {}}>
              {hoveredCircle === 'right' ? (
                <div className="text-sm leading-tight" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '400'}}>
                  <div>Forge strategic partnerships with research institutes and agri-tech leaders to push the boundaries of sustainable agriculture</div>
                </div>
              ) : (
                <div className="text-lg leading-tight" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '600'}}>
                  Collaborate Globally
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