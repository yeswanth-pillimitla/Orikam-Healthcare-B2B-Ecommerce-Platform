import React from 'react';
import { motion } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';

export default function CategoryCard({ category, onClick }) {
  const { name, items, image, bgColor, textColor } = category;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${bgColor || 'bg-gray-50'} rounded-lg p-2.5 flex items-center justify-between cursor-pointer group transition-all duration-200 shadow-2xs`}
    >
      <div className="flex items-center gap-2">
        {/* Product Image Container */}
        <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center shadow-2xs shrink-0 p-0.5">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-contain mix-blend-multiply" 
          />
        </div>
        
        {/* Text Details */}
        <div className="text-left leading-none">
          <h3 className={`text-[11px] font-bold font-outfit ${textColor || 'text-gray-800'} leading-tight`}>
            {name}
          </h3>
          <span className="text-[9px] text-gray-500 font-semibold mt-0.5 block">
            {items || '0 items'}
          </span>
        </div>
      </div>

      {/* Arrow Circle Button */}
      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-2xs text-gray-400 group-hover:text-gray-950 transition-colors shrink-0">
        <FiChevronRight size={10} />
      </div>
    </motion.div>
  );
}
