import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { FiEdit2, FiSave, FiX, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import UserAvatar from '../UserAvatar';

export default function UserProfileTab() {
  const { user, updateProfile } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const fileInputRef = useRef(null);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [clinicName, setClinicName] = useState(user?.clinicName || '');
  const [gstin, setGstin] = useState(user?.gstin || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || user?.avatar || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Please choose an image under 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
    setTimeout(() => {
      handleTriggerFileSelect();
    }, 50);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, phone, email, clinicName, gstin, profileImage });
    setIsEditing(false);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  const handleCancel = () => {
    // Revert form state values
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setEmail(user?.email || '');
    setClinicName(user?.clinicName || '');
    setGstin(user?.gstin || '');
    setProfileImage(user?.profileImage || user?.avatar || '');
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start text-left w-full">
      
      {/* Left: Summary Profile Photo Card */}
      <div className="w-full lg:w-72 bg-gray-50/50 p-4 rounded-xl border border-gray-100 shrink-0 text-center flex flex-col items-center">
        <div className="relative mb-3">
          <UserAvatar
            user={user}
            overrideImage={profileImage}
            sizeClass="w-24 h-24"
            className="border-2 border-brand-red shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
            onClick={handleAvatarClick}
          />
          {isEditing && (
            <button
              type="button"
              onClick={handleTriggerFileSelect}
              className="absolute bottom-0 right-0 bg-brand-red text-white p-1.5 rounded-full text-[9px] font-extrabold cursor-pointer border border-white hover:bg-brand-red-hover shadow-xs flex items-center justify-center"
            >
              EDIT
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        
        <h3 className="font-extrabold text-sm text-gray-800 font-outfit">{user?.name}</h3>
        <span className="text-[10px] text-gray-400 font-semibold">{user?.email}</span>
        
        <div className="w-full border-t border-gray-100 my-4 pt-3 text-left flex flex-col gap-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400 font-semibold">Tier Level</span>
            <span className="text-amber-600 font-extrabold font-outfit uppercase">Gold Member</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400 font-semibold">B2B Account</span>
            <span className="text-emerald-600 font-extrabold font-outfit uppercase">{user?.role}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400 font-semibold">Orikam Points</span>
            <span className="text-gray-700 font-extrabold font-outfit">579 Pts</span>
          </div>
        </div>

        {/* Saved Toast Alert */}
        {showSavedMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded w-full justify-center"
          >
            <FiCheckCircle size={11} />
            <span>Profile Changes Saved!</span>
          </motion.div>
        )}
      </div>

      {/* Right: Editable forms sections */}
      <form onSubmit={handleSave} className="flex-1 w-full bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-2xs">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider font-outfit">
            Account Information
          </h2>
          
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-[10px] font-extrabold text-brand-red uppercase cursor-pointer"
            >
              <FiEdit2 size={11} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase cursor-pointer"
              >
                <FiX size={11} />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 uppercase cursor-pointer"
              >
                <FiSave size={11} />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>

        {/* Input fields grids */}
        <div className="flex flex-col gap-4">
          
          {/* Section 1: Personal info */}
          <div>
            <h4 className="text-[10px] font-extrabold text-gray-800 uppercase tracking-wide mb-2 font-outfit">Personal Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Full Representative Name</label>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Mobile Contact Phone</label>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-[10px] font-extrabold text-gray-800 uppercase tracking-wide mb-2 font-outfit">Contact Info</h4>
            <div>
              <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Corporate Email Address</label>
              <input
                type="email"
                required
                disabled={!isEditing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Section 3: Clinic / Business Info */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-[10px] font-extrabold text-gray-800 uppercase tracking-wide mb-2 font-outfit">Clinic Business details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Dental Clinic Name</label>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">GSTIN Number (Tax Exemption)</label>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed uppercase"
                />
              </div>
            </div>
          </div>

        </div>
      </form>

    </div>
  );
}
