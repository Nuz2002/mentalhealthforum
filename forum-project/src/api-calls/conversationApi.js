import apiClient from './apiClient';

/**
 * Starts or fetches a conversation with the target user.
 * @param {string} targetEmail - The email of the target user.
 * @returns {Promise<Object>} A promise that resolves to the ConversationDTO.
 */
export const startConversation = async (targetEmail) => {
  try {
    const response = await apiClient.post('/api/messages/start', null, {
      params: { targetEmail },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves conversation metadata, optionally including messages.
 * @param {number|string} conversationId - The ID of the conversation.
 * @param {boolean} [includeMessages=false] - Whether to include messages.
 * @returns {Promise<Object>} A promise that resolves to the ConversationDTO.
 */
export const getConversation = async (conversationId, includeMessages = false) => {
  try {
    const response = await apiClient.get(`/api/messages/${conversationId}`, {
      params: { includeMessages },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves a page of messages for the given conversation.
 * @param {number|string} conversationId - The ID of the conversation.
 * @param {number} [page=0] - The page number (0-indexed).
 * @param {number} [size=20] - The number of messages per page.
 * @returns {Promise<Array>} A promise that resolves to a list of MessageDTO.
 */
export const getMessagesPage = async (conversationId, page = 0, size = 20) => {
  try {
    const response = await apiClient.get(`/api/messages/${conversationId}/messages`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches all users the current user has conversations with, enriched with profile info.
 * @returns {Promise<Array>} A promise that resolves to a list of ProfileDTO.
 */
export const getConversationUsers = async () => {
  try {
    const response = await apiClient.get('/api/messages/my-users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Sends a message to a conversation.
 * @param {number|string} conversationId - The ID of the conversation.
 * @param {string} text - The message text.
 * @returns {Promise<Object>} A promise that resolves to the created MessageDTO.
 */
export const sendMessageToConversation = async (conversationId, text) => {
  try {
    const response = await apiClient.post(`/api/messages/${conversationId}/send`, text, {
      headers: {
        "Content-Type": "text/plain", // backend expects raw string
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
