import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { FiMapPin, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserAddressTab() {
  const { savedAddresses, addAddress, editAddress, deleteAddress, setDefaultAddress } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const handleOpenAdd = () => {
    setName('');
    setPhone('');
    setAddressLine('');
    setCity('');
    setPincode('');
    setEditingId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (addr) => {
    setName(addr.name);
    setPhone(addr.phone);
    setAddressLine(addr.addressLine);
    setCity(addr.city);
    setPincode(addr.pincode);
    setEditingId(addr._id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !addressLine || !city || !pincode) return;

    if (editingId) {
      editAddress(editingId, { name, phone, addressLine, city, pincode });
    } else {
      addAddress({ name, phone, addressLine, city, pincode });
    }
    
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="w-full text-left">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
        <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider font-outfit">
          Clinic Address Directories
        </h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1 bg-brand-red hover:bg-brand-red-hover text-white px-2.5 py-1.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors shadow-2xs font-outfit"
        >
          <FiPlus size={12} />
          <span>Add Address</span>
        </button>
      </div>

      {/* Address Form Container Drawer */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 flex flex-col gap-3"
          >
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-outfit">
              {editingId ? 'Edit Clinic Address' : 'Add New Clinic Address'}
            </h4>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Clinic Contact Person</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Olivia Rhye"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Address details (Street / Floor)</label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Road No 4, Banjara Hills"
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">City, State</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Hyderabad, Telangana"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 500034"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-white border border-gray-200 text-gray-500 px-3 py-1.5 rounded text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-red text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-brand-red-hover cursor-pointer"
                >
                  {editingId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {savedAddresses.map((addr) => (
          <div
            key={addr._id}
            className={`p-4 rounded-xl border flex flex-col justify-between min-h-[140px] relative transition-shadow ${
              addr.isDefault 
                ? 'border-brand-red bg-red-50/5 shadow-2xs' 
                : 'border-gray-200 hover:shadow-2xs'
            }`}
          >
            {/* Header / Default Tag */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-xs text-gray-800 font-outfit">{addr.name}</span>
                
                {addr.isDefault && (
                  <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Default Destination
                  </span>
                )}
              </div>
              <p className="text-[9px] font-bold text-gray-400">{addr.phone}</p>
              <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
                {addr.addressLine}, {addr.city} - {addr.pincode}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenEdit(addr)}
                  className="text-[10px] font-bold text-gray-400 hover:text-gray-900 cursor-pointer flex items-center gap-1"
                >
                  <FiEdit2 size={10} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deleteAddress(addr._id)}
                  className="text-[10px] font-bold text-gray-400 hover:text-brand-red cursor-pointer flex items-center gap-1"
                >
                  <FiTrash2 size={10} />
                  <span>Delete</span>
                </button>
              </div>

              {!addr.isDefault && (
                <button
                  onClick={() => setDefaultAddress(addr._id)}
                  className="text-[10px] font-extrabold text-brand-red hover:text-brand-red-hover cursor-pointer"
                >
                  Set as Default
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
