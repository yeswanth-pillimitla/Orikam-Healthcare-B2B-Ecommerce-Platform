import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiGift } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import heroBg from '../assets/hero_banner.png';

const slides = [
  {
    id: 1,
    subtitle: "The Great Dental",
    title: "Discount Fest",
    desc: "Exclusive, For a Limited Time!",
    statLabel: "MORE THAN",
    statValue: "1,000+",
    statText: "PREMIUM PRODUCTS",
    badge: "UPTO 40% OFF"
  },
  {
    id: 2,
    subtitle: "Premium Dental Equipment",
    title: "Mega Sale",
    desc: "Get Up to 35% Off on autoclaves & chairs",
    statLabel: "TRUSTED BY",
    statValue: "10k+",
    statText: "CLINICAL PROFESSIONALS",
    badge: "FLAT 35% OFF"
  },
  {
    id: 3,
    subtitle: "Fast Delivery Nationwide",
    title: "Express Supplies",
    desc: "Free shipping on orders above ₹5000",
    statLabel: "SUPER FAST",
    statValue: "24hr",
    statText: "DISPATCH GUARANTEED",
    badge: "BEST PRICES"
  }
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const { navigateTo } = useContext(AppContext);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="w-full px-4 md:px-6 py-2.5">
      <div className="max-w-[1440px] mx-auto bg-white rounded-2xl p-5 shadow-xs">
        <div className="relative overflow-hidden rounded-xl shadow-xs h-[280px] md:h-[380px] bg-black">

        {/* Banner Background with Dark Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-black/45" />

        {/* Content Slider */}
        <div className="absolute inset-0 flex items-center justify-between px-8 md:px-24 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Left Side Info */}
              <div className="text-left flex flex-col items-start max-w-[85%] md:max-w-lg">
                <span className="text-amber-400 font-semibold uppercase text-xs md:text-base tracking-widest font-outfit mb-1 md:mb-2">
                  {slides[current].subtitle}
                </span>
                <h1 className="text-2xl md:text-6xl font-extrabold text-white font-outfit leading-tight mb-2 md:mb-4 tracking-tight">
                  {slides[current].title}
                </h1>
                <p className="text-xs md:text-lg text-gray-200 font-medium mb-4 md:mb-8 max-w-xs md:max-w-none">
                  {slides[current].desc}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo('listing')}
                  className="bg-white text-gray-900 px-5 py-2 md:px-8 md:py-3.5 rounded-full text-xs md:text-sm font-bold font-outfit uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-sm cursor-pointer"
                >
                  SHOP NOW
                </motion.button>
              </div>

              {/* Right Side badging (Hidden on mobile for better fit) */}
              <div className="hidden md:flex text-left md:text-right flex-col items-start md:items-end justify-center">
                <span className="text-gray-300 font-semibold text-xs md:text-sm tracking-wider uppercase leading-none mb-2">
                  {slides[current].statLabel}
                </span>
                <span className="text-5xl md:text-7xl font-extrabold text-white font-outfit leading-none tracking-tight">
                  {slides[current].statValue}
                </span>
                <span className="text-amber-400 font-semibold text-xs md:text-sm tracking-wider uppercase mt-2 mb-6">
                  {slides[current].statText}
                </span>
                <div className="bg-amber-400 text-black px-6 py-2 rounded-full font-bold font-outfit text-sm md:text-base tracking-wide shadow-sm">
                  {slides[current].badge}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white cursor-pointer z-20 backdrop-blur-xs transition-colors"
        >
          <FiChevronLeft size={18} className="md:w-6 md:h-6" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white cursor-pointer z-20 backdrop-blur-xs transition-colors"
        >
          <FiChevronRight size={18} className="md:w-6 md:h-6" />
        </button>

        {/* Slider Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                current === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Floating Refer & Earn badge in bottom left */}
        <div className="absolute bottom-4 left-5 z-20 flex items-center gap-1.5 bg-[#1b73e8] hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm cursor-pointer transition-colors">
          <FiGift size={13} className="shrink-0" />
          <span>Refer & Earn</span>
        </div>

      </div>
    </div>
  </section>
  );
}
