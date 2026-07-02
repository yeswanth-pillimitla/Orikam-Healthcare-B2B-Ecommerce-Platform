import React from 'react';
import { motion } from 'framer-motion';

export default function BrandCard({ brand, onClick }) {
  const { name, logo } = brand;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2, shadow: '0 4px 10px rgba(0,0,0,0.03)' }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg p-2.5 flex flex-col items-center justify-center min-h-[58px] md:min-h-[66px] cursor-pointer group border border-gray-100 transition-all"
    >
      <div className="flex-1 flex items-center justify-center w-full scale-80 md:scale-90">
        {logo}
      </div>
      <span className="text-[8px] md:text-[9px] text-gray-400 group-hover:text-gray-600 transition-colors uppercase tracking-wider font-semibold font-outfit mt-1">
        {name}
      </span>
    </motion.div>
  );
}
