
import axios from 'axios';
import { TestResult } from '@/data/cognitiveTestsData';
import { UserProfile } from '@/types/user';

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Test results API
export const saveTestResultToServer = async (testResult: TestResult, userId: string) => {
  try {
    const response = await api.post('/test-results', { ...testResult, userId });
    return response.data;
  } catch (error) {
    console.error('Error saving test result:', error);
    throw error;
  }
};

export const getTestResults = async (userId?: string) => {
  try {
    const endpoint = userId ? `/test-results/${userId}` : '/test-results';
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching test results:', error);
    return [];
  }
};

// User profile API
export const saveUserProfile = async (profile: UserProfile) => {
  try {
    if (profile.id) {
      const response = await api.put(`/users/${profile.id}`, profile);
      return response.data;
    } else {
      const response = await api.post('/users', profile);
      return response.data;
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Recommendations API
export const getRecommendations = async (userId: string) => {
  try {
    const response = await api.get(`/recommendations/${userId}`);
    return response.data.recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

// Health check API
export const checkServerStatus = async () => {
  try {
    const response = await api.get('/health');
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};
