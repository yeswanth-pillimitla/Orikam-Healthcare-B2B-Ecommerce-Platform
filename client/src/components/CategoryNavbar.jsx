import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';

export default function CategoryNavbar() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { selectCategoryAndBrowse, navigateTo, setSelectedCategory, setSelectedBrand, setSearchQuery, categories } = useContext(AppContext);

  const dropdownItems = categories.length > 0 
    ? categories.map(c => c.name)
    : [
        "Dental Chair",
        "Composite",
        "Handpieces",
        "Endodontics",
        "Imaging",
        "Surgical",
        "Orthodontics",
        "X-Ray",
        "Polishers",
        "Diagnostics"
      ];

  const displayCategories = categories.map((cat, idx) => ({
    ...cat,
    hasDropdown: idx > 2 // Mimics original dropdown configuration dynamically
  }));

  const handleViewAll = (e) => {
    e.preventDefault();
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchQuery('');
    navigateTo('listing');
  };

  return (
    <section className="w-full px-4 md:px-6 py-2.5 relative">
      <div 
        className="max-w-[1440px] mx-auto bg-white rounded-2xl p-5 shadow-xs relative"
        onMouseLeave={() => setHoveredCategory(null)}
      >
        {/* Title Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold font-outfit text-gray-900 tracking-tight">
            Shop by Categories
          </h2>
          <a 
            href="#" 
            onClick={handleViewAll}
            className="text-xs md:text-sm font-semibold text-brand-red hover:text-brand-red-hover flex items-center gap-1 transition-colors"
          >
            View All <span className="text-xs">→</span>
          </a>
        </div>

        {/* Categories Row */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-2 relative">
          {displayCategories.map((cat, idx) => (
            <div
              key={idx}
              className="relative"
              onMouseEnter={() => {
                if (cat.hasDropdown) {
                  setHoveredCategory(cat.name);
                } else {
                  setHoveredCategory(null);
                }
              }}
            >
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                onClick={() => selectCategoryAndBrowse(cat.name)}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer text-center group w-24"
              >
                {/* Image Container */}
                <div className="mb-2 transition-transform duration-200 group-hover:scale-105 rounded-2xl overflow-hidden relative bg-gray-50/50 p-2.5">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-contain mix-blend-multiply" 
                    />
                  </div>
                </div>
                
                {/* Category Text Label */}
                <div className="flex items-center gap-1 mt-1 justify-center">
                  <span className="text-xs md:text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors whitespace-nowrap">
                    {cat.name}
                  </span>
                  {cat.hasDropdown && (
                    <FiChevronDown size={12} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Floating Interactive Category Dropdown Menu */}
        <AnimatePresence>
          {hoveredCategory && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-1/2 -translate-x-1/2 top-[90%] mt-2 bg-white rounded-xl shadow-lg z-50 p-4 min-w-[340px] flex gap-8 text-left"
              onMouseEnter={() => setHoveredCategory(hoveredCategory)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Column 1 */}
              <div className="flex flex-col gap-1 w-1/2">
                {dropdownItems.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectCategoryAndBrowse(item)}
                    className="px-2 py-1.5 rounded-md text-[11px] font-bold cursor-pointer transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-1 w-1/2 pl-4">
                {dropdownItems.slice(4).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectCategoryAndBrowse(item)}
                    className="px-2 py-1.5 rounded-md text-[11px] font-bold cursor-pointer transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
