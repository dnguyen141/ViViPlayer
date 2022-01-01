import api from '../utils/api';
import {
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAIL,
  GET_SESSION_SUCCESS,
  GET_SESSION_FAIL,
  GET_SENTENCES_SUCCESS,
  GET_SENTENCES_FAIL,
  GET_SENTENCE_BY_ID,
  GET_SETTENCE_BY_ID_FAIL,
  UPDATE_SENTENCE_BY_ID,
  UPDATE_SENTENCE_BY_ID_FAIL,
  DELETE_SENTENCE_SUCCESS,
  DELETE_SENTENCE_SUCCESS_FAIL
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
    const res = await api.get('/session/sentences/');
    dispatch({
      type: GET_SENTENCES_SUCCESS,
      payload: res.data
    });
    console.log(res.data);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Session Notification', error.message, 'warning'));
    }
    dispatch({
      type: GET_SENTENCES_FAIL
    });
  }
};

// get sentences by ids
export const getSentenceById = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/session/sentences/${id}/`);
    dispatch({
      type: GET_SENTENCE_BY_ID
    });
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Session Notification', error.message, 'warning'));
    }
    dispatch({
      type: GET_SETTENCE_BY_ID_FAIL
    });
  }
};

// update sentence by id
export const updateSentenceById = (text, shot, id) => async (dispatch) => {
  const body = { text, shot };
  try {
    const res = await api.put(`/session/sentences/${id}/`, body);
    console.log(res);
    getSentences();
    Notification('Sentences Notification', 'sentence has been updated', 'success');
    return;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Sentences Notification', error.message, 'warning'));
    }
    dispatch({
      type: UPDATE_SENTENCE_BY_ID_FAIL
    });
  }
};

// get sentences by ids
export const deleteSentenceById = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/session/sentences/${id}/`);
    dispatch({
      type: DELETE_SENTENCE_SUCCESS
    });
    Notification('Sentences Notification', 'the sentence has been deleted', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Session Notification', error.message, 'warning'));
    }
    dispatch({
      type: DELETE_SENTENCE_SUCCESS_FAIL
    });
  }
};
