
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

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something else caused the error
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

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

// Validate if user has a profile
export const validateUserProfile = async (userId: string) => {
  try {
    const response = await api.get(`/validate-profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error validating user profile:', error);
    return { exists: false, profileCompleted: false };
  }
};

// Handwriting analysis API
export const saveHandwritingAnalysis = async (analysis: any, userId: string) => {
  try {
    const response = await api.post('/handwriting-analysis', { ...analysis, userId });
    return response.data;
  } catch (error) {
    console.error('Error saving handwriting analysis:', error);
    throw error;
  }
};

export const getHandwritingAnalysis = async (userId: string) => {
  try {
    const response = await api.get(`/handwriting-analysis/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching handwriting analysis:', error);
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
