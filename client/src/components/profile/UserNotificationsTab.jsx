import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { FiBell, FiTrash2, FiCheck, FiShoppingBag, FiTag, FiUser, FiMail } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserNotificationsTab() {
  const { 
    notifications, 
    markNotificationRead, 
    deleteNotification, 
    markAllNotificationsRead 
  } = useContext(AppContext);

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <FiShoppingBag size={14} className="text-brand-red" />;
      case 'offer':
        return <FiTag size={14} className="text-amber-500" />;
      case 'account':
        return <FiUser size={14} className="text-blue-500" />;
      default:
        return <FiMail size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="w-full text-left">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
        <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider font-outfit">
          Notification Center
        </h2>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllNotificationsRead}
            className="text-[10px] font-extrabold text-brand-red uppercase cursor-pointer"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {notifications.map((n) => (
              <motion.div
                key={n._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={`p-3 md:p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                  n.read 
                    ? 'bg-white border-gray-100/80 opacity-70' 
                    : 'bg-red-50/5 border-red-100/50 shadow-2xs'
                }`}
              >
                {/* Icon wrapper & Text block */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100/60 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  
                  <div className="text-left min-w-0 leading-tight">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-gray-800 font-outfit truncate">{n.title}</h4>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1.5 uppercase font-outfit">{n.date}</span>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-1.5 shrink-0 self-start">
                  {!n.read && (
                    <button
                      onClick={() => markNotificationRead(n._id)}
                      className="w-7 h-7 rounded-full text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center cursor-pointer transition-colors"
                      title="Mark as Read"
                    >
                      <FiCheck size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n._id)}
                    className="w-7 h-7 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center cursor-pointer transition-colors"
                    title="Delete Notification"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-gray-50/50 rounded-xl p-8 border border-gray-100/60 text-center flex flex-col items-center justify-center min-h-[250px]">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-brand-red mb-3">
            <FiBell size={20} />
          </div>
          <h4 className="text-xs font-bold text-gray-800 font-outfit uppercase tracking-wide">All Caught Up!</h4>
          <p className="text-[11px] text-gray-400 mt-1 max-w-xs font-medium">You don't have any pending notification updates or B2B promo alerts.</p>
        </div>
      )}

    </div>
  );
}
