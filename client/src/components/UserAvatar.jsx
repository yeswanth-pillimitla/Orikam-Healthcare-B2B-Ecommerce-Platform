import React, { useState, useEffect } from 'react';

export default function UserAvatar({ user, sizeClass = "w-10 h-10", className = "", onClick, overrideImage }) {
  const [imgError, setImgError] = useState(false);
  const name = user?.name || "";
  const imageUrl = overrideImage !== undefined ? overrideImage : (user?.profileImage || user?.avatar);

  // Reset image error state if the image url changes
  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const getInitials = (userName) => {
    if (!userName) return "?";
    return userName.slice(0, 2).toUpperCase();
  };

  const getAvatarBg = (userName) => {
    if (!userName) return "#E2E8F0"; // fallback neutral slate-200
    const colors = [
      '#EF4444', // Red
      '#F59E0B', // Amber
      '#10B981', // Emerald
      '#3B82F6', // Blue
      '#6366F1', // Indigo
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#14B8A6'  // Teal
    ];
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const renderInitials = () => {
    let textSize = "text-xs";
    if (sizeClass.includes("w-24")) {
      textSize = "text-3xl font-extrabold";
    } else if (sizeClass.includes("w-11")) {
      textSize = "text-sm font-extrabold";
    } else {
      textSize = "text-xs font-extrabold";
    }

    return (
      <div
        className={`${sizeClass} ${className} rounded-full flex items-center justify-center text-white select-none shrink-0`}
        style={{ backgroundColor: getAvatarBg(name) }}
        onClick={onClick}
      >
        <span className={`${textSize} tracking-wider font-outfit`}>
          {getInitials(name)}
        </span>
      </div>
    );
  };

  if (!imageUrl || imgError) {
    return renderInitials();
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      onError={() => setImgError(true)}
      className={`${sizeClass} ${className} rounded-full object-cover shrink-0`}
      onClick={onClick}
    />
  );
}
