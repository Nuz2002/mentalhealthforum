import { Link } from "react-router-dom";
import defaultProfilePic from "../assets/default-profile.png";
import { useState, useEffect, useRef } from "react";

const ExpertCard = ({ expert, currentUser }) => {
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const bioRef = useRef(null);
  
  const isSelf =
    currentUser &&
    expert &&
    (
      (currentUser.username?.toLowerCase() === expert.username?.toLowerCase()) ||
      (currentUser.email?.toLowerCase() === expert.email?.toLowerCase())
    );

  useEffect(() => {
    if (bioRef.current) {
      const isOverflowing = bioRef.current.scrollHeight > bioRef.current.clientHeight;
      setHasOverflow(isOverflowing);
    }
  }, [expert.bio]);


  return (
    <div className="max-w-sm bg-white rounded-xl overflow-hidden shadow-lg p-6 flex flex-col h-full border-2 border-blue-50 hover:border-teal-100 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl">
      <div className="flex-1">
        <div className="text-center">
          <div className="relative inline-block">
            <img
              className="h-28 w-28 rounded-full border-4 border-white shadow-lg object-cover"
              src={expert.photo || defaultProfilePic}
              alt={expert.name}
            />
            <span className="absolute bottom-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-teal-500 rounded-full p-1.5 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-gray-800">
            {expert.name}
          </h3>
          <p className="mt-1 text-blue-500 font-medium">@{expert.username}</p>
          {expert.profession && (
            <p className="mt-2 text-gray-600 font-medium text-lg">
              {expert.profession}
            </p>
          )}
        </div>

        <div className="mt-4">
          <p
            ref={bioRef}
            className={`text-center text-gray-600 text-sm leading-relaxed transition-all ${
              !isExpanded ? 'line-clamp-4' : 'line-clamp-none'
            }`}
          >
            {expert.bio || "Профессионал с большим опытом работы в своей области"}
          </p>
          
          {hasOverflow && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium mt-2 w-full text-center"
            >
              {isExpanded ? 'Свернуть' : 'Читать далее'}
            </button>
          )}
        </div>

        <div className="mt-6 text-center">
          <span className="inline-block text-sm font-semibold px-4 py-2 rounded-full bg-green-100 text-green-700 border border-green-200">
            Открыт для консультаций
          </span>
        </div>
      </div>

      {!isSelf && (
        <div className="mt-8 flex justify-center">
          <Link
            to={`/messages/${expert.username}`}
            state={{ user: expert }}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-center"
          >
            Написать сообщение
          </Link>
        </div>
      )}
    </div>
  );
};

export default ExpertCard;