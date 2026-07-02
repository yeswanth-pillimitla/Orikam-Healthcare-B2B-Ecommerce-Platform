import React from 'react';
import { 
  FiTruck, 
  FiRotateCcw, 
  FiShield, 
  FiCreditCard, 
  FiHeadphones, 
  FiUser, 
  FiTag, 
  FiUsers 
} from 'react-icons/fi';

export default function ServiceSection() {
  return (
    <>
      {/* First Block - Main USPs & Bulk Callout */}
      <section className="w-full px-4 md:px-6 py-2.5">
        <div className="max-w-[1440px] mx-auto bg-white rounded-2xl p-5 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {/* Card 1: Free Shipping */}
            <div className="bg-gray-50/50 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-700 shrink-0">
                <FiTruck size={18} />
              </div>
              <div className="text-left">
                <h4 className="text-xs md:text-sm font-bold text-gray-900 font-outfit uppercase">Free Shipping</h4>
                <p className="text-[10px] md:text-xs text-gray-500 font-bold leading-tight">On orders above ₹5000</p>
              </div>
            </div>

            {/* Card 2: Easy Returns */}
            <div className="bg-gray-50/50 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-700 shrink-0">
                <FiRotateCcw size={18} />
              </div>
              <div className="text-left">
                <h4 className="text-xs md:text-sm font-bold text-gray-900 font-outfit uppercase">Easy Returns</h4>
                <p className="text-[10px] md:text-xs text-gray-500 font-bold leading-tight">7 days return policy</p>
              </div>
            </div>

            {/* Card 3: 100% Original */}
            <div className="bg-gray-50/50 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-700 shrink-0">
                <FiShield size={18} />
              </div>
              <div className="text-left">
                <h4 className="text-xs md:text-sm font-bold text-gray-900 font-outfit uppercase">100% Original</h4>
                <p className="text-[10px] md:text-xs text-gray-500 font-bold leading-tight">Genuine products only</p>
              </div>
            </div>

            {/* Card 4: Secure Payments */}
            <div className="bg-gray-50/50 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-700 shrink-0">
                <FiCreditCard size={18} />
              </div>
              <div className="text-left">
                <h4 className="text-xs md:text-sm font-bold text-gray-900 font-outfit uppercase">Secure Payments</h4>
                <p className="text-[10px] md:text-xs text-gray-500 font-bold leading-tight">Multiple options</p>
              </div>
            </div>

            {/* Card 5: Bulk Order Callout (Red Card) */}
            <div className="bg-brand-red rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm text-white col-span-2 md:col-span-1">
              <div className="text-left leading-none">
                <h4 className="text-xs md:text-[13px] font-extrabold uppercase font-outfit tracking-wide">Bulk Order?</h4>
                <p className="text-[10px] text-white/90 font-bold mt-1">Special discounts</p>
              </div>
              <button className="bg-white hover:bg-gray-100 text-brand-red text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-2xs shrink-0 cursor-pointer">
                Contact Us
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Second Block - Trust Factors */}
      <section className="w-full px-4 md:px-6 py-2.5">
        <div className="max-w-[1440px] mx-auto bg-white rounded-2xl p-5 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Item 1: Support */}
            <div className="flex items-center gap-3 px-3 py-1.5 justify-center md:justify-start">
              <FiHeadphones className="text-brand-red shrink-0" size={18} />
              <div className="text-left leading-tight">
                <h5 className="text-xs md:text-sm font-bold text-gray-900 font-outfit">24/7 Support</h5>
                <p className="text-[10px] md:text-xs text-gray-400 font-semibold">We are here to help you</p>
              </div>
            </div>

            {/* Item 2: Guidance */}
            <div className="flex items-center gap-3 px-3 py-1.5 justify-center md:justify-start">
              <FiUser className="text-brand-red shrink-0" size={18} />
              <div className="text-left leading-tight">
                <h5 className="text-xs md:text-sm font-bold text-gray-900 font-outfit">Expert Guidance</h5>
                <p className="text-[10px] md:text-xs text-gray-400 font-semibold">Get advice from experts</p>
              </div>
            </div>

            {/* Item 3: Price */}
            <div className="flex items-center gap-3 px-3 py-1.5 justify-center md:justify-start">
              <FiTag className="text-brand-red shrink-0" size={18} />
              <div className="text-left leading-tight">
                <h5 className="text-xs md:text-sm font-bold text-gray-900 font-outfit">Best Price Guarantee</h5>
                <p className="text-[10px] md:text-xs text-gray-400 font-semibold">We ensure best pricing</p>
              </div>
            </div>

            {/* Item 4: Trust */}
            <div className="flex items-center gap-3 px-3 py-1.5 justify-center md:justify-start">
              <FiUsers className="text-brand-red shrink-0" size={18} />
              <div className="text-left leading-tight">
                <h5 className="text-xs md:text-sm font-bold text-gray-900 font-outfit">Trusted by Professionals</h5>
                <p className="text-[10px] md:text-xs text-gray-400 font-semibold">Join 10,000+ dentists</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
