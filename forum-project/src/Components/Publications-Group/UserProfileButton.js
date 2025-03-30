import React from 'react';
import defaultProfilePic from '../../assets/default-profile.png';
import PropTypes from 'prop-types';
import VerifiedCheckmark from '../VerifiedCheckMark';

export default function UserProfileButton({ user, onClick }) {
  // Enhanced null check for nested properties
  const safeUser = user || {};
  const isPublic = safeUser.accountType === true;
  const username = safeUser.username || 'unknown';
  const displayName = safeUser.name || 'Неизвестный пользователь';

  const profilePic = user?.photo 
  ? user.photo.startsWith('http') 
      ? user.photo  // Use existing http URLs
      : `${import.meta.env.VITE_API_BASE_URL}${user.photo}` 
  : defaultProfilePic;

  // Cursor/opacity/hover styles
  const baseClasses = 'inline-flex items-center transition-colors rounded-full';
  const clickableClasses = isPublic
    ? 'cursor-pointer hover:bg-blue-100 p-1'
    : 'cursor-default'; 

  const handleClick = () => {
    if (isPublic && onClick) {
      console.log('[UserProfileButton] Clicked:', user.username);
      onClick(user);
    }
  };

  // Add this propTypes definition right after the component function
UserProfileButton.propTypes = {
  user: PropTypes.shape({
    accountType: PropTypes.bool,
    username: PropTypes.string,
    name: PropTypes.string,
    photo: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

return (
  <button
    className={`${baseClasses} ${clickableClasses}`}
    onClick={handleClick}
    disabled={!isPublic}
    aria-label={isPublic ? `View ${displayName} profile` : undefined}
  >
    <div className="relative">
      <img
        src={profilePic}
        alt={`${username}'s avatar`}
        className="w-11 h-11 rounded-full border border-blue-200"
        onError={(e) => {
          e.target.src = defaultProfilePic;
        }}
      />
      {user?.status && <VerifiedCheckmark />}
    </div>
  </button>
);

}
