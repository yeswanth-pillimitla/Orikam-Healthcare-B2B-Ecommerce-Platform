import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiDownload, 
  FiRefreshCw, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertTriangle,
  FiX 
} from 'react-icons/fi';
import { AppContext } from '../context/AppContext';

export default function OrderCard({ order }) {
  const id = order.orderId;
  const date = order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : 'Pending';
  const status = order.orderStatus;
  const items = order.products || [];
  const total = order.totalAmount;
  const address = order.shippingAddress || {};
  const payment = {
    method: order.paymentMethod,
    details: order.paymentDetails || 'Online Payment'
  };

  const { addToCart, navigateTo, cancelOrder } = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);
  const [showShippedModal, setShowShippedModal] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Status mapping to highlight tracking steps
  const statuses = ["Ordered", "Packed", "Shipped", "Delivered"];
  const currentStepIndex = statuses.indexOf(status);

  const handleReorder = () => {
    items.forEach((item) => {
      addToCart({ _id: item.product, id: item.product, price: item.price, name: item.name }, item.quantity);
    });
    navigateTo('cart');
  };

  const handleCancelClick = () => {
    setErrorMessage('');
    if (status === 'Shipped' || status === 'Delivered') {
      setShowShippedModal(true);
    } else if (status === 'Ordered' || status === 'Packed') {
      setShowConfirmCancel(true);
    }
  };

  const handleConfirmCancel = async () => {
    setCancelling(true);
    setErrorMessage('');
    const targetId = order._id || order.orderId || order.id;
    const res = await cancelOrder(targetId);
    setCancelling(false);
    setShowConfirmCancel(false);
    if (res && !res.success) {
      setErrorMessage(res.error || "Failed to cancel order.");
    }
  };

  const handleDownloadInvoice = () => {
    const invoiceContent = `
========================================
           ORIKAM HEALTHCARE            
========================================
INVOICE FOR ORDER: ${id}
Order Date: ${date}
Order Status: ${status}
Payment Method: ${payment.method} (${payment.details})

DELIVERY ADDRESS:
Name: ${address.name}
Phone: ${address.phone}
Address: ${address.addressLine}, ${address.city} - ${address.pincode}

ITEMS PURCHASED:
----------------------------------------
${items.map(item => `- ${item.name || item.product?.name}
  Qty: ${item.quantity} | Price: INR ${(item.price || 0).toLocaleString('en-IN')}.00
  Total: INR ${((item.price || 0) * item.quantity).toLocaleString('en-IN')}.00`).join('\n\n')}
----------------------------------------
ORDER SUMMARY:
Subtotal: INR ${(order.subtotal || 0).toLocaleString('en-IN')}.00
Discount: INR -${(order.discount || 0).toLocaleString('en-IN')}.00
GST Tax (18%): INR ${(order.tax || 0).toLocaleString('en-IN')}.00
Delivery Charge: INR ${(order.delivery || 0).toLocaleString('en-IN')}.00
========================================
GRAND TOTAL: INR ${(total || 0).toLocaleString('en-IN')}.00
========================================
Thank you for shopping with Orikam!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden text-left mb-4">
      
      {/* Card Header Summary */}
      <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Order ID</span>
            <span className="text-xs font-bold text-gray-800 font-outfit">{id}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Date Placed</span>
            <span className="text-xs font-bold text-gray-700 font-outfit">{date}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Total Price</span>
            <span className="text-xs font-extrabold text-brand-red font-outfit">₹{(total || 0).toLocaleString('en-IN')}.00</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Status</span>
            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 uppercase tracking-wide ${
              status === 'Delivered' 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                : status === 'Shipped' 
                ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                : status === 'Cancelled'
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'bg-amber-50 text-amber-600 border border-amber-100'
            }`}>
              {status}
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-1 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
            title="Download Invoice"
          >
            <FiDownload size={11} />
            <span className="hidden sm:inline">Invoice</span>
          </button>

          {status !== 'Cancelled' && (
            <button
              onClick={handleCancelClick}
              className="flex items-center gap-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
              title="Cancel Order"
            >
              <FiXCircle size={11} />
              <span>Cancel</span>
            </button>
          )}

          <button
            onClick={handleReorder}
            className="flex items-center gap-1 bg-brand-red hover:bg-brand-red-hover text-white px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
          >
            <FiRefreshCw size={10} className="animate-spin-hover" />
            <span>Reorder</span>
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 bg-white text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer shadow-2xs"
          >
            {expanded ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 p-3 px-4 flex items-center justify-between text-xs text-red-700 font-bold">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="text-red-500 hover:text-red-700">
            <FiX size={14} />
          </button>
        </div>
      )}

      {/* Main Order Content */}
      <div className="p-4">
        
        {/* Simple Item Previews */}
        <div className="flex flex-wrap items-center gap-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
              <div className="w-10 h-10 bg-white rounded border border-gray-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <img 
                  src={item.image || item.product?.image || item.product?.images?.[0]} 
                  alt={item.name || item.product?.name} 
                  className="max-h-full max-w-full object-contain mix-blend-multiply" 
                />
              </div>
              <div className="text-left max-w-[140px] leading-tight">
                <p className="text-[10px] font-bold text-gray-700 truncate">{item.name || item.product?.name}</p>
                <span className="text-[9px] text-gray-400 font-semibold">Qty: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tracking Timeline or Cancelled Status Banner */}
        <div className="mt-6 border-t border-gray-100 pt-5">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 font-outfit">
            Order Progress Tracking
          </h4>

          {status === 'Cancelled' ? (
            <div className="max-w-2xl mx-auto p-3.5 bg-red-50/90 border border-red-200/80 rounded-xl text-xs text-red-700 flex items-center justify-center gap-2 font-bold font-outfit">
              <FiXCircle size={18} className="text-red-500 shrink-0" />
              <span>This order was cancelled and will not be processed further.</span>
            </div>
          ) : (
            <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
              
              {/* Background progress bar */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${Math.max(0, (currentStepIndex / (statuses.length - 1)) * 100)}%` }}
                />
              </div>

              {/* Tracking Nodes */}
              {statuses.map((step, idx) => {
                const isActive = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors border ${
                      isActive 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs' 
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}>
                      {isActive ? (
                        <FiCheckCircle size={12} />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <span className={`text-[9px] font-bold mt-1.5 tracking-tight font-outfit ${
                      isCurrent 
                        ? 'text-emerald-600 font-extrabold scale-105' 
                        : isActive 
                        ? 'text-gray-700' 
                        : 'text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}

            </div>
          )}
        </div>

      </div>

      {/* Expanded Detailed Breakdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-gray-50/40"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100">
              
              {/* Left Column: Delivery details */}
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-outfit">Delivery Details</h4>
                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-2xs text-xs text-gray-600 leading-normal">
                  <p className="font-bold text-gray-800 font-outfit">{address.name}</p>
                  <p className="font-semibold text-[10px] mt-0.5 text-gray-500">{address.phone}</p>
                  <p className="mt-1.5 font-medium">{address.addressLine}</p>
                  <p className="font-medium">{address.city} - {address.pincode}</p>
                </div>
              </div>

              {/* Right Column: Billing details */}
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-outfit">Billing & Payment</h4>
                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-2xs text-xs text-gray-600">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="font-medium text-gray-400">Payment Mode</span>
                    <span className="font-bold text-gray-700 font-outfit">{payment.method} ({payment.details})</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-gray-500">Subtotal</span>
                    <span className="font-semibold text-gray-800">₹{(order.subtotal || 0).toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between py-1 text-brand-red">
                    <span className="font-medium">10% Admin Discount</span>
                    <span className="font-bold">-₹{(order.discount || 0).toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-gray-500">Tax (18% GST)</span>
                    <span className="font-semibold text-gray-800">₹{(order.tax || 0).toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-gray-500">Delivery Charge</span>
                    <span className="font-semibold text-gray-800">₹{(order.delivery || 0).toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between pt-1.5 mt-1 border-t border-gray-100 font-extrabold text-gray-900 font-outfit text-sm">
                    <span>Grand Total</span>
                    <span className="text-brand-red">₹{(total || 0).toLocaleString('en-IN')}.00</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POP-UP MODAL 1: Order Already Shipped Warning Modal */}
      <AnimatePresence>
        {showShippedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-left relative"
            >
              <button
                onClick={() => setShowShippedModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <FiX size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <FiAlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 font-outfit text-base">Order Already Shipped</h3>
                  <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider">{id}</span>
                </div>
              </div>

              <div className="bg-amber-50/60 border border-amber-150 p-4 rounded-xl mb-5">
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  Your order has already been shipped. Orders can only be cancelled before dispatch. If you do not want this item, please leave it with or return it to the delivery executive upon arrival.
                </p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => setShowShippedModal(false)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-outfit transition-colors cursor-pointer shadow-2xs"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POP-UP MODAL 2: Confirmation Modal for Unshipped Order Cancellation */}
      <AnimatePresence>
        {showConfirmCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-left"
            >
              <div className="flex items-center gap-3 text-red-600 mb-3">
                <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                  <FiXCircle size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 font-outfit text-base">Cancel Order?</h3>
                  <p className="text-[11px] text-gray-500 font-semibold">{id}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-normal mb-5 font-medium">
                Are you sure you want to cancel this order? This action will mark your order as cancelled.
              </p>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setShowConfirmCancel(false)}
                  disabled={cancelling}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={cancelling}
                  className="px-4.5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold font-outfit transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  {cancelling ? (
                    <span>Cancelling...</span>
                  ) : (
                    <>
                      <FiXCircle size={14} />
                      <span>Yes, Cancel Order</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
