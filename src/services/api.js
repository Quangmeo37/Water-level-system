import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const fetchHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching water level history:", error);
    return [];
  }
};
