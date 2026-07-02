import React, { useContext, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryNavbar from '../components/CategoryNavbar';
import CartItem from '../components/CartItem';
import { AppContext } from '../context/AppContext';
import { FiShoppingBag, FiArrowRight, FiArrowLeft, FiTag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cart, getCartSummary, navigateTo, clearCart } = useContext(AppContext);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0); // flat promo discount amount
  const [promoError, setPromoError] = useState('');

  const summary = getCartSummary();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    
    if (promoCode.trim().toUpperCase() === 'ORIKAM5') {
      setPromoApplied(true);
      const discountVal = summary.subtotal * 0.05;
      setPromoDiscount(discountVal);
    } else if (promoCode.trim().toUpperCase() === 'WELCOME500') {
      if (summary.subtotal >= 2000) {
        setPromoApplied(true);
        setPromoDiscount(500);
      } else {
        setPromoError('Valid on orders above ₹2,000 only.');
      }
    } else if (promoCode.trim() === '') {
      setPromoError('Please enter a promo code.');
    } else {
      setPromoError('Invalid promo code.');
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoCode('');
  };

  // Recalculate values with promo code applied
  const finalDiscount = summary.discount + promoDiscount;
  const taxableAmount = Math.max(0, summary.subtotal - finalDiscount);
  const finalTax = taxableAmount * 0.18;
  const finalGrandTotal = taxableAmount + summary.delivery + finalTax;

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans gap-2 text-left">
      <Header />
      
      <main className="flex-1 flex flex-col gap-2 pb-2">
        <CategoryNavbar />

        {/* Page Title */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto bg-white rounded-xl p-3 shadow-2xs">
            <h1 className="text-base font-bold font-outfit text-gray-800 tracking-tight flex items-center gap-2">
              <FiShoppingBag className="text-brand-red" size={16} />
              <span>Shopping Cart Inventory</span>
              <span className="bg-red-50 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded-full">
                {cart.length} Unique {cart.length === 1 ? 'Item' : 'Items'}
              </span>
            </h1>
          </div>
        </section>

        {/* Cart Contents */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-3 items-start">
            
            {/* Left: Cart Items List */}
            <div className="flex-1 w-full flex flex-col gap-2.5">
              {cart.length > 0 ? (
                <>
                  <div className="flex flex-col gap-2 bg-white rounded-xl p-3 shadow-2xs border border-gray-100/60">
                    <div className="hidden md:flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-50 px-2">
                      <span className="flex-1 text-left">Product Details</span>
                      <span className="w-24 text-left">Unit Price</span>
                      <span className="w-24 text-center">Quantity</span>
                      <span className="w-24 text-right pr-6">Subtotal</span>
                    </div>

                    <AnimatePresence mode="popLayout">
                      {cart.map((item) => (
                        <CartItem key={item.product._id || item.product.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Actions under list */}
                  <div className="flex items-center justify-between px-2">
                    <button
                      onClick={() => navigateTo('listing')}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-red cursor-pointer transition-colors"
                    >
                      <FiArrowLeft size={13} />
                      <span>Continue Shopping</span>
                    </button>
                    <button
                      onClick={clearCart}
                      className="text-xs font-bold text-gray-400 hover:text-brand-red cursor-pointer transition-colors"
                    >
                      Empty Entire Cart
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl p-12 shadow-2xs border border-gray-100/60 text-center flex flex-col items-center justify-center min-h-[380px]">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-brand-red mb-3">
                    <FiShoppingBag size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 font-outfit uppercase tracking-wide">Your Cart is Empty</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs font-medium">Browse our premium dental chairs, composite resins, sterilizers, and clinical equipment supplies to add items.</p>
                  <button
                    onClick={() => navigateTo('listing')}
                    className="mt-5 bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Browse Product Catalog</span>
                    <FiArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Order Summary Calculations */}
            {cart.length > 0 && (
              <div className="w-full lg:w-96 flex flex-col gap-3 shrink-0">
                
                {/* Order Summary Panel */}
                <div className="bg-white rounded-xl p-4 shadow-2xs border border-gray-100/60">
                  <h3 className="text-xs font-extrabold text-gray-800 font-outfit uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">
                    Order Summary
                  </h3>

                  {/* Computations list */}
                  <div className="flex flex-col gap-2.5 text-xs text-gray-600 border-b border-gray-100 pb-3 mb-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-400">Total Items Subtotal</span>
                      <span className="font-bold text-gray-800">₹{summary.subtotal.toLocaleString('en-IN')}.00</span>
                    </div>

                    <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50/50 p-1.5 rounded">
                      <span className="flex items-center gap-1">
                        <span>Super Admin 10% Discount</span>
                      </span>
                      <span>-₹{summary.discount.toLocaleString('en-IN')}.00</span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50/50 p-1.5 rounded">
                        <span className="flex items-center gap-1">
                          <span>Promo Coupon Code Applied</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <span>-₹{promoDiscount.toLocaleString('en-IN')}.00</span>
                          <button onClick={handleRemovePromo} className="text-[10px] text-red-500 font-black cursor-pointer hover:text-red-700">×</button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-400">GST Tax (18% rate)</span>
                      <span className="font-bold text-gray-800">₹{finalTax.toLocaleString('en-IN')}.00</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-400">Estimated Delivery Charges</span>
                      <span className="font-bold text-gray-800">
                        {summary.delivery === 0 ? (
                          <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-wide bg-emerald-50 px-1.5 py-0.5 rounded">FREE</span>
                        ) : (
                          `₹${summary.delivery}.00`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Grand total price */}
                  <div className="flex justify-between items-center text-sm font-extrabold text-gray-900 font-outfit mb-5">
                    <span className="text-gray-800 font-bold">Total Bill Amount</span>
                    <span className="text-lg text-brand-red font-black">₹{finalGrandTotal.toLocaleString('en-IN')}.00</span>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    onClick={() => navigateTo('checkout')}
                    className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-outfit font-bold rounded-lg px-4 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                  >
                    <span>Proceed To Checkout</span>
                    <FiArrowRight size={13} />
                  </button>
                </div>

                {/* Promo Code Coupon Apply Box */}
                <div className="bg-white rounded-xl p-4 shadow-2xs border border-gray-100/60 text-left">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2 font-outfit flex items-center gap-1">
                    <FiTag size={12} className="text-brand-red animate-pulse" />
                    <span>Apply Clinical Coupon Promo</span>
                  </h4>
                  <form onSubmit={handleApplyPromo} className="flex gap-1.5">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter ORIKAM5 or WELCOME500"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-colors uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-gray-800 hover:bg-black text-white px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {promoApplied && (
                    <span className="inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-2">
                      Coupon Applied Successfully!
                    </span>
                  )}
                  {promoError && (
                    <span className="inline-block text-[9px] font-bold text-brand-red bg-red-50 px-2 py-0.5 rounded mt-2">
                      {promoError}
                    </span>
                  )}
                </div>

              </div>
            )}

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
