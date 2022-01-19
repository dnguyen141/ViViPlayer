import axios from 'axios';
import { SERVER_BACKEND } from '../constants/constants';
// Create an instance of axios

/**
 * Api shortcut to an axios request.
 */
const api = axios.create({
  baseURL: `${SERVER_BACKEND}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
