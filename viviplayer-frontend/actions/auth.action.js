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
  REGISTER_FAIL,
  LOGIN_WITH_TAN_SUCCESS,
  LOGIN_WITH_TAN_FAIL
} from './types';

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

/**
 * Loads the user information.
 */
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

/**
 * Logs the user in using the specified TAN.
 * 
 * @param {number} password1 The TAN used to log in.
 */
export const loginWithTanFunc = (password1) => async (dispatch) => {
  const body = { password1 };

  try {
    await logout();
    const res = await api.post('/auth/register/mem/', body);

    await dispatch({
      type: LOGIN_WITH_TAN_SUCCESS,
      payload: res.data
    });
    setAuthToken(res.data.key);
    await dispatch(loadUser());
    Notification('Login Benachrichtigung', 'Erfolgreich als Teilnehmer eingeloggt.', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Login Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: LOGIN_WITH_TAN_FAIL
    });
  }
};

/**
 * Registers a new user for the admin to review.
 * 
 * @param {string} username The username for the new user.   
 * @param {string} password1 The password of the new user.
 * @param {string} password2 The confirmation of the password. This is the value of the second passwort input.
 */
export const register = (username, password1, password2) => async (dispatch) => {
  const body = { username, password1, password2 };
  try {
    const res = await api.post('/auth/register/mod/', body);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    Notification(
      'Registrierungs Benachrichtigung',
      'Ihr Account wurde zur Bearbeitung eingeschickt. Momentan können Sie sich nur als Teilnehmer einloggen.',
      'success'
    );
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err.response);
    if (errors) {
      errors.forEach((error) => Notification('Login Benachrichtigung', error.message, 'warning'));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

/**
 * Log in as a moderator with username and password
 * 
 * @param {string} username Username of the user.
 * @param {string} password Password of the user.
 
 */
export const login = (username, password) => async (dispatch) => {
  const body = { username, password };

  try {
    await logout();
    const res = await api.post('/auth/login/', body);

    await dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    setAuthToken(res.data.key);
    await dispatch(loadUser());
    Notification('Login Benachrichtigung', 'Login erfolgreich', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Login Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

/**
 * Logs the user out.
 */
export const logout = () => async (dispatch) => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
  localStorage.removeItem('questionID');
  dispatch({ type: LOGOUT });
};
