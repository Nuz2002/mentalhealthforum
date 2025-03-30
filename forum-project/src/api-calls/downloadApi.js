// downloadApi.js
import apiClient from './apiClient';

/**
 * Downloads a file from the backend.
 *
 * @param {string} filePath - The relative file path (e.g., "uploads/doc.pdf").
 * @returns {Promise<Blob>} - A Blob representing the downloaded file.
 */
export const downloadFile = async (filePath) => {
  try {
    const response = await apiClient.get('/api/files', {
      params: { path: filePath },
      responseType: 'blob', // Ensure we get binary data
    });
    return response.data; // This is the file Blob
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
};

/**
 * Triggers a browser download using a Blob.
 *
 * @param {Blob} blob - The file Blob.
 * @param {string} filename - The desired download filename.
 */
export const triggerDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
