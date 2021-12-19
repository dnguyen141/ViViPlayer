import api from '../utils/api';
import { Notification } from '../utils/notification';
import { setAuthToken } from '../utils/setAuthToken';
import { USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types';

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
// export const register = (formData) => async (dispatch) => {
//   try {
//     const res = await api.post('/users', formData);

//     dispatch({
//       type: REGISTER_SUCCESS,
//       payload: res.data
//     });
//     dispatch(loadUser());
//   } catch (err) {
//     const errors = err.response.data.errors;

//     if (errors) {
//       errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
//     }

//     dispatch({
//       type: REGISTER_FAIL
//     });
//   }
// };

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
