// /src/components/Publications/NewPostCard.js
import React from 'react';
import VerifiedCheckmark from '../VerifiedCheckMark';
import defaultProfilePic from '../../assets/default-profile.png';

export default function NewPostCard({ user, newPost, setNewPost, handlePostSubmit }) {
  console.log(user.status)
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-blue-100">
      <div className="flex items-center mb-4">
        <div className='relative'>
          <img
            src={user.photo || defaultProfilePic}
            alt={user.name}
            className="w-11 h-11 rounded-full border-2 border-blue-100"
          />
          {user?.status && <VerifiedCheckmark />}
        </div>
        <div className="ml-3">
          <p className="font-bold text-blue-900">{user.name}</p>
          <p className="text-sm text-blue-600">@{user.username}</p>
        </div>
      </div>
      <textarea
        className="w-full p-3 bg-blue-50 rounded-lg border border-blue-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        rows="3"
        placeholder="Поделитесь своими мыслями..."
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
      />
      <button
        className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition-colors shadow-md"
        onClick={handlePostSubmit}
      >
        Опубликовать
      </button>
    </div>
  );
}
