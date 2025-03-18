
import axios from 'axios';
import { TestResult } from '@/data/cognitiveTestsData';

const API_URL = 'http://localhost:5000/api';

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
export interface UserProfile {
  id?: string;
  name: string;
  age: number;
  gender: string;
  education?: string;
  medicalHistory?: string;
  contactInfo?: string;
}

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
