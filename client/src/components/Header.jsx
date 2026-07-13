import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronDown, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import ProfileDropdown from './ProfileDropdown';
import UserAvatar from './UserAvatar';

export default function Header() {
  const { navigateTo, handleSearchSubmit, getCartSummary, user, login, logout, searchQuery } = useContext(AppContext);
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  useEffect(() => {
    setLocalSearch(searchQuery || '');
  }, [searchQuery]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { total, totalCount } = getCartSummary();

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(localSearch);
    }
  };

  const handleSearchIconClick = () => {
    handleSearchSubmit(localSearch);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white px-4 md:px-6 py-2.5 sm:py-3 shadow-2xs text-left">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2.5 sm:gap-4">

        {/* Left: Orikam Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <div onClick={() => navigateTo('home')} className="cursor-pointer">
            <img src="/Logo.png" alt="Orikam Logo" className="h-8 sm:h-11 object-contain" />
          </div>

        </div>

        {/* Middle: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <div 
            onClick={handleSearchIconClick} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
          >
            <FiSearch size={20} />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            placeholder="Search for products, brands and more..."
            className="w-full pl-10 pr-10 py-3 bg-gray-50 rounded-lg text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all duration-200"
          />
        </div>

        {/* Right: User Profile & Cart */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">

          {/* User Profile */}
          {user ? (
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-10 sm:h-11 flex items-center gap-1.5 sm:gap-2 cursor-pointer pr-2 sm:pr-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 pl-1 shrink-0"
              >
                <UserAvatar
                  user={user}
                  sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                  className="border border-gray-200"
                />
                <div className="hidden sm:flex flex-col text-left justify-center leading-tight">
                  <div className="flex items-center gap-0.5">
                    <span className="text-xs font-bold text-gray-700">{user.name}</span>
                    <FiChevronDown size={11} className="text-gray-400" />
                  </div>
                  <span className="text-[9px] font-black text-brand-red uppercase leading-none">{user.role}</span>
                </div>
              </motion.div>
 
              <AnimatePresence>
                {dropdownOpen && (
                  <ProfileDropdown 
                    onClose={() => setDropdownOpen(false)} 
                    onTriggerLogout={() => setShowLogoutConfirm(true)}
                  />
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigateTo('auth')}
              className="h-10 sm:h-11 bg-gray-900 hover:bg-black text-white px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 sm:gap-2 font-outfit justify-center whitespace-nowrap shrink-0 border-none outline-none"
            >
              <FiUser size={14} className="shrink-0" />
              <span>Log In</span>
            </button>
          )}
 
          {/* Cart Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateTo('cart')}
            className="h-10 sm:h-11 flex items-center gap-2 sm:gap-2.5 bg-brand-red hover:bg-brand-red-hover text-white px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all duration-200 cursor-pointer justify-center whitespace-nowrap shrink-0 border-none outline-none"
          >
            <FiShoppingCart size={14} className="shrink-0" />
            <div className="flex flex-col items-start leading-none gap-0.5 text-left">
              <span className="text-[9px] font-medium text-white/95">{totalCount} {totalCount === 1 ? 'Item' : 'Items'}</span>
              <span className="text-[10px] sm:text-[12px] font-bold whitespace-nowrap">₹{total.toLocaleString('en-IN')}.00</span>
            </div>
          </motion.button>

        </div>
      </div>

      {/* Logout Confirmation Modal Overlay */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl text-center border border-gray-100"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 text-brand-red flex items-center justify-center mx-auto mb-3">
                <FiLogOut size={22} />
              </div>
              <h3 className="text-sm font-extrabold text-gray-800 font-outfit uppercase tracking-wider">Confirm Session Logout</h3>
              <p className="text-xs text-gray-400 mt-1 font-semibold">Are you sure you want to end your current session? This will reset your wishlist and active cart contents.</p>
              
              <div className="flex gap-2.5 mt-5">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 bg-brand-red text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-brand-red-hover cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Search Bar */}
      <div className="mt-3 md:hidden relative">
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={handleSearchKeyPress}
          placeholder="Search for products, brands and more..."
          className="w-full pl-4 pr-10 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300"
        />
        <div 
          onClick={handleSearchIconClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
        >
          <FiSearch size={18} />
        </div>
      </div>
    </header>
  );
}
