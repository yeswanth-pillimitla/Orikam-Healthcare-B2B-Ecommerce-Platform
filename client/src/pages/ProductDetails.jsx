import React, { useContext, useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryNavbar from '../components/CategoryNavbar';
import ProductCard from '../components/ProductCard';
import { AppContext } from '../context/AppContext';
import { FiMinus, FiPlus, FiShoppingCart, FiHeart, FiCheck, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ProductDetails() {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    navigateTo,
    productsList
  } = useContext(AppContext);

  // If no product is selected, fallback to the first product
  const product = selectedProduct || productsList[0];

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading product details...</p>
      </div>
    );
  }
  
  const id = product._id || product.id;
  const { name, brand, category, price, originalPrice, discount, rating, description, specifications, reviews } = product;
  const image = (product.images && product.images[0]) || product.image;
  const inStock = product.stock > 0;
  const stockCount = product.stock;
  const reviewsCount = reviews?.length || 0;

  const [activeImg, setActiveImg] = useState(image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description'); // 'Description' | 'Specifications' | 'Reviews'

  // Reset states when the product changes
  useEffect(() => {
    setActiveImg(image);
    setQuantity(1);
    setActiveTab('Description');
  }, [product, image]);

  const isWishlisted = wishlist.includes(id);

  // Mock list of alternate images/thumbnails
  const thumbnails = product.images || [image];

  const handleQtyChange = (amount) => {
    const nextQty = quantity + amount;
    if (nextQty >= 1 && nextQty <= (stockCount || 10)) {
      setQuantity(nextQty);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigateTo('checkout');
  };

  // Find similar products in the same category (excluding current)
  const similarProducts = productsList
    .filter((p) => p.category === category && (p._id || p.id) !== id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans gap-2 text-left">
      <Header />
      
      <main className="flex-1 flex flex-col gap-2 pb-2">
        <CategoryNavbar />

        {/* Breadcrumbs */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto bg-white rounded-xl p-3 shadow-2xs">
            <nav className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span onClick={() => navigateTo('home')} className="hover:text-brand-red cursor-pointer">Home</span>
              <span>/</span>
              <span onClick={() => {
                // filter listing by this category
                setSelectedProduct(null);
                navigateTo('listing');
              }} className="hover:text-brand-red cursor-pointer">{category}</span>
              <span>/</span>
              <span className="text-gray-600 truncate max-w-[200px] md:max-w-none">{name}</span>
            </nav>
          </div>
        </section>

        {/* Main Product Sheet */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto bg-white rounded-xl p-4 md:p-6 shadow-2xs border border-gray-100/60">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Image Gallery */}
              <div className="flex flex-col gap-4">
                
                {/* Large Display Image */}
                <div className="w-full aspect-square bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
                  <motion.img 
                    key={activeImg}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={activeImg} 
                    alt={name} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply" 
                  />
                  
                  {/* Discount overlay */}
                  {discount && (
                    <span className="absolute top-4 left-4 bg-brand-red text-white text-[10px] font-extrabold px-2.5 py-1 rounded-sm uppercase tracking-wide">
                      {discount}
                    </span>
                  )}

                  {/* Wishlist overlay button */}
                  <button
                    onClick={() => toggleWishlist(id)}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-colors ${
                      isWishlisted ? 'bg-red-50 text-brand-red' : 'bg-white text-gray-400 hover:text-brand-red'
                    }`}
                  >
                    <FiHeart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Thumbnails strip */}
                <div className="flex items-center gap-3">
                  {thumbnails.map((thumb, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImg(thumb)}
                      className={`w-16 h-16 bg-gray-50 border-2 rounded-xl flex items-center justify-center p-2 cursor-pointer transition-all ${
                        activeImg === thumb ? 'border-brand-red shadow-sm' : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={thumb} 
                        alt={`Thumbnail ${idx}`} 
                        className="max-h-full max-w-full object-contain mix-blend-multiply" 
                      />
                    </div>
                  ))}
                </div>

              </div>

              {/* Right Column: Checkout Info panel */}
              <div className="flex flex-col text-left">
                
                {/* Brand name */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">
                  {brand}
                </span>
                
                {/* Product Title */}
                <h1 className="text-lg md:text-2xl font-bold text-gray-800 tracking-tight leading-tight mt-1.5 mb-2 font-outfit">
                  {name}
                </h1>

                {/* Review summary info */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-amber-400 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < Math.floor(rating) ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-700 font-outfit">{rating} / 5.0</span>
                  <span className="text-xs text-gray-400 font-semibold">({reviewsCount || 0} Professional Reviews)</span>
                </div>

                {/* Pricing panel */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/60 mb-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit">
                      ₹{price.toLocaleString('en-IN')}.00
                    </span>
                    {originalPrice && (
                      <span className="text-sm text-gray-400 line-through font-semibold">
                        ₹{originalPrice.toLocaleString('en-IN')}.00
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-red-50 text-brand-red text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                      {discount || 'SPECIAL OFFER'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-0.5">
                      <FiInfo size={11} /> Excl. 18% GST (Calculated at checkout)
                    </span>
                  </div>
                </div>

                {/* Availability status */}
                <div className="mb-5 flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Availability:</span>
                  {inStock ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      <FiCheck size={12} /> In Stock ({stockCount} Units Available)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Product configuration / Quantity selector */}
                {inStock && (
                  <div className="mb-6 flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Quantity</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                        <button
                          onClick={() => handleQtyChange(-1)}
                          disabled={quantity <= 1}
                          className="w-8 h-8 rounded-md bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                        >
                          <FiMinus size={13} />
                        </button>
                        <span className="text-sm font-extrabold text-gray-800 w-10 text-center font-outfit select-none">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(1)}
                          disabled={quantity >= (stockCount || 10)}
                          className="w-8 h-8 rounded-md bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                        >
                          <FiPlus size={13} />
                        </button>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">
                        Maximum limit {stockCount} per clinical order
                      </span>
                    </div>
                  </div>
                )}

                {/* CTA Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-outfit font-bold rounded-lg px-6 py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiShoppingCart size={14} />
                    <span>Add To Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!inStock}
                    className="flex-1 bg-brand-red hover:bg-brand-red-hover text-white font-outfit font-bold rounded-lg px-6 py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Technical spec sheets, description, reviews tab list */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto bg-white rounded-xl shadow-2xs border border-gray-100/60 overflow-hidden">
            
            {/* Tab Headers */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              {['Description', 'Specifications', 'Reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-xs font-bold uppercase tracking-wider font-outfit cursor-pointer border-b-2 transition-all ${
                    activeTab === tab 
                      ? 'border-brand-red text-brand-red bg-white' 
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {tab === 'Reviews' ? `Reviews (${reviews.length})` : tab}
                </button>
              ))}
            </div>

            {/* Tab Content Panel */}
            <div className="p-5 md:p-6 min-h-[180px]">
              
              {/* Tab 1: Description */}
              {activeTab === 'Description' && (
                <div className="text-sm text-gray-600 leading-relaxed font-medium">
                  <p className="mb-4">{description}</p>
                  <p>Developed with clinical precision and utilizing high-durability components, this unit is certified to comply with B2B clinical standards. Orikam Healthcare provides a 1-year manufacturing warranty and round-the-clock technical expert guidance for installation support.</p>
                </div>
              )}

              {/* Tab 2: Specifications table */}
              {activeTab === 'Specifications' && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs text-gray-600">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="border border-gray-100 p-2 text-left font-bold text-gray-800 w-1/3">Parameters</th>
                        <th className="border border-gray-100 p-2 text-left font-bold text-gray-800">Details / Values</th>
                      </tr>
                    </thead>
                    <tbody>
                      {specifications && specifications.length > 0 ? (
                        specifications.map((spec, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/30">
                            <td className="border border-gray-100 p-2 font-bold text-gray-700 font-outfit">{spec.label}</td>
                            <td className="border border-gray-100 p-2 font-semibold">{spec.value}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="border border-gray-100 p-3 text-center font-bold text-gray-400">
                            No specifications list available for this product.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: Customer reviews */}
              {activeTab === 'Reviews' && (
                <div className="flex flex-col gap-4">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((rev, idx) => (
                      <div key={idx} className="bg-gray-50/40 p-4 rounded-lg border border-gray-100 shadow-2xs">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-xs font-bold text-gray-800 font-outfit block">{rev.user}</span>
                            <span className="text-[9px] text-gray-400 font-bold">{rev.date}</span>
                          </div>
                          <div className="flex items-center text-amber-400 text-[10px]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed italic">"{rev.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 font-bold text-gray-400 text-xs">
                      No customer reviews yet. Be the first to share your clinical experience!
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </section>

        {/* Similar Products Row */}
        {similarProducts.length > 0 && (
          <section className="w-full px-4 md:px-6 py-1">
            <div className="max-w-[1440px] mx-auto bg-white rounded-xl p-3 shadow-2xs border border-gray-100/60">
              
              <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
                <h2 className="text-sm font-bold font-outfit text-gray-800 tracking-tight">
                  Similar Clinical Products
                </h2>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cross Recommendations</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {similarProducts.map((prod) => (
                  <ProductCard key={prod._id || prod.id} product={prod} />
                ))}
              </div>

            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
