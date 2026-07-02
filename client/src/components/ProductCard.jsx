import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';

export default function ProductCard({ product }) {
  const id = product._id || product.id;
  const { name, price, originalPrice, discount, brand } = product;
  const image = (product.images && product.images[0]) || product.image;
  const { addToCart, wishlist, toggleWishlist, navigateTo, setSelectedProduct } = useContext(AppContext);

  const isWishlisted = wishlist.includes(id);

  const handleCardClick = () => {
    setSelectedProduct(product);
    navigateTo('details');
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(id);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <motion.div
      whileHover={{ y: -6, shadow: '0 12px 24px -10px rgba(0, 0, 0, 0.08)' }}
      onClick={handleCardClick}
      className="bg-white rounded-2xl p-4.5 flex flex-col justify-between cursor-pointer group transition-all duration-300 relative border border-gray-100/60 shadow-xs"
    >

      {/* Product Image Container */}
      <div className="w-full aspect-square bg-gray-50/50 rounded-2xl flex items-center justify-center overflow-hidden mb-4.5 p-4.5 relative">
        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.3 }}
          src={image}
          alt={name}
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 left-3 bg-red-50 text-brand-red text-[10px] md:text-xs font-extrabold px-2.5 py-1 rounded uppercase tracking-wide">
            {discount}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-2xs transition-colors cursor-pointer ${
            isWishlisted ? 'bg-red-50 text-brand-red' : 'bg-white text-gray-400 hover:text-brand-red'
          }`}
        >
          <FiHeart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Details */}
      <div className="text-left flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-wide">
            {brand}
          </span>
          <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-brand-red transition-colors mb-1.5 font-outfit">
            {name}
          </h3>
        </div>

        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="flex flex-col text-left">
            <span className="text-sm md:text-base font-extrabold text-gray-900 font-outfit">
              ₹{price.toLocaleString('en-IN')}.00
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              {originalPrice && (
                <span className="text-[11px] md:text-xs text-gray-400 line-through font-semibold">
                  ₹{originalPrice.toLocaleString('en-IN')}.00
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart circular button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCartClick}
            className="w-9 h-9 rounded-full bg-red-50 hover:bg-brand-red text-brand-red hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer shrink-0"
          >
            <FiShoppingCart size={15} />
          </motion.button>
        </div>
      </div>

    </motion.div>
  );
}
