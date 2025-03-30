import apiClient from './apiClient';

/**
 * Fetches the list of currently online users' emails from the server.
 * @returns {Promise<string[]>} List of online user emails
 */
export const getOnlineUsers = async () => {
  try {
    const response = await apiClient.get('/api/presence/online-users');
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch online users:", error);
    return [];
  }
};
