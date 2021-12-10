import api from '../utils/api';
import setAuthToken from '../utils/setAuthToken';
import { openNotification } from '../utils/Noti';

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

// Load User
export const loadUser = async () => {
  try {
    const res = await api.get('/auth');
    console.log(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
  } catch (err) {
    console.log(err);
  }
};

// Login User
export const login = async (email, password) => {
  console.log(email, '--', password);
  const body = { email, password };

  try {
    const res = await api.post('/auth', body);
    setAuthToken(res.data.token);
    loadUser();
  } catch (err) {
    const errors = err.response.data.errors;
    errors.forEach((error) => openNotification('Login Notification', error.msg));
  }
};
