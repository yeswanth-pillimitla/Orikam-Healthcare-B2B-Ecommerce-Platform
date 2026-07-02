import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserWishlistTab() {
  const { wishlist, toggleWishlist, addToCart, navigateTo, setSelectedProduct, productsList } = useContext(AppContext);

  // Map wishlist IDs to actual product objects from MongoDB
  const wishlistItems = productsList.filter((p) => wishlist.includes(p._id || p.id));

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigateTo('details');
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product._id || product.id); // remove from wishlist
  };

  return (
    <div className="w-full text-left">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
        <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider font-outfit">
          My Saved Wishlist
        </h2>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          {wishlistItems.length} Saved items
        </span>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {wishlistItems.map((prod) => (
              <motion.div
                key={prod._id || prod.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col justify-between hover:shadow-2xs transition-shadow relative"
              >
                
                {/* Remove button */}
                <button
                  onClick={() => toggleWishlist(prod._id || prod.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white hover:bg-red-50 text-gray-400 hover:text-brand-red flex items-center justify-center border border-gray-100 cursor-pointer shadow-2xs z-10"
                >
                  <FiTrash2 size={11} />
                </button>

                {/* Product click content */}
                <div onClick={() => handleProductClick(prod)} className="cursor-pointer">
                  <div className="w-full aspect-square bg-gray-50/50 rounded-lg flex items-center justify-center p-3 overflow-hidden mb-2">
                    <img 
                      src={(prod.images && prod.images[0]) || prod.image} 
                      alt={prod.name} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply" 
                    />
                  </div>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wide">{prod.brand}</span>
                  <h3 className="text-xs font-bold text-gray-800 line-clamp-1 hover:text-brand-red font-outfit mt-0.5 leading-tight">{prod.name}</h3>
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="text-xs font-black text-gray-900 font-outfit">₹{prod.price.toLocaleString('en-IN')}.00</span>
                    {prod.originalPrice && (
                      <span className="text-[9px] text-gray-400 line-through">₹{prod.originalPrice.toLocaleString('en-IN')}.00</span>
                    )}
                  </div>
                </div>

                {/* Move to cart CTA */}
                <button
                  onClick={() => handleMoveToCart(prod)}
                  className="mt-3 w-full bg-brand-red hover:bg-brand-red-hover text-white py-1.5 rounded-lg text-[10px] font-bold tracking-wide flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <FiShoppingCart size={11} />
                  <span>Move to Cart</span>
                </button>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-gray-50/50 rounded-xl p-8 border border-gray-100/60 text-center flex flex-col items-center justify-center min-h-[250px]">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-brand-red mb-3">
            <FiHeart size={20} />
          </div>
          <h4 className="text-xs font-bold text-gray-800 font-outfit uppercase tracking-wide">Wishlist is Empty</h4>
          <p className="text-[11px] text-gray-400 mt-1 max-w-xs font-medium">Save equipment items to monitor discounts, pricing, or restock status alerts.</p>
          <button
            onClick={() => navigateTo('listing')}
            className="mt-4 bg-brand-red hover:bg-brand-red-hover text-white px-4 py-2 rounded-lg text-[11px] font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
          >
            <span>Browse Products</span>
            <FiArrowRight size={12} />
          </button>
        </div>
      )}

    </div>
  );
}
