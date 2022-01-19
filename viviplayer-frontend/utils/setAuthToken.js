import api from './api';

// store our JWT in LS and set axios headers if we do have a token

/**
 * Set the authentication token to given value.
 * @param {string} token 
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};
