import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiCreditCard,
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiLogOut
} from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import UserAvatar from './UserAvatar';

export default function ProfileDropdown({ onClose, onTriggerLogout }) {
  const { user, navigateTo, setActiveProfileTab, notifications } = useContext(AppContext);

  if (!user) return null;

  const isElevated = user.role === 'Admin' || user.role === 'Super Admin';

  const menuItems = [
    ...(isElevated ? [{ label: 'Admin Dashboard', tab: 'admin', icon: <FiSettings size={13} className="text-amber-500 shrink-0" /> }] : []),
    { label: 'My Profile', tab: 'profile', icon: <FiUser size={13} /> },
    { label: 'My Orders', tab: 'orders', icon: <FiShoppingBag size={13} /> },
    { label: 'Wishlist', tab: 'wishlist', icon: <FiHeart size={13} /> },
    { label: 'Saved Address', tab: 'addresses', icon: <FiMapPin size={13} /> },
    { label: 'Payment Methods', tab: 'payments', icon: <FiCreditCard size={13} /> },
    {
      label: 'Notifications',
      tab: 'notifications',
      icon: <FiBell size={13} />,
      badgeCount: notifications.filter(n => !n.read).length
    },
    { label: 'Account Settings', tab: 'settings', icon: <FiSettings size={13} /> },
    { label: 'Help & Support', tab: 'support', icon: <FiHelpCircle size={13} /> }
  ];

  const handleItemClick = (item) => {
    if (item.tab === 'admin') {
      navigateTo('admin');
    } else {
      setActiveProfileTab(item.tab);
      navigateTo('profile');
    }
    onClose();
  };

  const handleLogoutClick = () => {
    onClose();
    onTriggerLogout();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-[110%] mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden text-left"
    >
      {/* User Information Header */}
      <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
        <UserAvatar
          user={user}
          sizeClass="w-10 h-10"
          className="border border-gray-200 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-xs text-gray-800 truncate font-outfit">{user.name}</span>
            <span className="bg-red-50 text-brand-red text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0">
              {user.role}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold truncate block mt-0.5">{user.email}</span>
        </div>
      </div>

      {/* Menu Links */}
      <div className="py-1 max-h-[300px] overflow-y-auto pr-1">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleItemClick(item)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-gray-400 shrink-0">{item.icon}</span>
              <span className="font-outfit">{item.label}</span>
            </div>

            {/* Optional notifications count badge */}
            {item.badgeCount !== undefined && item.badgeCount > 0 ? (
              <span className="bg-brand-red text-white text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {item.badgeCount}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Logout Row */}
      <div className="border-t border-gray-100 bg-gray-50/20 py-1">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-brand-red hover:bg-red-50/50 transition-colors cursor-pointer font-outfit"
        >
          <FiLogOut size={13} className="shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </motion.div>
  );
}
