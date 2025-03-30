import apiClient from './apiClient';

/**
 * Retrieves the current user's profile.
 * @returns {Promise<Object>} A promise that resolves to the ProfileDTO.
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/api/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the current user's profile.
 * @param {Object} profileData - The profile data to update.
 * @returns {Promise<Object>} A promise that resolves to the updated ProfileDTO.
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/api/profile', profileData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Uploads or changes the user's profile picture.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} A promise that resolves to a message containing the image URL.
 */
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/profile/picture', formData, {
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
 * Deletes the user's profile picture.
 * @returns {Promise<string>} A promise that resolves to a confirmation message.
 */
export const deleteProfilePicture = async () => {
  try {
    const response = await apiClient.delete('/api/profile/picture');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches another user's profile by username.
 * @param {string} username - The username of the profile to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the ProfileDTO.
 */
export const getUserProfileByUsername = async (username) => {
  try {
    const response = await apiClient.get(`/api/profile/${username}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
