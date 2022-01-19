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
  UPDATE_SESSION_FAIL,
  DELETE_SESSION_SUCCESS,
  DELETE_SESSION_FAIL,
  CREATE_SHOT_SUCCESS,
  CREATE_SHOT_FAIL,
  GET_SHOTS_SUCCESS,
  GET_SHOTS_FAIL,
  DELETE_SHOT_BY_ID_SUCCESS,
  DELETE_SHOT_SUCCESS_FAIL,
  UPDATE_SHOT_BY_ID_SUCCESS,
  UPDATE_SHOT_BY_ID_FAIL
} from './types';
import { Notification } from '../utils/notification';

/**
 * Get the session information.
 * @returns Session information api response.
 */
export const getInfoSession = () => async (dispatch) => {
  try {
    const res = await api.get('/session/');
    dispatch({
      type: GET_SESSION_SUCCESS,
      payload: res.data[0]
    });
    return res;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Session Benachrichtigung', error.message, 'warning'));
    }

    dispatch({
      type: GET_SESSION_FAIL
    });
  }
};

/**
 * Creates a new session.
 * @param {*} formData Object that includes necessary data to create a new session with the api.
 * @returns Session JSON data will be returned.
 */
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
    Notification('Session Benachrichtigung', 'Session erfolgreich erstellt.', 'success');
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Session Benachrichtigung', error.message, 'warning'));
    }

    dispatch({
      type: CREATE_SESSION_FAIL
    });
  }
};

/**
 * Updates a existing session with the given ID.
 * @param {Formdata} formData Object that includes necessary data to create a new session with the api.
 * @param {number} id Id of the Session that should be updated.
 * @returns Update session JSON data will be returned.
 */
export const updateSession = (formData, id) => async (dispatch) => {
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
    Notification('Session Benachrichtigung', 'Session erfolgreich aktualisiert.', 'success');
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Session Benachrichtigung', error.message, 'warning'));
    }

    dispatch({
      type: UPDATE_SESSION_FAIL
    });
  }
};

/**
 * Load all the sentences from the backend server.
 */
export const getSentences = () => async (dispatch) => {
  try {
    const res = await api.get('/session/sentences/');
    dispatch({
      type: GET_SENTENCES_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Satz Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: GET_SENTENCES_FAIL
    });
  }
};

/**
 * Delete a session based on id.
 * @param {number} id Id of the to be deleted session.
 */
export const deleteSessionById = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/session/${id}/`);
    dispatch({
      type: DELETE_SESSION_SUCCESS
    });
    Notification('Session Benachrichtigung', 'Die Session wurde beendet.', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Session Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: DELETE_SESSION_FAIL
    });
  }
};

/**
 * Load a sentence based on id from backend server.
 * @param {number} id Id of the sentence that will be loaded.
 * @returns Sentence JSON data will be returned.
 */
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
      errors.forEach((error) => Notification('Satz Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: GET_SETTENCE_BY_ID_FAIL
    });
  }
};

/**
 * Updates an existing sentence based on id.
 * @param {string} text Text of the sentence that will be updated
 * @param {number} shot Shot id of which shot the sentence is written for.
 * @param {number} id Id of the sentence that will be updated.
 */
export const updateSentenceById = (text, shot, id) => async (dispatch) => {
  const body = { text, shot };
  try {
    const res = await api.put(`/session/sentences/${id}/`, body);
    dispatch({
      type: UPDATE_SENTENCE_BY_ID
    });
    getSentences();
    Notification('Satz Benachrichtigung', 'Satz wurde erfolgreich aktualisiert.', 'success');
    return;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Satz Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: UPDATE_SENTENCE_BY_ID_FAIL
    });
  }
};

/**
 * Deletes an existing sentence based on id.
 * @param {number} id Id of the sentence that will be deleted.
 */
export const deleteSentenceById = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/session/sentences/${id}/`);
    dispatch({
      type: DELETE_SENTENCE_SUCCESS
    });
    Notification('Satz Benachrichtigung', 'Satz wurde erfolgreich gelöscht', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Satz Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: DELETE_SENTENCE_SUCCESS_FAIL
    });
  }
};

/**
 * Creates a new sentence.
 * @param {string} text Text input from user.
 * @param {number} shot Shot id of which shot the sentence is written for.
 */
export const createSentence = (text, shot) => async (dispatch) => {
  const body = { text, shot };
  try {
    const res = await api.post(`/session/sentences/`, body);
    dispatch({
      type: CREATE_SENTENCES_SUCCESS
    });
    Notification('Satz Benachrichtigung', 'Satz wurde erfolgreich gelöscht.', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Satz Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: CREATE_SENTENCES_FAIL
    });
  }
};

