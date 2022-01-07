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
  DELETE_SENTENCE_SUCCESS_FAIL,
  CREATE_SENTENCES_SUCCESS,
  CREATE_SENTENCES_FAIL,
  GET_ALL_USERSTORIRES_SUCCESS,
  GET_ALL_USERSTORIRES_FAILS,
  CREATE_USERSTORY_SUCCESS,
  CREATE_USERSTORY_FAIL,
  UPDATE_USERSTORY_SUCCESS,
  UPDATE_USERSTORY_FAIL,
  GET_USERSTORY_BY_ID_SUCCESS,
  GET_USERSTORY_BY_ID_FAIL,
  DELETE_USERSTORY_BY_ID_SUCCESS,
  DELETE_USERSTORY_SUCCESS_FAIL,
  UPDATE_SESSION_SUCCESS,
  UPDATE_SESSION_FAIL
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
    return res;
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

// update session
export const updateSession = (formData, id) => async (dispatch) => {
  console.log('ID THERE', id);
  try {
    const res = await api.put(`/session/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    dispatch({
      type: UPDATE_SESSION_SUCCESS,
      payload: res.data
    });
    Notification('Session Notification', 'update session success', 'success');
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err.response.data.errors);
    if (errors) {
      errors.forEach((error) => Notification('Session Notification', error.message, 'warning'));
    }

    dispatch({
      type: UPDATE_SESSION_FAIL
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
      errors.forEach((error) => Notification('Sentences Notification', error.message, 'warning'));
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
      errors.forEach((error) => Notification('Sentences Notification', error.message, 'warning'));
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
    dispatch({
      type: UPDATE_SENTENCE_BY_ID
    });
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
      errors.forEach((error) => Notification('Sentences Notification', error.message, 'warning'));
    }
    dispatch({
      type: DELETE_SENTENCE_SUCCESS_FAIL
    });
  }
};

// create new sentence
export const createSentence = (text, shot) => async (dispatch) => {
  const body = { text, shot };
  try {
    const res = await api.post(`/session/sentences/`, body);
    dispatch({
      type: CREATE_SENTENCES_SUCCESS
    });
    Notification('Sentences Notification', 'the sentence has been created', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Sentences Notification', error.message, 'warning'));
    }
    dispatch({
      type: CREATE_SENTENCES_FAIL
    });
  }
};

// get all user stories from server
export const getAllUserStories = () => async (dispatch) => {
  try {
    const res = await api.get('/session/userstories/');
    dispatch({
      type: GET_ALL_USERSTORIRES_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('UserStory notification', error.message, 'warning'));
    }
    dispatch({
      type: GET_ALL_USERSTORIRES_FAILS
    });
  }
};

// create new user story
export const createUserStory =
  (damit, moechteichals1, moechteichals2, shot) => async (dispatch) => {
    const body = { damit, moechteichals1, moechteichals2, shot };
    try {
      const res = await api.post('/session/userstories/', body);
      dispatch({
        type: CREATE_USERSTORY_SUCCESS
      });
      Notification('UserStory Notification', 'the user story has been created', 'success');
      return;
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => Notification('UserStory notification', error.message, 'warning'));
      }
      dispatch({
        type: CREATE_USERSTORY_FAIL
      });
    }
  };

// update user story by id
export const updateUserStoryById =
  (damit, moechteichals1, moechteichals2, shot, id) => async (dispatch) => {
    const body = { damit, moechteichals1, moechteichals2, shot };
    try {
      const res = await api.put(`/session/userstories/${id}/`, body);
      dispatch({
        type: UPDATE_USERSTORY_SUCCESS
      });
      Notification('UserStory Notification', 'the user story has been updated', 'success');
      return;
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => Notification('UserStory notification', error.message, 'warning'));
      }
      dispatch({
        type: UPDATE_USERSTORY_FAIL
      });
    }
  };

// get user story by ids
export const getUserStoryById = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/session/userstories/${id}/`);
    dispatch({
      type: GET_USERSTORY_BY_ID_SUCCESS
    });
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('UserStory notification', error.message, 'warning'));
    }
    dispatch({
      type: GET_USERSTORY_BY_ID_FAIL
    });
  }
};

// delete user story by id
export const deleteUserStoryById = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/session/userstories/${id}/`);
    dispatch({
      type: DELETE_USERSTORY_BY_ID_SUCCESS
    });
    Notification('UserStory Notification', 'the user story has been deleted', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('UserStory Notification', error.message, 'warning'));
    }
    dispatch({
      type: DELETE_USERSTORY_SUCCESS_FAIL
    });
  }
};
