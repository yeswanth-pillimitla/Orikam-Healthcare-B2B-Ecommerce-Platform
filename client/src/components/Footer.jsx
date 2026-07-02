import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronUp } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube
} from 'react-icons/fa';

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const { navigateTo } = useContext(AppContext);

  return (
    <footer className="w-full px-4 md:px-6 py-2.5 mt-auto relative">
      <div className="max-w-[1440px] mx-auto bg-white rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-6">

        {/* Top Section: Single Row Layout with Slide Toggle */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-4 pb-4 border-b border-gray-100"
            >
              {/* 1. Subscribe to our newsletter (Left) */}
              <div className="w-full lg:w-auto lg:flex-1 lg:max-w-[340px] text-left bg-gray-50/70 rounded-xl p-4 flex flex-col justify-center">
                <h3 className="text-xs md:text-sm font-bold text-gray-900 font-outfit uppercase">
                  Subscribe to our newsletter
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 mb-3.5 font-bold">
                  Get the latest updates, offers and more.
                </p>
                <div className="flex gap-2 w-full">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-1.5 bg-white rounded-md text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                  <button className="bg-brand-red hover:bg-brand-red-hover text-white px-4 py-1.5 rounded-md text-xs font-bold tracking-wide transition-colors cursor-pointer shrink-0">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* 2. Orikam Logo & Description & Socials (Middle) */}
              <div className="w-full lg:w-auto lg:flex-1 lg:max-w-[280px] text-left flex flex-col justify-center gap-3">
                <div>
                  <div className="flex items-center gap-2 cursor-pointer mb-1.5">
                    <img src="/Logo.png" alt="Orikam Logo" className="h-6 object-contain" />
                  </div>
                  <p className="text-xs text-gray-500 leading-normal font-bold max-w-xs">
                    India's leading B2B platform for dental and medical supplies.
                  </p>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-2">
                  <a href="#" className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
                    <FaFacebookF size={14} />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
                    <FaInstagram size={14} />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
                    <FaLinkedinIn size={14} />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
                    <FaYoutube size={14} />
                  </a>
                </div>
              </div>

              {/* 3. Four Link Columns (Right) */}
              <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-10 text-left shrink-0">
                {/* Shop Column */}
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wider font-outfit mb-2.5">
                    Shop
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('listing'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">All Products</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('listing'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">Top Brands</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">Categories</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('listing'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">Offers</a></li>
                  </ul>
                </div>

                {/* Account Column */}
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wider font-outfit mb-2.5">
                    Account
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('orders'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">My Orders</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('profile'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">Wishlist</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('profile'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">My Profile</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">Bulk Orders</a></li>
                  </ul>
                </div>

                {/* Company Column */}
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wider font-outfit mb-2.5">
                    Company
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('about'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">About us</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('careers'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">Careers</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('blog'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">Blog</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">Contact Us</a></li>
                  </ul>
                </div>

                {/* Support Column */}
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wider font-outfit mb-2.5">
                    Support
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('help'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">Help Center</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('shipping'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">Shipping & Delivery</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('returns'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">Returns Refunds</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-brand-red transition-colors">Terms & Conditions</a></li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Section: Copyright & Payments */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          
          <span className="text-[10px] md:text-xs font-bold text-gray-400">
            © 2024 Orikam Healthcare. All rights reserved.
          </span>

          {/* Payment Icons & Toggle Button */}
          <div className="flex items-center gap-3 scale-90 sm:scale-100">
            <div className="flex items-center gap-1.5">
              {/* Visa */}
              <div className="h-6 px-2.5 bg-gray-50 flex items-center justify-center font-black text-[10px] text-[#1A1F71] italic tracking-tight rounded">
                VISA
              </div>
              {/* Mastercard */}
              <div className="h-6 px-2.5 bg-gray-50 flex items-center justify-center gap-1.5 rounded">
                <div className="flex -space-x-1">
                  <div className="w-2 h-2 rounded-full bg-[#EB001B]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#F79E1B] opacity-80"></div>
                </div>
                <span className="text-[8px] font-bold text-gray-400 lowercase tracking-tighter leading-none">mastercard</span>
              </div>
              {/* Rupay */}
              <div className="h-6 px-2.5 bg-gray-50 flex items-center justify-center gap-0.5 rounded">
                <span className="text-[10px] font-black text-[#0A2F64] italic tracking-tighter">Ru</span>
                <span className="text-[10px] font-black text-[#F15A24] italic tracking-tighter">Pay</span>
              </div>
              {/* UPI */}
              <div className="h-6 px-2.5 bg-gray-50 flex items-center justify-center gap-0.5 rounded">
                <span className="text-[10px] font-extrabold text-[#097969] tracking-tighter italic">U</span>
                <span className="text-[10px] font-extrabold text-[#0066b2] tracking-tighter italic">P</span>
                <span className="text-[10px] font-extrabold text-[#FFA500] tracking-tighter italic">I</span>
              </div>
            </div>

            {/* Collapse/Expand Toggle Arrow Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-7 h-7 rounded-full border border-black bg-transparent text-black hover:bg-gray-50 cursor-pointer shadow-2xs transition-all duration-200 shrink-0"
              title={isOpen ? "Hide Directory" : "Show Directory"}
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiChevronUp size={14} />
              </motion.div>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
