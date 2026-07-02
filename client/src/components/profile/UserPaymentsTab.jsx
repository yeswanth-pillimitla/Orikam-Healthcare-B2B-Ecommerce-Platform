import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { FiPlus, FiTrash2, FiCreditCard, FiSmartphone, FiHome, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserPaymentsTab() {
  const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = useContext(AppContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState('Card'); // 'Card' | 'UPI' | 'Bank'

  // Card input states
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');

  // UPI input states
  const [upiHandle, setUpiHandle] = useState('');

  // Bank input states
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newType === 'Card') {
      if (!cardHolder || !cardNumber || !cardExpiry) return;
      const last4 = cardNumber.slice(-4) || '1111';
      addPaymentMethod({
        type: 'Card',
        cardType: 'MasterCard',
        last4,
        cardHolder,
        expiry: cardExpiry
      });
    } else if (newType === 'UPI') {
      if (!upiHandle) return;
      addPaymentMethod({
        type: 'UPI',
        handle: upiHandle
      });
    } else if (newType === 'Bank') {
      if (!bankName || !bankAccountNumber) return;
      const masked = '******' + bankAccountNumber.slice(-4);
      addPaymentMethod({
        type: 'Bank',
        bankName,
        accountNumber: masked
      });
    }

    // Reset forms
    setCardHolder('');
    setCardNumber('');
    setCardExpiry('');
    setUpiHandle('');
    setBankName('');
    setBankAccountNumber('');
    setShowAddForm(false);
  };

  return (
    <div className="w-full text-left">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
        <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider font-outfit">
          Saved Payment Methods
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 bg-brand-red hover:bg-brand-red-hover text-white px-2.5 py-1.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors shadow-2xs font-outfit"
        >
          <FiPlus size={12} />
          <span>Add Method</span>
        </button>
      </div>

      {/* Add Payment Method Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 flex flex-col gap-3"
          >
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-outfit">Add Corporate Payment Credentials</h4>
            
            {/* Selector tabs */}
            <div className="flex border border-gray-200 rounded-lg p-0.5 bg-white max-w-xs gap-0.5">
              {['Card', 'UPI', 'Bank'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewType(t)}
                  className={`flex-1 py-1 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                    newType === t ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Form Option 1: Card */}
              {newType === 'Card' && (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="e.g. DR. OLIVIA RHYE"
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="xxxx xxxx xxxx xxxx"
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Expiration Date</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-28 px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Form Option 2: UPI */}
              {newType === 'UPI' && (
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">UPI ID / VPA Handle</label>
                  <input
                    type="text"
                    required
                    value={upiHandle}
                    onChange={(e) => setUpiHandle(e.target.value)}
                    placeholder="e.g. oliviarhye@oksbi"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                </div>
              )}

              {/* Form Option 3: Bank */}
              {newType === 'Bank' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Bank Name</label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. ICICI Bank"
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Account Number</label>
                    <input
                      type="text"
                      required
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      placeholder="e.g. 1002394832"
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end mt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-white border border-gray-200 text-gray-500 px-3 py-1.5 rounded text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-red text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-brand-red-hover cursor-pointer"
                >
                  Add Credentials
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment methods cards list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {paymentMethods.map((pm) => {
          const id = pm._id || pm.id;
          return (
            <div
              key={id}
              className={`p-4 rounded-xl border flex flex-col justify-between min-h-[140px] relative transition-shadow ${
                pm.isDefault 
                  ? 'border-brand-red bg-red-50/5 shadow-2xs' 
                  : 'border-gray-200 hover:shadow-2xs bg-white'
              }`}
            >
              {/* Visual Icon card header details */}
              <div className="flex justify-between items-start">
                <span className="p-1.5 bg-gray-50 rounded-lg text-gray-400 border border-gray-100 shrink-0">
                  {pm.type === 'Card' ? (
                    <FiCreditCard size={18} className="text-[#1A1F71]" />
                  ) : pm.type === 'UPI' ? (
                    <FiSmartphone size={18} className="text-[#097969]" />
                  ) : (
                    <FiHome size={18} className="text-[#0066b2]" />
                  )}
                </span>

                {pm.isDefault && (
                  <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Default Payment
                  </span>
                )}
              </div>

              {/* Middle body info */}
              <div className="text-left mt-3">
                {pm.type === 'Card' ? (
                  <>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{pm.cardType} Card</span>
                    <span className="text-sm font-extrabold text-gray-800 font-outfit mt-0.5 block">•••• •••• •••• {pm.last4}</span>
                    <span className="text-[9px] font-bold text-gray-400 mt-1 block">Exp: {pm.expiry}</span>
                  </>
                ) : pm.type === 'UPI' ? (
                  <>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">BHIM UPI Profile</span>
                    <span className="text-xs font-extrabold text-gray-800 font-outfit mt-0.5 block truncate">{pm.handle}</span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{pm.bankName} Account</span>
                    <span className="text-xs font-extrabold text-gray-800 font-outfit mt-0.5 block">{pm.accountNumber}</span>
                  </>
                )}
              </div>

              {/* Footer triggers */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
                <button
                  onClick={() => removePaymentMethod(id)}
                  className="text-[10px] font-bold text-gray-400 hover:text-brand-red cursor-pointer flex items-center gap-1"
                >
                  <FiTrash2 size={10} />
                  <span>Delete</span>
                </button>

                {!pm.isDefault && (
                  <button
                    onClick={() => setDefaultPaymentMethod(id)}
                    className="text-[10px] font-extrabold text-brand-red hover:text-brand-red-hover cursor-pointer"
                  >
                    Set default
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
