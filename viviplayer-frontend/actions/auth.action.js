import api from '../utils/api';
import { Notification } from '../utils/notification';
import { setAuthToken } from '../utils/setAuthToken';
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from './types';

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get('/auth/user/');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = (username, password1, password2) => async (dispatch) => {
  const body = { username, password1, password2 };
  try {
    const res = await api.post('/auth/register/mod/', body);
    console.log(res);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    Notification(
      'Register Notification',
      'Your account has been submitted for review. Currently you can only log in as a regular account',
      'success'
    );
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err.response);
    if (errors) {
      errors.forEach((error) => Notification('Login Notification', error.message, 'warning'));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const login = (username, password) => async (dispatch) => {
  const body = { username, password };

  try {
    const res = await api.post('/auth/login/', body);

    await dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    setAuthToken(res.data.key);
    await dispatch(loadUser());
    Notification('Login Notification', 'Login Success', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Login Notification', error.message, 'warning'));
    }
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout
export const logout = () => async (dispatch) => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
  dispatch({ type: LOGOUT });
};
