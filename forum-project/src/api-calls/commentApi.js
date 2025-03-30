import apiClient from './apiClient';

/**
 * Creates a new comment (or reply, if parentCommentId is set).
 * The backend returns an updated PostResponse.
 *
 * @param {number|string} postId - The ID of the post
 * @param {Object} commentData - { text: string, parentCommentId?: number }
 * @returns {Promise<Object>} - The updated PostResponse
 */
export const createComment = async (postId, commentData) => {
  try {
    const response = await apiClient.post(`/api/posts/${postId}/comments`, commentData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
