import axios from 'axios';

const API_BASE_URL =
  process.env.BACKEND_URL || 'https://qode-backend-test-production.up.railway.app';

export const createPost = async (post: { imageUrls: string[] }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/post`, post);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createComment = async (comment: { postId: number; content: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/comment`, comment);
    return response.data?.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const getComments = async ({ postId }: { postId: number }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comment/${postId}`);
    return response.data?.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};
