import React, { useState } from 'react';
import { FiLock, FiSettings, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function UserSettingsTab() {
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference states
  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('INR');
  const [theme, setTheme] = useState('Light');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation password do not match!");
      return;
    }

    // Success simulation
    setShowPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setShowPasswordSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start text-left w-full">
      
      {/* Left Column: Security Settings */}
      <form onSubmit={handlePasswordChange} className="w-full md:w-1/2 bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-2xs">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
          <FiLock className="text-brand-red" size={13} />
          <h2 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider font-outfit">
            Security Settings
          </h2>
        </div>

        {/* Change password inputs */}
        <div className="flex flex-col gap-3.5 mb-5">
          <div>
            <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        {/* Action Trigger */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer font-outfit"
          >
            Change Password
          </button>
          
          {showPasswordSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded"
            >
              <FiCheckCircle size={12} />
              <span>Password Changed!</span>
            </motion.div>
          )}
        </div>

        {/* 2FA Toggle Switch */}
        <div className="border-t border-gray-100 pt-4 mt-6 flex items-center justify-between">
          <div className="leading-tight">
            <span className="text-xs font-bold text-gray-800 font-outfit block">Two-Factor Authentication (2FA)</span>
            <span className="text-[9px] text-gray-400 font-semibold mt-0.5 block">Enhance clinical account safety using SMS OTP.</span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={twoFactor} 
              onChange={() => setTwoFactor(!twoFactor)}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

      </form>

      {/* Right Column: Preferences Settings */}
      <div className="w-full md:w-1/2 bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-2xs">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
          <FiSettings className="text-brand-red" size={13} />
          <h2 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider font-outfit">
            System Preferences
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="leading-none text-left">
              <span className="text-xs font-bold text-gray-800 font-outfit block">Interface Theme Mode</span>
              <span className="text-[9px] text-gray-400 font-semibold mt-1 block">Toggle light or dark styling templates.</span>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option>Light</option>
              <option>Dark</option>
              <option>System Default</option>
            </select>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="leading-none text-left">
              <span className="text-xs font-bold text-gray-800 font-outfit block">Preferred Language</span>
              <span className="text-[9px] text-gray-400 font-semibold mt-1 block">Clinic workspace rendering language.</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Telugu</option>
              <option>Tamil</option>
            </select>
          </div>

          {/* Currency */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="leading-none text-left">
              <span className="text-xs font-bold text-gray-800 font-outfit block">Pricing Currency</span>
              <span className="text-[9px] text-gray-400 font-semibold mt-1 block">Billing currency calculation format.</span>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option>INR (₹)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
}
