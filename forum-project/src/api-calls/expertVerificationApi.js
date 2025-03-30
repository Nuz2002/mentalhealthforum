import apiClient from './apiClient';

/**
 * Submits an expert verification application.
 *
 * @param {Object} applicationData - The application data.
 * @param {string} applicationData.firstName
 * @param {string} applicationData.lastName
 * @param {string} applicationData.dateOfBirth
 * @param {string} applicationData.professionalBio
 * @param {File} [applicationData.profilePhoto]
 * @param {File} [applicationData.governmentId]
 * @param {File} [applicationData.qualifications]
 * @returns {Promise<Object>} - The response data from the backend.
 */
export const submitApplication = async (applicationData) => {
  try {
    const formData = new FormData();
    formData.append('firstName', applicationData.firstName);
    formData.append('lastName', applicationData.lastName);
    formData.append('dateOfBirth', applicationData.dateOfBirth);
    formData.append('professionalBio', applicationData.professionalBio);

    if (applicationData.profilePhoto) {
      formData.append('profilePhoto', applicationData.profilePhoto);
    }
    if (applicationData.governmentId) {
      formData.append('governmentId', applicationData.governmentId);
    }
    if (applicationData.qualifications) {
      formData.append('qualifications', applicationData.qualifications);
    }

    const response = await apiClient.post('/api/expert-verification', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves all approved experts.
 *
 * @returns {Promise<Object[]>} - A promise that resolves to the list of approved experts.
 */
export const getApprovedExperts = async () => {
  try {
    const response = await apiClient.get('/api/expert-verification/approved');
    return response.data;
  } catch (error) {
    throw error;
  }
};
