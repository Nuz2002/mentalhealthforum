import apiClient from './apiClient';

/**
 * Sends a message to an existing conversation.
 *
 * @param {number|string} conversationId - The ID of the conversation.
 * @param {string} text - The text of the message to send.
 * @returns {Promise<Object>} - A promise that resolves to the MessageDTO returned by the backend.
 */
export const sendMessage = async (conversationId, text) => {
  try {
    const response = await apiClient.post(`/api/messages/${conversationId}/send`, text, {
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
 * Marks all unread messages as read in a conversation.
 *
 * @param {number|string} conversationId - The ID of the conversation.
 * @returns {Promise<void>}
 */
export const markMessagesAsRead = async (conversationId) => {
  try {
    await apiClient.post(`/api/messages/${conversationId}/mark-read`);
  } catch (error) {
    throw error;
  }
};
