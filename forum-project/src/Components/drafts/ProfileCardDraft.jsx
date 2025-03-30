// import { Link } from 'react-router-dom';
// import { useEffect } from 'react';

// const ProfileCard = ({ user, onClose, isLoading }) => {
  
//   if (!user || user.accountType !== true) return null;

  

//   return (
//     <div className="profile-card-overlay">
//       {isLoading ? (
//         <div className="loading-spinner">Loading profile...</div>
//       ) : (
//         <div 
//       className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div 
//         className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-blue-900 hover:text-teal-600 text-xl"
//         >
//           &times;
//         </button>
//         <div className="flex flex-col items-center text-center">
//           <img
//             src={user.photo}
//             alt={user.name}
//             className="w-32 h-32 rounded-full mb-4 ring-2 ring-teal-500 object-cover"
//           />
//           <h2 className="text-2xl font-bold text-blue-900 mb-2">{user.name}</h2>
//           <p className="text-blue-600 mb-2">@{user.username}</p>
//           {user.profession && (
//             <p className="text-blue-900 font-medium mb-4">{user.profession}</p>
//           )}
//           {user.bio && (
//             <p className="text-blue-700 mb-6 px-4">{user.bio}</p>
//           )}
//           <Link
//             to={`/messages/${user.username}`}
//             className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition-colors"
//           >
//             Message
//           </Link>
//         </div>
//       </div>
//     </div>
//       )}
//     </div>
    
//   );
// };

// export default ProfileCard;
