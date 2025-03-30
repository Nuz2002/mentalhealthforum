import apiClient from './apiClient';

/**
 * Creates a new post by sending CreatePostRequest to the backend.
 * @param {Object} createPostRequest - { text: "Post content..." }
 * @returns {Promise<Object>} - The newly created PostResponse from the backend
 */
export const createPost = async (createPostRequest) => {
  try {
    const response = await apiClient.post('/api/posts', createPostRequest, {
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
 * Retrieves all posts (including nested comments).
 * @returns {Promise<Array>} - A list of PostResponse objects
 */
export const getAllPosts = async () => {
  try {
    const response = await apiClient.get('/api/posts');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves a single post by its ID (including nested comments).
 * @param {number|string} postId - The ID of the post
 * @returns {Promise<Object>} - The PostResponse
 */
export const getPostById = async (postId) => {
  try {
    const response = await apiClient.get(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
