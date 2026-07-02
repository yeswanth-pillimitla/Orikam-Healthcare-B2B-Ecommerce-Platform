import React, { useContext, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryNavbar from '../components/CategoryNavbar';
import { AppContext } from '../context/AppContext';
import { FiMapPin, FiCreditCard, FiCheckCircle, FiPlus, FiArrowRight, FiSmile, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout() {
  const {
    cart,
    savedAddresses,
    activeAddressId,
    setActiveAddressId,
    addAddress,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    getCartSummary,
    placeOrder,
    navigateTo,
  } = useContext(AppContext);

  // Form states for adding a new address
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPincode, setNewPincode] = useState('');

  // Payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');

  // Place order success modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const summary = getCartSummary();

  const handleAddNewAddressSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newPhone || !newAddressLine || !newCity || !newPincode) return;

    addAddress({
      name: newName,
      phone: newPhone,
      addressLine: newAddressLine,
      city: newCity,
      pincode: newPincode,
    });

    // Reset inputs
    setNewName('');
    setNewPhone('');
    setNewAddressLine('');
    setNewCity('');
    setNewPincode('');
    setShowAddAddress(false);
  };

  const handlePlaceOrderSubmit = async () => {
    // Basic inputs verification
    if (selectedPaymentMethod === 'Card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      alert("Please fill in credit card payment details.");
      return;
    }
    if (selectedPaymentMethod === 'UPI' && !upiId) {
      alert("Please enter your UPI VPA handle.");
      return;
    }

    const orderObj = await placeOrder();
    if (orderObj) {
      setPlacedOrderDetails(orderObj);
      setShowSuccessModal(true);
    }
  };

  const handleModalCloseRedirect = () => {
    setShowSuccessModal(false);
    navigateTo('orders');
  };

  // If checkout opened with empty cart (e.g. refresh), redirect to listing
  if (cart.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans gap-2 text-left">
        <Header />
        <main className="flex-1 flex flex-col gap-2 pb-2">
          <CategoryNavbar />
          <div className="max-w-[1440px] mx-auto w-full bg-white rounded-xl p-12 shadow-2xs border border-gray-100/60 text-center flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-brand-red mb-3">
              <FiShoppingBag size={24} />
            </div>
            <h3 className="text-sm font-bold text-gray-800 font-outfit uppercase tracking-wide">No Active Cart Session</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs font-medium">Please add items into your shopping cart first before attempting to complete checkout.</p>
            <button
              onClick={() => navigateTo('listing')}
              className="mt-5 bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Go to Catalog</span>
              <FiArrowRight size={13} />
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans gap-2 text-left relative">
      <Header />
      
      <main className="flex-1 flex flex-col gap-2 pb-2">
        <CategoryNavbar />

        {/* Page Title */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto bg-white rounded-xl p-3 shadow-2xs">
            <h1 className="text-base font-bold font-outfit text-gray-800 tracking-tight flex items-center gap-2">
              <FiCreditCard className="text-brand-red" size={16} />
              <span>Complete B2B Secure Checkout</span>
            </h1>
          </div>
        </section>

        {/* Checkout Split Grid Layout */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-3 items-start">
            
            {/* Left: Shipping Address & Payments accordions */}
            <div className="flex-1 w-full flex flex-col gap-3">
              
              {/* SECTION 1: Delivery Address */}
              <div className="bg-white rounded-xl p-4 shadow-2xs border border-gray-100/60">
                <h3 className="text-xs font-extrabold text-gray-800 font-outfit uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FiMapPin className="text-brand-red" size={13} />
                  <span>1. Choose Delivery Address</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {savedAddresses.map((addr) => {
                    const id = addr._id || addr.id;
                    const isSelected = activeAddressId === id;
                    return (
                      <div
                        key={id}
                        onClick={() => setActiveAddressId(id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-brand-red bg-red-50/10 shadow-2xs' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-gray-800 font-outfit">{addr.name}</span>
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setActiveAddressId(id)}
                            className="text-brand-red focus:ring-brand-red w-3 h-3"
                          />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400">{addr.phone}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                          {addr.addressLine}, {addr.city} - {addr.pincode}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Add new address accordion */}
                {!showAddAddress ? (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-red hover:text-brand-red-hover cursor-pointer"
                  >
                    <FiPlus size={13} />
                    <span>Add New Delivery Address</span>
                  </button>
                ) : (
                  <form onSubmit={handleAddNewAddressSubmit} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-outfit">New Delivery Destination</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="e.g. Dr. Raj Kumar"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="e.g. +91 99887 76655"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Address Details (Street / Suite / Clinic)</label>
                      <input
                        type="text"
                        required
                        value={newAddressLine}
                        onChange={(e) => setNewAddressLine(e.target.value)}
                        placeholder="e.g. Plot No 12, Sector V, Apollo Dental Plaza"
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">City, State</label>
                        <input
                          type="text"
                          required
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          placeholder="e.g. Noida, UP"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Pincode</label>
                        <input
                          type="text"
                          required
                          value={newPincode}
                          onChange={(e) => setNewPincode(e.target.value)}
                          placeholder="e.g. 201301"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-red text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-brand-red-hover cursor-pointer"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

              </div>

              {/* SECTION 2: Payment Details */}
              <div className="bg-white rounded-xl p-4 shadow-2xs border border-gray-100/60 text-left">
                <h3 className="text-xs font-extrabold text-gray-800 font-outfit uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FiCreditCard className="text-brand-red" size={13} />
                  <span>2. Payment Method Details</span>
                </h3>

                {/* Tabs selection */}
                <div className="flex border-b border-gray-100 bg-gray-50/50 rounded-lg p-1 mb-4 gap-1">
                  {['Card', 'UPI', 'Net Banking', 'Cash'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`flex-1 py-2 text-xs font-bold rounded-md cursor-pointer transition-colors ${
                        selectedPaymentMethod === method 
                          ? 'bg-white text-gray-900 shadow-2xs border border-gray-100' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                {/* Tab content displays */}
                <div className="p-1 min-h-[140px]">
                  
                  {/* Option 1: Card */}
                  {selectedPaymentMethod === 'Card' && (
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Card Number</label>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="xxxx xxxx xxxx xxxx"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="e.g. DR. OLIVIA RHYE"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Expiration Date</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM / YY"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">CVV Code</label>
                          <input
                            type="password"
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="***"
                            maxLength={3}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Option 2: UPI */}
                  {selectedPaymentMethod === 'UPI' && (
                    <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      
                      {/* VPA Inputs */}
                      <div className="flex-1 w-full text-left">
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">UPI ID (VPA handle)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. oliviarhye@oksbi"
                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-red/50"
                          />
                        </div>
                        <p className="text-[9px] text-gray-400 mt-2 font-bold leading-normal">
                          Submit your VPA handle to launch a payment request notification directly inside your BHIM / GPay / PhonePe app.
                        </p>
                      </div>

                      {/* Scan QR */}
                      <div className="w-24 h-24 bg-white border border-gray-200 rounded p-1 flex flex-col items-center justify-center shrink-0 shadow-2xs">
                        <div className="w-18 h-18 bg-gray-100 relative flex items-center justify-center text-[7px] text-gray-400 font-bold border border-dashed border-gray-300">
                          {/* QR Mock */}
                          <div className="absolute inset-2 bg-gray-800 opacity-90 border border-white"></div>
                          <span className="relative z-10 text-white font-extrabold">ORIKAM QR</span>
                        </div>
                        <span className="text-[8px] font-extrabold text-gray-500 mt-1 uppercase tracking-wide">Scan & Pay</span>
                      </div>

                    </div>
                  )}

                  {/* Option 3: Net Banking */}
                  {selectedPaymentMethod === 'Net Banking' && (
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Select Professional Corporate Bank</label>
                      <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:bg-white cursor-pointer">
                        <option>HDFC Bank Corporate</option>
                        <option>State Bank of India (SBI)</option>
                        <option>ICICI Corporate Banking</option>
                        <option>Axis Bank Business Link</option>
                      </select>
                      <p className="text-[9px] text-gray-400 mt-1 font-semibold leading-normal">
                        You will be redirected safely to your financial institution portal to authenticate the transactional OTP.
                      </p>
                    </div>
                  )}

                  {/* Option 4: Cash */}
                  {selectedPaymentMethod === 'Cash' && (
                    <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100/60 text-xs text-amber-800 leading-relaxed font-semibold">
                      <p>✓ Cash on Delivery option selected.</p>
                      <p className="text-[10px] text-amber-600 mt-1.5">
                        Please keep a sum of ₹{summary.total.toLocaleString('en-IN')}.00 in cash or ready for mobile scanning on delivery dispatch arrival.
                      </p>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Right: Cart Summary review & Place Order CTA */}
            <div className="w-full lg:w-96 flex flex-col gap-3 shrink-0">
              
              <div className="bg-white rounded-xl p-4 shadow-2xs border border-gray-100/60">
                <h3 className="text-xs font-extrabold text-gray-800 font-outfit uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">
                  Summary & Checkout
                </h3>

                {/* Items in order list */}
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 border-b border-gray-100 pb-3 mb-3">
                  {cart.map((item) => (
                    <div key={item.product._id || item.product.id} className="flex gap-2 items-center">
                      <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded flex items-center justify-center p-1 shrink-0 overflow-hidden">
                        <img 
                          src={item.product.image || item.product.images?.[0]} 
                          alt={item.product.name} 
                          className="max-h-full max-w-full object-contain mix-blend-multiply" 
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0 leading-tight">
                        <p className="text-[10px] font-bold text-gray-700 truncate">{item.product.name}</p>
                        <span className="text-[9px] text-gray-400 font-semibold">Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-800 self-center">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Computations list */}
                <div className="flex flex-col gap-2 text-xs text-gray-600 border-b border-gray-100 pb-3 mb-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-400">Total Items Subtotal</span>
                    <span className="font-bold text-gray-800">₹{summary.subtotal.toLocaleString('en-IN')}.00</span>
                  </div>

                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>10% Member Discount</span>
                    <span className="font-bold">-₹{summary.discount.toLocaleString('en-IN')}.00</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-400">GST Tax (18% rate)</span>
                    <span className="font-bold text-gray-800">₹{summary.tax.toLocaleString('en-IN')}.00</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-400">Delivery Charge</span>
                    <span className="font-bold text-gray-800">
                      {summary.delivery === 0 ? 'FREE' : `₹${summary.delivery}.00`}
                    </span>
                  </div>
                </div>

                {/* Grand total price */}
                <div className="flex justify-between items-center text-sm font-extrabold text-gray-900 font-outfit mb-5">
                  <span className="text-gray-800 font-bold">Total Bill Amount</span>
                  <span className="text-base text-brand-red font-black">₹{summary.total.toLocaleString('en-IN')}.00</span>
                </div>

                {/* Place Order CTA */}
                <button
                  onClick={handlePlaceOrderSubmit}
                  className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-outfit font-bold rounded-lg px-4 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                >
                  <span>Place Order Receipt</span>
                  <FiArrowRight size={13} />
                </button>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* SECTION 3: Animated Success Modal */}
      <AnimatePresence>
        {showSuccessModal && placedOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl text-center relative border border-gray-100"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle size={32} />
              </div>

              <h2 className="text-base font-extrabold text-gray-800 font-outfit uppercase tracking-wider flex items-center justify-center gap-1.5">
                <span>Order Placed Successfully!</span>
                <FiSmile className="text-brand-red" />
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-semibold">Thank you for ordering with Orikam Healthcare.</p>

              {/* Order ID banner */}
              <div className="my-4 bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Transaction ID</span>
                <span className="text-sm font-black text-brand-red font-outfit">{placedOrderDetails.orderId || placedOrderDetails.id}</span>
              </div>

              {/* Details table brief */}
              <div className="text-xs text-gray-600 flex flex-col gap-1.5 border-t border-b border-gray-100 py-3 mb-5 text-left">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Shipping To</span>
                  <span className="font-bold text-gray-800 font-outfit">{(placedOrderDetails.shippingAddress || placedOrderDetails.address || {}).name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Total Items Purchased</span>
                  <span className="font-bold text-gray-800">{(placedOrderDetails.products || placedOrderDetails.items || []).length} Packages</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Final Bill Charged</span>
                  <span className="font-extrabold text-gray-900 font-outfit">₹{(placedOrderDetails.totalAmount || placedOrderDetails.total || 0).toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {/* Action CTA */}
              <button
                onClick={handleModalCloseRedirect}
                className="w-full bg-gray-900 hover:bg-black text-white font-outfit font-bold rounded-lg px-4 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm cursor-pointer transition-colors"
              >
                <span>Track Order / History</span>
                <FiArrowRight size={13} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
