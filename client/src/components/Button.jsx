import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'danger', 'outline', 'text'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  className = '',
  icon,
}) {
  // Styling base mapping
  const baseStyles = 'inline-flex items-center justify-center font-outfit font-bold rounded-lg transition-colors cursor-pointer select-none';
  
  const variants = {
    primary: 'bg-brand-red text-white hover:bg-brand-red-hover active:bg-red-800 shadow-2xs border border-transparent',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-2xs border border-transparent',
    outline: 'bg-transparent text-gray-700 hover:bg-gray-50 border border-gray-300',
    text: 'bg-transparent text-brand-red hover:text-brand-red-hover p-0'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${disabled ? disabledStyles : ''} 
        ${className}
      `}
    >
      {icon && <span className="mr-1.5 shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
