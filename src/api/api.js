import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const API_URL = 'https://apiwebmobile-production.up.railway.app';
 
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
 

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
 
export default api;