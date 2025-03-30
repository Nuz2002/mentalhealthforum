import React, { useState, useEffect } from "react";
import {
  getPendingApplications,
  getApplicationDetails,
  reviewApplication,
} from "../api-calls/adminExpertVerificationApi";

import { downloadFile, triggerDownload } from '../api-calls/downloadApi';

import defaultProfilePic from '../assets/default-profile.png';

const getPublicUrl = (path) => {
  if (!path) return defaultProfilePic;
  
  // Check if the path is already a full URL
  if (path.startsWith('http')) return path;

  const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
  const fullUrl = `${baseURL}${path}`;
  console.log("Fetching image from:", fullUrl);
  return fullUrl;
};

const AdminExpertVerificationPanel = () => {
  const [applications, setApplications] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getPendingApplications();
        setApplications(data);
        setIsLoading(false);
      } catch (err) {
        setError("Не удалось загрузить заявки");
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getDocumentUrl = (path) => {
    const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
    return `${baseURL}/api/files?path=${encodeURIComponent(path)}`;
  };

  const handleDownload = async (filePath, fileName = "download.jpg") => {
    try {
      const response = await apiClient.get(`/api/files?path=${encodeURIComponent(filePath)}`, {
        responseType: 'blob',
      });
  
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Не удалось скачать файл.");
      console.error("Download error:", err);
    }
  };
  

  const handleSelectUser = async (applicationId) => {
    try {
      setIsLoading(true);
      const userDetails = await getApplicationDetails(applicationId);
      setSelectedUser(userDetails);
      setIsLoading(false);
    } catch (err) {
      setError("Не удалось загрузить данные пользователя");
      setIsLoading(false);
    }
  };

  const handleReview = async (approved) => {
    if (!selectedUser) return;

    const confirmation = window.confirm(
      `Вы уверены, что хотите ${approved ? "одобрить" : "отклонить"} эту заявку?`
    );
    if (!confirmation) return;

    try {
      setIsReviewing(true);
      await reviewApplication(selectedUser.applicationId, approved);
      const updatedApplications = await getPendingApplications();
      setApplications(updatedApplications);
      setSelectedUser(null);
    } catch (err) {
      setError("Не удалось выполнить проверку");
    } finally {
      setIsReviewing(false);
    }
  };

  const getFileIcon = (filePath) => {
    const ext = filePath.split('.').pop().toLowerCase();
    const iconClass = "w-5 h-5 mr-3 shrink-0";

    switch (ext) {
      case "pdf":
        return (
          <svg className={`${iconClass} text-red-500`} fill="currentColor" viewBox="0 0 16 16" />
        );
      case "jpeg":
      case "jpg":
      case "png":
        return (
          <svg className={`${iconClass} text-blue-500`} fill="currentColor" viewBox="0 0 16 16" />
        );
      default:
        return (
          <svg className={`${iconClass} text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getFileName = (filePath) => {
    return filePath.split('/').pop();
  };

  return (
    <div className="bg-blue-50 w-full flex flex-col gap-8 px-4 md:px-8 lg:px-12 md:flex-row text-blue-900 min-h-screen py-8">
      <aside className="md:w-1/3 lg:w-1/4">
        <div className="sticky flex flex-col gap-2 p-4 top-20 bg-white rounded-xl shadow-md border border-blue-100">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-blue-100 pb-3">
            Ожидающие заявки
            {isLoading && <span className="ml-2 text-blue-500 text-sm">Загрузка...</span>}
          </h2>

          {error && (
            <div className="text-red-500 p-3 bg-red-50 rounded-lg">{error}</div>
          )}

          {!isLoading && applications.map((application) => (
            <button
              key={application.applicationId}
              onClick={() => handleSelectUser(application.applicationId)}
              className={`flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                selectedUser?.applicationId === application.applicationId
                  ? "bg-teal-50 border-2 border-teal-500"
                  : "hover:bg-blue-50 hover:border-blue-200"
              }`}
            >
              <img
                src={getPublicUrl(application.photo)}
                alt="--"
                className="w-10 h-10 rounded-full mr-3 border-2 border-blue-200 object-cover"
              />
              <div>
                <p className="font-medium text-blue-900">
                  {application.firstName} {application.lastName}
                </p>
                <p className="text-sm text-blue-600">
                  {application.documents.length} документ{application.documents.length !== 1 && "а"}
                </p>
              </div>
            </button>
          ))}

          {!isLoading && applications.length === 0 && (
            <div className="text-center p-4 text-blue-600">Нет ожидающих заявок</div>
          )}
        </div>
      </aside>

      <main className="w-full md:w-2/3 lg:w-3/4 mt-6 md:mt-0 md:ml-6">
        {isLoading ? (
          <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100 text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-blue-100 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-blue-100 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        ) : selectedUser ? (
          <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100">
            <div className="flex items-start gap-6 mb-8">
              <div className="relative group">
                <img
                  className="w-32 h-32 rounded-xl border-4 border-teal-100 shadow-md cursor-pointer transition-transform group-hover:scale-105 object-cover"
                  src={getPublicUrl(selectedUser.photo)}
                  alt="Пользователь"
                />
                <button
                  onClick={() => handleDownload(selectedUser.photo, 'profile-photo.jpg')}
                  className="absolute -bottom-2 -right-2 bg-teal-500 p-2 rounded-full shadow-md hover:bg-teal-600 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>

              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <div className="mb-4">
                  <h3 className="font-semibold text-blue-900">Профессиональное описание</h3>
                  <p className="text-blue-600 mt-1">{selectedUser.professionalBio}</p>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Загруженные документы</h3>
                  <div className="space-y-2">
                    {selectedUser.documents.map((docPath, index) => (
                      <div key={index} className="flex items-center bg-blue-50 rounded-lg p-3">
                        {getFileIcon(docPath)}
                        <span className="text-blue-900 font-medium truncate">{getFileName(docPath)}</span>
                        <button
                          onClick={() => handleDownload(docPath)}
                          className="ml-auto px-3 py-1.5 bg-white text-blue-600 hover:text-teal-600 rounded-md border border-blue-200 hover:border-teal-300 transition-colors text-sm"
                        >
                          Скачать
                        </button>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end border-t-2 border-blue-100 pt-6">
              <button
                onClick={() => handleReview(false)}
                disabled={isReviewing}
                className="px-6 py-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium flex items-center transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {isReviewing ? "Обработка..." : "Отклонить"}
              </button>
              <button
                onClick={() => handleReview(true)}
                disabled={isReviewing}
                className="px-6 py-2.5 bg-teal-600 text-white hover:bg-teal-700 rounded-lg font-medium flex items-center transition-colors shadow-md disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isReviewing ? "Обработка..." : "Одобрить"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100 text-center">
            <div className="text-blue-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-xl text-blue-900 font-medium">Выберите заявку для проверки</p>
            <p className="text-blue-600 mt-2">Нажмите на пользователя в списке заявок</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminExpertVerificationPanel;
