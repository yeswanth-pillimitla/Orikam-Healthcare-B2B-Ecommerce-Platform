import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';

export default function CartItem({ item }) {
  const { product, quantity } = item;
  const { updateCartQuantity, removeFromCart, navigateTo, setSelectedProduct } = useContext(AppContext);

  const handleProductClick = () => {
    setSelectedProduct(product);
    navigateTo('details');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-2xs"
    >
      {/* Product Image & Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div 
          onClick={handleProductClick}
          className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-2 shrink-0 cursor-pointer overflow-hidden"
        >
          <img 
            src={(product.images && product.images[0]) || product.image} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain mix-blend-multiply"
          />
        </div>
        
        <div className="text-left min-w-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            {product.brand}
          </span>
          <h3 
            onClick={handleProductClick}
            className="text-xs md:text-sm font-bold text-gray-800 line-clamp-1 hover:text-brand-red cursor-pointer transition-colors font-outfit"
          >
            {product.name}
          </h3>
          <p className="text-[10px] md:text-xs text-brand-red font-bold mt-0.5">
            {product.discount}
          </p>
          <p className="text-xs font-semibold text-gray-500 mt-1 md:hidden">
            ₹{product.price.toLocaleString('en-IN')}.00
          </p>
        </div>
      </div>

      {/* Desktop Price */}
      <div className="hidden md:block text-left w-24 shrink-0">
        <span className="text-xs text-gray-400 line-through block text-[10px]">
          ₹{product.originalPrice?.toLocaleString('en-IN')}.00
        </span>
        <span className="text-sm font-extrabold text-gray-900 font-outfit">
          ₹{product.price.toLocaleString('en-IN')}.00
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-1.5 border border-gray-200 rounded-md p-1 bg-gray-50">
        <button
          onClick={() => updateCartQuantity(product._id || product.id, -1)}
          className="w-5 h-5 rounded hover:bg-white text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
        >
          <FiMinus size={11} />
        </button>
        <span className="text-xs font-bold text-gray-800 w-5 text-center select-none font-outfit">
          {quantity}
        </span>
        <button
          onClick={() => updateCartQuantity(product._id || product.id, 1)}
          className="w-5 h-5 rounded hover:bg-white text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
        >
          <FiPlus size={11} />
        </button>
      </div>

      {/* Subtotal & Delete */}
      <div className="flex items-center gap-4 shrink-0 min-w-[90px] justify-end">
        <div className="text-right">
          <span className="text-xs text-gray-400 block text-[9px] font-bold">TOTAL</span>
          <span className="text-sm font-extrabold text-gray-900 font-outfit">
            ₹{(product.price * quantity).toLocaleString('en-IN')}.00
          </span>
        </div>

        <button
          onClick={() => removeFromCart(product._id || product.id)}
          className="w-8 h-8 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center cursor-pointer transition-all duration-200"
        >
          <FiTrash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}
