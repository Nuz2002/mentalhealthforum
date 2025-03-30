import { Link } from 'react-router-dom';
import defaultProfilePic from '../../assets/default-profile.png';

const ProfileCard = ({ user, currentUser, onClose, isLoading }) => {
  if (!user || user.accountType !== true) return null;

  const isOwnProfile = currentUser?.username === user.username;

  return (
    <div className="profile-card-overlay">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600"></div>
        </div>
      ) : (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-teal-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              aria-label="Закрыть"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <img
                  src={user.photo || defaultProfilePic}
                  alt={user.name}
                  className="w-36 h-36 rounded-full mb-2 border-4 border-teal-100 shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-teal-50 transition-all duration-300" />
              </div>

              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h2>
                <p className="text-lg text-teal-600 font-medium mb-2">@{user.username}</p>
                {user.profession && (
                  <p className="text-gray-600 font-semibold flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{user.profession}</span>
                  </p>
                )}
              </div>

              {user.bio && (
                <div className="w-full">
                  <div className="border-t border-gray-100 my-4" />
                  <p className="text-gray-600 text-lg leading-relaxed px-4 italic">
                    «{user.bio}»
                  </p>
                </div>
              )}

              {!isOwnProfile && (
                <div className="w-full pt-6">
                  <Link
                    to={`/messages/${user.username}`}
                    state={{ user }}
                    className="block w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-teal-100"
                  >
                    Написать сообщение
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
