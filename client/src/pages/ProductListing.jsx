import React, { useContext, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryNavbar from '../components/CategoryNavbar';
import ProductCard from '../components/ProductCard';
import { AppContext } from '../context/AppContext';
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductListing() {
  const {
    navigateTo,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    priceFilter,
    setPriceFilter,
    ratingFilter,
    setRatingFilter,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    productsList,
    categories,
    brands,
    loading,
  } = useContext(AppContext);

  const categoriesList = categories.map(c => c.name);
  const brandsList = brands.map(b => b.name);

  // Items per page
  const itemsPerPage = 8;

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceFilter(400000);
    setRatingFilter(0);
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Filter & Sort logic is handled by the backend API query parameters.
  // We bind filteredProducts directly to the live productsList from MongoDB.
  const filteredProducts = productsList;

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans gap-2 text-left">
      <Header />
      
      <main className="flex-1 flex flex-col gap-2 pb-2">
        <CategoryNavbar />

        {/* Breadcrumb Navigation & Listing Header */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto bg-white rounded-xl p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <nav className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span onClick={() => navigateTo('home')} className="hover:text-brand-red cursor-pointer">Home</span>
                <span>/</span>
                <span className="text-gray-600">Product Catalog</span>
              </nav>
              <h1 className="text-base font-bold font-outfit text-gray-800 tracking-tight flex items-center gap-2">
                <span>All B2B Dental Supplies</span>
                <span className="bg-red-50 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {filteredProducts.length} Items Found
                </span>
              </h1>
            </div>

            {/* Sorting control */}
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sort By</span>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 px-3 py-2 focus:outline-none focus:bg-white cursor-pointer"
              >
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>
          </div>
        </section>

        {/* Main Grid Body */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-3 items-start">
            
            {/* Left: Sidebar Filters */}
            <aside className="w-full lg:w-64 bg-white rounded-xl p-4 shadow-2xs shrink-0 border border-gray-100/60">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-xs font-extrabold text-gray-900 font-outfit uppercase tracking-wider flex items-center gap-1.5">
                  <FiFilter size={12} className="text-brand-red" />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-bold text-brand-red hover:text-brand-red-hover cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* 1. Category Filter */}
              <div className="mb-5">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2.5 font-outfit">Categories</h4>
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => {
                        setSelectedCategory('');
                        setCurrentPage(1);
                      }}
                      className="text-brand-red focus:ring-brand-red w-3.5 h-3.5"
                    />
                    <span>All Categories</span>
                  </label>
                  {categoriesList.map((cat, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory.toLowerCase() === cat.toLowerCase()}
                        onChange={() => {
                          setSelectedCategory(cat);
                          setCurrentPage(1);
                        }}
                        className="text-brand-red focus:ring-brand-red w-3.5 h-3.5"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Brand Filter */}
              <div className="mb-5 border-t border-gray-100 pt-4">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2.5 font-outfit">Brands</h4>
                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === ''}
                      onChange={() => {
                        setSelectedBrand('');
                        setCurrentPage(1);
                      }}
                      className="text-brand-red focus:ring-brand-red w-3.5 h-3.5"
                    />
                    <span>All Brands</span>
                  </label>
                  {brandsList.map((brand, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand.toLowerCase() === brand.toLowerCase()}
                        onChange={() => {
                          setSelectedBrand(brand);
                          setCurrentPage(1);
                        }}
                        className="text-brand-red focus:ring-brand-red w-3.5 h-3.5"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Price Filter */}
              <div className="mb-5 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-outfit">Max Price</h4>
                  <span className="text-[11px] font-bold text-brand-red font-outfit">₹{priceFilter.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="400000"
                  step="500"
                  value={priceFilter}
                  onChange={(e) => {
                    setPriceFilter(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
                />
                <div className="flex justify-between text-[9px] text-gray-400 font-bold mt-1.5 font-outfit">
                  <span>₹300</span>
                  <span>₹4,00,000</span>
                </div>
              </div>

              {/* 4. Rating Filter */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2.5 font-outfit">Ratings</h4>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      setRatingFilter(0);
                      setCurrentPage(1);
                    }}
                    className={`text-left px-2 py-1.5 rounded text-xs font-bold transition-colors ${
                      ratingFilter === 0 ? 'bg-red-50 text-brand-red' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Any Rating
                  </button>
                  {[4, 4.5, 4.8].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        setRatingFilter(rate);
                        setCurrentPage(1);
                      }}
                      className={`text-left px-2 py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-between ${
                        ratingFilter === rate ? 'bg-red-50 text-brand-red' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{rate} ★ & above</span>
                      <span className="text-[10px] text-gray-400">★</span>
                    </button>
                  ))}
                </div>
              </div>

            </aside>

            {/* Right: Product Grid & Pagination */}
            <div className="flex-1 w-full flex flex-col gap-3">
              
              {/* Active Filter Badges */}
              {(selectedCategory || selectedBrand || searchQuery || ratingFilter > 0 || priceFilter < 400000) && (
                <div className="w-full bg-white rounded-xl p-2.5 shadow-2xs flex flex-wrap items-center gap-1.5 border border-gray-100/60">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mr-1">Active:</span>
                  
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <span>Search: "{searchQuery}"</span>
                      <FiX size={10} className="cursor-pointer" onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <span>Cat: {selectedCategory}</span>
                      <FiX size={10} className="cursor-pointer" onClick={() => setSelectedCategory('')} />
                    </span>
                  )}
                  {selectedBrand && (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <span>Brand: {selectedBrand}</span>
                      <FiX size={10} className="cursor-pointer" onClick={() => setSelectedBrand('')} />
                    </span>
                  )}
                  {priceFilter < 400000 && (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <span>Max: ₹{priceFilter.toLocaleString('en-IN')}</span>
                      <FiX size={10} className="cursor-pointer" onClick={() => setPriceFilter(400000)} />
                    </span>
                  )}
                  {ratingFilter > 0 && (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <span>Rating: {ratingFilter}★+</span>
                      <FiX size={10} className="cursor-pointer" onClick={() => setRatingFilter(0)} />
                    </span>
                  )}
                </div>
              )}

              {/* Grid content */}
              <div className="bg-white rounded-xl p-3 shadow-2xs border border-gray-100/60 min-h-[480px] flex flex-col justify-between gap-6">
                
                {paginatedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <AnimatePresence mode="popLayout">
                      {paginatedProducts.map((prod) => (
                        <motion.div
                          key={prod._id || prod.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ProductCard product={prod} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-brand-red mb-3">
                      <FiFilter size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 font-outfit uppercase tracking-wide">No Results Match Filters</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs font-medium">Try broadening your parameters, adjusting the price limit slider, or resetting all current tags.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 bg-brand-red hover:bg-brand-red-hover text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 border-t border-gray-100 pt-4 mt-auto">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <FiChevronLeft size={14} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded text-xs font-bold border transition-colors cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-brand-red border-brand-red text-white shadow-2xs'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <FiChevronRight size={14} />
                    </button>
                  </div>
                )}

              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
