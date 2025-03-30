// adminExpertVerificationApi.js
import apiClient from './apiClient';

/**
 * Retrieves all pending expert verification applications.
 * @returns {Promise<Array>} A promise that resolves to an array of pending applications.
 */
export const getPendingApplications = async () => {
  try {
    const response = await apiClient.get('/api/admin/expert-verifications/pending');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves details for a specific expert verification application.
 * @param {number|string} applicationId - The ID of the application.
 * @returns {Promise<Object>} A promise that resolves to the application details.
 */
export const getApplicationDetails = async (applicationId) => {
  try {
    const response = await apiClient.get(`/api/admin/expert-verifications/${applicationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reviews an expert verification application by approving or rejecting it.
 * @param {number|string} applicationId - The ID of the application.
 * @param {boolean} approved - A flag indicating whether the application is approved.
 * @returns {Promise<Object>} A promise that resolves to the updated application review details.
 */
export const reviewApplication = async (applicationId, approved) => {
  try {
    const response = await apiClient.post(`/api/admin/expert-verifications/${applicationId}/review`, null, {
      params: { approved },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
