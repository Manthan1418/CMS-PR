import axios from 'axios';

const API_URL = 'http://localhost:5000/content';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllPages = async () => {
  try {
    const response = await api.get('/page');
    return response.data;
  } catch (error) {
    console.error('Error fetching pages:', error);
    return {};
  }
};

export const getPageContent = async (pageName) => {
  try {
    const response = await api.get(`/page/${pageName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching page ${pageName}:`, error);
    return null;
  }
};

export const savePageContent = async (pageName, content) => {
  try {
    const response = await api.post(`/page/${pageName}`, content);
    return response.data;
  } catch (error) {
    console.error(`Error saving page ${pageName}:`, error);
    throw error;
  }
};

export const updatePageContent = async (pageName, content) => {
  try {
    const response = await api.put(`/page/${pageName}`, content);
    return response.data;
  } catch (error) {
    console.error(`Error updating page ${pageName}:`, error);
    throw error;
  }
};

export const deletePage = async (pageName) => {
  try {
    const response = await api.delete(`/page/${pageName}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting page ${pageName}:`, error);
    throw error;
  }
};

export default api;
