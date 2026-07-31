import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';

export default function FeaturedCategories() {
  const { selectCategoryAndBrowse, navigateTo, setSelectedCategory, setSelectedBrand, setSearchQuery, categories } = useContext(AppContext);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colors = [
    { bg: 'bg-red-50/70', text: 'text-red-900' },
    { bg: 'bg-blue-50/70', text: 'text-blue-900' },
    { bg: 'bg-amber-50/70', text: 'text-amber-900' },
    { bg: 'bg-emerald-50/70', text: 'text-emerald-900' },
    { bg: 'bg-purple-50/70', text: 'text-purple-900' },
    { bg: 'bg-pink-50/70', text: 'text-pink-900' },
    { bg: 'bg-teal-50/70', text: 'text-teal-900' },
    { bg: 'bg-orange-50/70', text: 'text-orange-900' },
  ];

  const displayCategories = categories.map((cat, idx) => {
    const color = colors[idx % colors.length];
    let imageSrc = cat.image;
    if (cat.name.toLowerCase().includes('polisher') || cat.name.toLowerCase().includes('scaler')) {
      imageSrc = '/assets/category_scaler.png';
    }
    return {
      name: cat.name,
      image: imageSrc,
      items: `${cat.productCount} items`,
      bgColor: color.bg,
      textColor: color.text
    };
  });

  const handleViewAllCategories = (e) => {
    e.preventDefault();
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchQuery('');
    navigateTo('listing');
  };

  // Responsive visible count
  let visibleCount = 5;
  if (windowWidth < 640) visibleCount = 1;
  else if (windowWidth < 1024) visibleCount = 3;
  else if (windowWidth < 1280) visibleCount = 4;

  const maxIndex = Math.max(0, displayCategories.length - visibleCount);

  const handleNext = () => {
    setScrollIndex(prev => Math.min(prev + visibleCount, maxIndex));
  };

  const handlePrev = () => {
    setScrollIndex(prev => Math.max(prev - visibleCount, 0));
  };

  return (
    <section className="w-full px-4 md:px-6 py-2.5">
      <div className="max-w-[1440px] mx-auto bg-white rounded-2xl p-5 shadow-xs relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold font-outfit text-gray-900 tracking-tight">
            Featured Categories
          </h2>
          <a 
            href="#" 
            onClick={handleViewAllCategories}
            className="text-xs md:text-sm font-semibold text-brand-red hover:text-brand-red-hover flex items-center gap-1 transition-colors"
          >
            View All Categories <span className="text-xs">→</span>
          </a>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full py-2">
          
          {/* Left Arrow Button */}
          <AnimatePresence>
            {scrollIndex > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handlePrev}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-600 active:scale-95 transition-transform"
              >
                <FiChevronLeft size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Right Arrow Button */}
          <AnimatePresence>
            {scrollIndex < maxIndex && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleNext}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-600 active:scale-95 transition-transform"
              >
                <FiChevronRight size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Slidable Categories Wrapper */}
          <div className="w-full overflow-hidden">
            <motion.div
              animate={{ x: -scrollIndex * (230 + 12) }} // Card width (230) + gap (12)
              transition={{ type: 'spring', stiffness: 180, damping: 24 }}
              className="flex gap-3 w-max"
            >
              {displayCategories.map((cat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2, scale: 1.02 }}
                  onClick={() => selectCategoryAndBrowse(cat.name)}
                  className={`${cat.bgColor} rounded-xl p-3.5 flex items-center gap-3 cursor-pointer group transition-all duration-200 w-[230px] shrink-0`}
                >
                  {/* Real Product Image Container */}
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-2xs shrink-0 p-1">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-contain mix-blend-multiply" 
                    />
                  </div>
                  
                  {/* Text details */}
                  <div className="text-left leading-none">
                    <h3 className={`text-xs md:text-sm font-extrabold font-outfit ${cat.textColor} leading-tight`}>
                      {cat.name}
                    </h3>
                    <span className="text-[10px] md:text-xs text-gray-500 font-bold mt-1 block">
                      {cat.items}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
