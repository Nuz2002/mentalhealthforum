import { NavLink } from "react-router-dom";
import { useState, useEffect } from 'react';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  deleteProfilePicture
} from '../api-calls/profileApi';
import defaultProfilePic from '../assets/default-profile.png';

const ProfileSettings = () => {
  const [fileInput, setFileInput] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    profession: '',
    accountType: '',
    bio: '',
    photo: ''
  });
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [originalProfile, setOriginalProfile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const userType = localStorage.getItem('userType');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile();
        const formattedData = {
          username: data.username,
          profession: data.profession,
          accountType: data.accountType ? 'public' : 'private',
          bio: data.bio,
          photo: data.photo
        };
        setProfileData(formattedData);
        setOriginalProfile(formattedData);
      } catch (err) {
        setError('Не удалось загрузить профиль');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();

    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handlePictureChange = () => {
    fileInput.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);

      const { photoUrl } = await uploadProfilePicture(file);
      setProfileData(prev => ({ ...prev, photo: photoUrl }));
    } catch (err) {
      setError('Не удалось загрузить фото профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePicture = async () => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить фото профиля?');
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      await deleteProfilePicture();
      setProfileData(prev => ({ ...prev, photo: '' }));
      setPreviewImage('');
    } catch (err) {
      setError('Не удалось удалить фото профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');

    if (JSON.stringify(profileData) === JSON.stringify(originalProfile)) {
      setSuccessMessage('Нет изменений для сохранения.');
      return;
    }

    try {
      setIsLoading(true);
      const updatedProfile = await updateUserProfile({
        ...profileData,
        accountType: profileData.accountType === 'public'
      });

      const updatedData = {
        ...updatedProfile,
        accountType: updatedProfile.accountType ? 'public' : 'private'
      };

      setProfileData(updatedData);
      setOriginalProfile(updatedData);
      setSuccessMessage('Изменения сохранены!');
    } catch (err) {
      setError('Не удалось обновить профиль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 w-full flex flex-col md:flex-row gap-5 px-3 md:px-8 lg:px-16 xl:px-28 text-blue-900 min-h-screen">
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="md:hidden p-3 bg-teal-600 text-white rounded-lg self-start mt-4"
      >
        {showMobileMenu ? 'Закрыть меню' : 'Меню настроек'}
      </button>

      <aside className={`${showMobileMenu ? 'block' : 'hidden'} md:block py-4 w-full md:w-1/3 lg:w-1/4`}>
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-b md:border-r border-blue-100 top-12">
          <h2 className="pl-3 mb-4 text-xl md:text-2xl font-bold text-blue-900">Настройки</h2>
          <NavLink
            to="/profile-settings"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 font-medium rounded-xl transition-colors shadow-sm ${
                isActive ? 'bg-teal-600 text-white' : 'text-blue-700 hover:bg-blue-50'
              }`
            }
            onClick={() => setShowMobileMenu(false)}
          >
            Публичный профиль
          </NavLink>
          {userType === 'SPECIALIST' && (
            <NavLink
              to="/become-expert"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 font-medium rounded-xl transition-colors shadow-sm ${
                  isActive ? 'bg-teal-600 text-white' : 'text-blue-700 hover:bg-blue-50'
                }`
              }
              onClick={() => setShowMobileMenu(false)}
            >
              Пройти верификацию
            </NavLink>
          )}
        </div>
      </aside>

      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="w-full px-2 md:px-6 pb-8 mt-4 sm:max-w-xl sm:rounded-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-6 border-b-2 border-blue-100 pb-3">
              Публичный профиль
            </h2>

            {successMessage && (
              <p className="mb-6 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded p-3">
                {successMessage}
              </p>
            )}
            {error && (
              <p className="mb-6 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded p-3">
                {error}
              </p>
            )}

            <div className="max-w-2xl mx-auto mt-4 md:mt-8">
              <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                <div className="relative">
                  <img
                    className="object-cover w-32 h-32 sm:w-40 sm:h-40 p-1 rounded-full ring-2 ring-teal-500 shadow-md"
                    src={previewImage || profileData.photo || defaultProfilePic}
                    alt="Профиль"
                  />
                  <div
                    className="absolute bottom-0 right-0 bg-teal-500 p-1 sm:p-2 rounded-full shadow-lg cursor-pointer"
                    onClick={handlePictureChange}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    ref={input => setFileInput(input)}
                    onChange={handleFileChange}
                  />
                </div>
                <div className="flex flex-col space-y-3 sm:ml-8 mt-2 sm:mt-0 w-full sm:w-auto">
                  <button
                    type="button"
                    className="px-4 sm:px-6 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg border border-teal-700 hover:bg-teal-700 transition-colors shadow-sm"
                    onClick={handlePictureChange}
                  >
                    Изменить фото
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletePicture}
                    className="px-4 sm:px-6 py-2 text-sm font-medium text-red-600 bg-white rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    Удалить фото
                  </button>
                </div>
              </div>

              <div className="items-center mt-6 sm:mt-10">
                <div className="mb-6">
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-blue-900">
                    Имя пользователя
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="bg-white border border-blue-200 text-blue-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none block w-full p-2.5 sm:p-3"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="profession" className="block mb-2 text-sm font-medium text-blue-900">
                    Профессия
                  </label>
                  <input
                    type="text"
                    id="profession"
                    className="bg-white border border-blue-200 text-blue-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none block w-full p-2.5 sm:p-3"
                    value={profileData.profession}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="accountType" className="block mb-2 text-sm font-medium text-blue-900">
                    Приватность аккаунта
                  </label>
                  <select
                    id="accountType"
                    className="bg-white border border-blue-200 text-blue-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none block w-full p-2.5 sm:p-3"
                    value={profileData.accountType}
                    onChange={handleInputChange}
                  >
                    <option value="public">Публичный аккаунт</option>
                    <option value="private">Приватный аккаунт</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="bio" className="block mb-2 text-sm font-medium text-blue-900">
                    О себе
                  </label>
                  <textarea
                    id="bio"
                    rows="3"
                    className="block p-2.5 sm:p-3 w-full text-sm text-blue-900 bg-white rounded-lg border border-blue-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    value={profileData.bio}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {isLoading && <p>Сохранение изменений...</p>}

                <div className="flex justify-end border-t-2 border-blue-100 pt-6">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full sm:w-auto px-6 py-2.5 sm:py-3 ${
                      isLoading ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'
                    } text-white font-medium rounded-lg shadow-md transition-colors`}
                  >
                    {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
