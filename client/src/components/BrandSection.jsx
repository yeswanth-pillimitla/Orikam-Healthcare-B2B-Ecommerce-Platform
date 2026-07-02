import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';

// Pixel-perfect SVG logos for top dental brands
const WaldentLogo = () => (
  <svg className="w-16 h-8 text-[#0056b3]" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 5L28 32L40 14L52 32L70 5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M75 32H90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M78 22H87" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M80 12H85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const ManiLogo = () => (
  <svg className="w-16 h-8 text-black" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="5" y="30" fontFamily="'Impact', 'Arial Black', sans-serif" fontSize="28" fontStyle="italic" fontWeight="900" fill="currentColor">
      MANI
    </text>
    <circle cx="82" cy="27" r="4" fill="#d92d20" />
  </svg>
);

const SuperEndoLogo = () => (
  <svg className="w-20 h-8" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="96" height="28" rx="4" fill="#12b76a" />
    <text x="50" y="21" fontFamily="sans-serif" fontSize="10" fontWeight="900" fill="white" textAnchor="middle">
      Super
    </text>
    <text x="50" y="30" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">
      Endo
    </text>
  </svg>
);

const DentsplyLogo = () => (
  <svg className="w-16 h-8 text-black" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="28" fontFamily="'Georgia', serif" fontSize="22" fontWeight="bold" letterSpacing="0.5" fill="currentColor">
      Dentsply
    </text>
  </svg>
);

const EndokingLogo = () => (
  <svg className="w-18 h-8 text-[#0284c7]" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="26" fontFamily="'Brush Script MT', 'Dancing Script', cursive, sans-serif" fontSize="22" fontStyle="italic" fill="currentColor">
      Endoking
    </text>
  </svg>
);

const NskLogo = () => (
  <svg className="w-16 h-8 text-[#002f6c]" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="28" fontFamily="'Arial Black', sans-serif" fontSize="26" fontWeight="900" fontStyle="italic" letterSpacing="-1" fill="currentColor">
      NSK
    </text>
  </svg>
);

const WoodpeckerLogo = () => (
  <svg className="w-20 h-8" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C12 12 17 8 20 14C23 20 20 28 20 28L15 24L10 28C10 28 8 22 10 18C12 14 12 12 12 12Z" fill="#ef4444" />
    <path d="M15 6L25 15L23 17L15 6Z" fill="#ef4444" />
    <text x="35" y="26" fontFamily="'Arial Black', sans-serif" fontSize="12" fontWeight="900" fill="#ef4444" letterSpacing="1">
      WOODPECKER
    </text>
  </svg>
);

const ThreeMLogo = () => (
  <svg className="w-20 h-8" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="5" y="28" fontFamily="'Arial Black', sans-serif" fontSize="26" fontWeight="900" fill="#ff0000" letterSpacing="-1.5">
      3M
    </text>
    <text x="52" y="25" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#64748b">
      ESPE
    </text>
  </svg>
);

const OrthoLogo = () => (
  <svg className="w-16 h-8 text-[#7c3aed]" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="20" r="13" fill="currentColor" />
    <text x="50" y="25" fontFamily="sans-serif" fontSize="15" fontWeight="bold" fill="white" textAnchor="middle">
      O
    </text>
  </svg>
);

const AvdecLogo = () => (
  <svg className="w-16 h-8 text-[#0284c7]" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="28" fontFamily="'Trebuchet MS', sans-serif" fontSize="24" fontStyle="italic" fontWeight="bold" fill="currentColor">
      a-dec
    </text>
  </svg>
);

const logoLookup = {
  'Waldent': <WaldentLogo />,
  'MANI': <ManiLogo />,
  'Super Endo': <SuperEndoLogo />,
  'Dentsply': <DentsplyLogo />,
  'Endoking': <EndokingLogo />,
  'NSK': <NskLogo />,
  'Woodpecker': <WoodpeckerLogo />,
  '3M ESPE': <ThreeMLogo />,
  'Ortho': <OrthoLogo />,
  'avdec': <AvdecLogo />
};

export default function BrandSection() {
  const { selectBrandAndBrowse, navigateTo, setSelectedCategory, setSelectedBrand, setSearchQuery, brands } = useContext(AppContext);

  const displayBrands = brands.map(b => ({
    name: b.name,
    logo: logoLookup[b.name] || <WaldentLogo />
  }));

  const handleViewAllBrands = (e) => {
    e.preventDefault();
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchQuery('');
    navigateTo('listing');
  };

  return (
    <section className="w-full px-4 md:px-6 py-2.5">
      <div className="max-w-[1440px] mx-auto bg-white rounded-2xl p-5 shadow-xs">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold font-outfit text-gray-900 tracking-tight">
            Shop by Top Brand
          </h2>
          <a 
            href="#" 
            onClick={handleViewAllBrands}
            className="text-xs md:text-sm font-semibold text-brand-red hover:text-brand-red-hover flex items-center gap-1 transition-colors"
          >
            View All Brands <span className="text-xs">→</span>
          </a>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {displayBrands.map((brand, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2, shadow: '0 4px 10px rgba(0,0,0,0.03)' }}
              onClick={() => selectBrandAndBrowse(brand.name)}
              className="bg-white rounded-xl p-3 flex flex-col items-center justify-center min-h-[85px] md:min-h-[100px] cursor-pointer group border border-gray-100 transition-all"
            >
              <div className="flex-1 flex items-center justify-center w-full scale-105 md:scale-115">
                {brand.logo}
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 group-hover:text-gray-600 transition-colors uppercase tracking-wider font-semibold font-outfit mt-2">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
