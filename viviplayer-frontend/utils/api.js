import axios from 'axios';
import { SERVER_BACKEND } from '../constants/constants';
// Create an instance of axios
const api = axios.create({
  baseURL: `${SERVER_BACKEND}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
