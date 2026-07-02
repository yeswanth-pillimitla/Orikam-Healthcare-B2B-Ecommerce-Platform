import React, { useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryNavbar from '../components/CategoryNavbar';
import OrderCard from '../components/OrderCard';
import { AppContext } from '../context/AppContext';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function MyOrders() {
  const { orders, navigateTo } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans gap-2 text-left">
      <Header />
      
      <main className="flex-1 flex flex-col gap-2 pb-2">
        <CategoryNavbar />

        {/* Breadcrumb & Page Title Header */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto bg-white rounded-xl p-3 shadow-2xs flex items-center justify-between">
            <div>
              <nav className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span onClick={() => navigateTo('home')} className="hover:text-brand-red cursor-pointer">Home</span>
                <span>/</span>
                <span className="text-gray-600">My Orders</span>
              </nav>
              <h1 className="text-base font-bold font-outfit text-gray-800 tracking-tight flex items-center gap-2">
                <span>Clinical Purchases History</span>
                <span className="bg-red-50 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
                </span>
              </h1>
            </div>
            <button
              onClick={() => navigateTo('listing')}
              className="text-xs font-bold text-brand-red hover:text-brand-red-hover flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Back to Catalog</span>
              <span className="text-xs">→</span>
            </button>
          </div>
        </section>

        {/* Orders List Container */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto">
            {orders.length > 0 ? (
              <div className="flex flex-col gap-1">
                {orders.map((order) => (
                  <OrderCard key={order._id || order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 shadow-2xs border border-gray-100/60 text-center flex flex-col items-center justify-center min-h-[380px]">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-brand-red mb-3">
                  <FiShoppingBag size={24} />
                </div>
                <h3 className="text-sm font-bold text-gray-800 font-outfit uppercase tracking-wide">No Orders Placed Yet</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs font-medium">You haven't ordered any medical or dental equipment supplies during this browsing session.</p>
                <button
                  onClick={() => navigateTo('listing')}
                  className="mt-5 bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Explore Equipment & Supplies</span>
                  <FiArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
