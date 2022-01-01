import api from '../utils/api';
import {
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAIL,
  GET_SESSION_SUCCESS,
  GET_SESSION_FAIL,
  GET_SENTENCES_SUCCESS,
  GET_SENTENCES_FAIL
} from './types';
import { Notification } from '../utils/notification';

// get session
export const getInfoSession = () => async (dispatch) => {
  try {
    const res = await api.get('/session/');
    dispatch({
      type: GET_SESSION_SUCCESS,
      payload: res.data[0]
    });
    console.log(res.data[0]);
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err.response.data.errors);
    if (errors) {
      errors.forEach((error) => Notification('Session Notification', error.message, 'warning'));
    }

    dispatch({
      type: GET_SESSION_FAIL
    });
  }
};

// Create Session
export const createSession = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/session/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    dispatch({
      type: CREATE_SESSION_SUCCESS,
      payload: res.data
    });
    Notification('Session Notification', 'Create session success', 'success');
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err.response.data.errors);
    if (errors) {
      errors.forEach((error) => Notification('Session Notification', error.message, 'warning'));
    }

    dispatch({
      type: CREATE_SESSION_FAIL
    });
  }
};

// get Sentences
export const getSentences = () => async (dispatch) => {
  try {
    const res = await api.get('/sessions/sentences');
    dispatch({
      type: GET_SESSION_SUCCESS
    });
    console.log(res);
  } catch (error) {
    const errors = err.response.data.errors;
    console.log(err.response.data.errors);
    if (errors) {
      errors.forEach((error) => Notification('Session Notification', error.message, 'warning'));
    }
    dispatch({
      type: GET_SENTENCES_FAIL
    });
  }
};
