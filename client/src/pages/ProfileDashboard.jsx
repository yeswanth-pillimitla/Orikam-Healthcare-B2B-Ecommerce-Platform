import React, { useContext, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryNavbar from '../components/CategoryNavbar';
import { AppContext } from '../context/AppContext';
import UserAvatar from '../components/UserAvatar';
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiCreditCard,
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Import sub tab components
import UserProfileTab from '../components/profile/UserProfileTab';
import UserOrdersTab from '../components/profile/UserOrdersTab';
import UserWishlistTab from '../components/profile/UserWishlistTab';
import UserAddressTab from '../components/profile/UserAddressTab';
import UserPaymentsTab from '../components/profile/UserPaymentsTab';
import UserNotificationsTab from '../components/profile/UserNotificationsTab';
import UserSettingsTab from '../components/profile/UserSettingsTab';
import UserSupportTab from '../components/profile/UserSupportTab';

export default function ProfileDashboard() {
  const {
    user,
    activeProfileTab,
    setActiveProfileTab,
    navigateTo,
    notifications,
    logout
  } = useContext(AppContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // If user is logged out, redirect home
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans gap-2 text-left">
        <Header />
        <main className="flex-1 flex flex-col gap-2 pb-2">
          <CategoryNavbar />
          <div className="max-w-[1440px] mx-auto w-full bg-white rounded-xl p-12 shadow-2xs border border-gray-100/60 text-center flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-brand-red mb-3">
              <FiUser size={24} />
            </div>
            <h3 className="text-sm font-bold text-gray-800 font-outfit uppercase tracking-wide">Access Denied</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs font-medium">Please log in to your account to view your professional clinical dashboard details.</p>
            <button
              onClick={() => navigateTo('home')}
              className="mt-5 bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              Go to Home Page
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tabItems = [
    { key: 'profile', label: 'My Profile', icon: <FiUser size={13} /> },
    { key: 'orders', label: 'My Orders', icon: <FiShoppingBag size={13} /> },
    { key: 'wishlist', label: 'Wishlist', icon: <FiHeart size={13} /> },
    { key: 'addresses', label: 'Saved Address', icon: <FiMapPin size={13} /> },
    { key: 'payments', label: 'Payment Methods', icon: <FiCreditCard size={13} /> },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: <FiBell size={13} />,
      badge: notifications.filter(n => !n.read).length
    },
    { key: 'settings', label: 'Account Settings', icon: <FiSettings size={13} /> },
    { key: 'support', label: 'Help & Support', icon: <FiHelpCircle size={13} /> }
  ];

  const renderActiveTab = () => {
    switch (activeProfileTab) {
      case 'profile':
        return <UserProfileTab />;
      case 'orders':
        return <UserOrdersTab />;
      case 'wishlist':
        return <UserWishlistTab />;
      case 'addresses':
        return <UserAddressTab />;
      case 'payments':
        return <UserPaymentsTab />;
      case 'notifications':
        return <UserNotificationsTab />;
      case 'settings':
        return <UserSettingsTab />;
      case 'support':
        return <UserSupportTab />;
      default:
        return <UserProfileTab />;
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans gap-2 text-left relative">
      <Header />

      <main className="flex-1 flex flex-col gap-2 pb-2">
        <CategoryNavbar />

        {/* Breadcrumb Navigation */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto bg-white rounded-xl p-3 shadow-2xs">
            <nav className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span onClick={() => navigateTo('home')} className="hover:text-brand-red cursor-pointer">Home</span>
              <span>/</span>
              <span className="text-gray-600">My Account Dashboard</span>
            </nav>
          </div>
        </section>

        {/* Profile Split Layout Grid */}
        <section className="w-full px-4 md:px-6 py-1">
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-3 items-start">

            {/* Left: Sidebar Navigation */}
            <aside className="w-full lg:w-64 bg-white rounded-xl p-4 shadow-2xs shrink-0 border border-gray-100/60 flex flex-col gap-5 text-left">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <UserAvatar
                  user={user}
                  sizeClass="w-10 h-10"
                  className="border border-gray-200 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs text-gray-800 font-outfit truncate">{user.name}</h4>
                  <span className="text-[9px] text-gray-400 font-bold block truncate mt-0.5">{user.email}</span>
                </div>
              </div>

              {/* Links List */}
              <div className="flex flex-col gap-1">
                {tabItems.map((item) => {
                  const isActive = activeProfileTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveProfileTab(item.key)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-outfit ${isActive
                          ? 'bg-red-50 text-brand-red shadow-2xs'
                          : 'text-gray-600 hover:bg-gray-50/50 hover:text-gray-900'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-brand-red' : 'text-gray-400'}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>

                      {item.badge && item.badge > 0 ? (
                        <span className="bg-brand-red text-white text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                          {item.badge}
                        </span>
                      ) : (
                        <FiChevronRight size={10} className="text-gray-300" />
                      )}
                    </button>
                  );
                })}

                {/* Separator & Logout button */}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-brand-red hover:bg-red-50/50 rounded-lg transition-all cursor-pointer font-outfit"
                  >
                    <FiLogOut size={13} className="shrink-0" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Right: Selected Tab Content view panel */}
            <div className="flex-1 w-full bg-white rounded-xl p-4 md:p-6 shadow-2xs border border-gray-100/60 min-h-[460px] flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProfileTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex"
                >
                  {renderActiveTab()}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

      </main>

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

      <Footer />
    </div>
  );
}
