import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import OrderCard from '../OrderCard';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function UserOrdersTab() {
  const { orders, navigateTo } = useContext(AppContext);

  return (
    <div className="w-full text-left">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
        <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider font-outfit">
          Purchase History Tracker
        </h2>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          {orders.length} Total orders
        </span>
      </div>

      {orders.length > 0 ? (
        <div className="flex flex-col gap-1">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50/50 rounded-xl p-8 border border-gray-100/60 text-center flex flex-col items-center justify-center min-h-[250px]">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-brand-red mb-3">
            <FiShoppingBag size={20} />
          </div>
          <h4 className="text-xs font-bold text-gray-800 font-outfit uppercase tracking-wide">No Orders Logged</h4>
          <p className="text-[11px] text-gray-400 mt-1 max-w-xs font-medium">Purchase clinical equipment or resin composites first to track shipment updates.</p>
          <button
            onClick={() => navigateTo('listing')}
            className="mt-4 bg-brand-red hover:bg-brand-red-hover text-white px-4 py-2 rounded-lg text-[11px] font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
          >
            <span>Explore Catalog</span>
            <FiArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
