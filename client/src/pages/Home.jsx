import React, { useContext } from 'react';
import Header from '../components/Header';
import CategoryNavbar from '../components/CategoryNavbar';
import HeroBanner from '../components/HeroBanner';
import BrandSection from '../components/BrandSection';
import FeaturedCategories from '../components/FeaturedCategories';
import ProductCard from '../components/ProductCard';
import ServiceSection from '../components/ServiceSection';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';

export default function Home() {
  const { navigateTo, setSelectedCategory, setSelectedBrand, setSearchQuery, productsList } = useContext(AppContext);

  // Display the first 6 popular items from the backend
  const popularProducts = productsList.slice(0, 6);

  const handleViewAllProducts = (e) => {
    e.preventDefault();
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchQuery('');
    navigateTo('listing');
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans gap-2">
      
      {/* Header Navigation */}
      <Header />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col gap-2 pb-2">
        
        {/* Category Navigation Bar */}
        <CategoryNavbar />

        {/* Hero Slider Banner */}
        <HeroBanner />

        {/* Brand Grid Section */}
        <BrandSection />

        {/* Featured Categories Row */}
        <FeaturedCategories />

        {/* Popular Products Grid Section */}
        <section className="w-full px-4 md:px-6 py-2.5">
          <div className="max-w-[1440px] mx-auto bg-white rounded-2xl p-5 shadow-xs">
            
            {/* Grid Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold font-outfit text-gray-900 tracking-tight">
                Popular Products
              </h2>
              <a 
                href="#" 
                onClick={handleViewAllProducts}
                className="text-xs md:text-sm font-semibold text-brand-red hover:text-brand-red-hover flex items-center gap-1 transition-colors"
              >
                View all Products <span className="text-xs">→</span>
              </a>
            </div>

            {/* Responsive Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularProducts.map((prod) => (
                <ProductCard key={prod._id || prod.id} product={prod} />
              ))}
            </div>

          </div>
        </section>

        {/* Services & USP Value Propositions */}
        <ServiceSection />

      </main>

      {/* Footer Directory */}
      <Footer />

    </div>
  );
}