/**
 * Load all the user stories from backend server.
 */
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
      errors.forEach((error) => Notification('UserStory Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: GET_ALL_USERSTORIRES_FAILS
    });
  }
};

/**
 * Creates a new user story.
 * @param {*} damit First part of user story template.
 * @param {*} moechteichals1 Second part of user story template.
 * @param {*} moechteichals2 Third part of user story template.
 * @param {*} shot Shot id of which shot the user story is written for.
 */
export const createUserStory =
  (damit, moechteichals1, moechteichals2, shot) => async (dispatch) => {
    const body = { damit, moechteichals1, moechteichals2, shot };
    try {
      const res = await api.post('/session/userstories/', body);
      dispatch({
        type: CREATE_USERSTORY_SUCCESS
      });
      Notification('UserStory Benachrichtigung', 'User Story wurde erfolgreich erstellt.', 'success');
      return;
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => Notification('UserStory Benachrichtigung', error.message, 'warning'));
      }
      dispatch({
        type: CREATE_USERSTORY_FAIL
      });
    }
  };

/**
 * Updates an existing user story based on id.
 * @param {*} damit First user story part that will be updated.
 * @param {*} moechteichals1 Second user story part that will be updated.
 * @param {*} moechteichals2 Third user story part that will be updated.
 * @param {*} shot Shot id of which shot the user story is written for.
 * @param {*} id Id of the user story that will be updated.
 * @returns 
 */
export const updateUserStoryById =
  (damit, moechteichals1, moechteichals2, shot, id) => async (dispatch) => {
    const body = { damit, moechteichals1, moechteichals2, shot };
    try {
      const res = await api.put(`/session/userstories/${id}/`, body);
      dispatch({
        type: UPDATE_USERSTORY_SUCCESS
      });
      Notification('UserStory Benachrichtigung', 'User Story wurde erfolgreich aktualisiert.', 'success');
      return;
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => Notification('UserStory Benachrichtigung', error.message, 'warning'));
      }
      dispatch({
        type: UPDATE_USERSTORY_FAIL
      });
    }
  };

/**
 * Load a user story based on id from the backend server.
 * @param {number} id Id of the user story that will be loaded.
 * @returns User Story JSON data based on id will be returned.
 */
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
      errors.forEach((error) => Notification('UserStory Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: GET_USERSTORY_BY_ID_FAIL
    });
  }
};

/**
 * Deletes an extisting user story based on id.
 * @param {number} id Id of an user story that will be deleted.
 */
export const deleteUserStoryById = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/session/userstories/${id}/`);
    dispatch({
      type: DELETE_USERSTORY_BY_ID_SUCCESS
    });
    Notification('UserStory Benachrichtigung', 'User Story wurde erfolgreich gelöscht.', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('UserStory Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: DELETE_USERSTORY_SUCCESS_FAIL
    });
  }
};

/**
 * Creates a new shot.
 * @param {number} time Current time in the video.
 * @param {string} title Title of the shot.
 */
export const createShot = (time, title) => async (dispatch) => {
  const body = { time, title };
  try {
    const res = await api.post(`/session/shots/`, body);
    dispatch({
      type: CREATE_SHOT_SUCCESS
    });
    Notification('Shot Benachrichtigung', 'Shot wurde erfolgreich erstellt.', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Shot Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: CREATE_SHOT_FAIL
    });
  }
};

/**
 * Deletes an existing shot based on id.
 * @param {number} id Id of the shot that will be deleted. 
 */
export const deleteShotById = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/session/shots/${id}/`);
    dispatch({
      type: DELETE_SHOT_BY_ID_SUCCESS
    });
    Notification('Shot Benachrichtigung', 'Der Shot wurde entfernt.', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Shots Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: DELETE_SHOT_SUCCESS_FAIL
    });
  }
};

/**
 * Load shots from backend server.
 */
export const getShots = () => async (dispatch) => {
  try {
    const res = await api.get('/session/shots/');
    dispatch({
      type: GET_SHOTS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Shots Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: GET_SHOTS_FAIL
    });
  }
};

/**
 * Updates an existing shot based on id.
 * @param {number} time New time to overwrite the previous time.
 * @param {string} title New title of the shots.
 * @param {number} id Id of the shots that will be updated.
 * @returns 
 */
export const updateShotById = (time, title, id) => async (dispatch) => {
  const body = { time, title};
  try {
    const res = await api.put(`/session/shots/${id}/`, body);
    dispatch({
      type: UPDATE_SHOT_BY_ID_SUCCESS
    });
    getShots();
    Notification('Shots Benachrichtigung', 'Shot wurde erfolgreich aktualisiert.', 'success');
    return;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Shots Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: UPDATE_SHOT_BY_ID_FAIL
    });
  }
};