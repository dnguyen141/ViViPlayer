import api from '../utils/api';
import {
  CREATE_SURVEY_SUCCESS,
  CREATE_SURVEY_FAIL,
  DELETE_QUESTION_SUCCESS,
  DELETE_QUESTION_FAIL,
  UPDATE_QUESTION_BY_ID_SUCCESS,
  GET_QUESTION_BY_ID_SUCCESS,
  SEND_ANSWER_SUCCESS,
  SEND_ANSWER_FAIL
} from './types';
import { Notification } from '../utils/notification';

/**
 * Creates a new survey/question.
 * @param {number} shot Id of the shot which the question/survey is written for.
 * @param {string} title Question for the survey/question.
 * @param {*} choices Answer choices.
 * @param {string} correct_answer Correct answer from answer choices. Must be the same as one of the choices.
 * @param {string} typeToRender Type of the question that will be rendered(Survey or Question).
 * @returns New survey/question api response.
 */
export const createSurvey =
  (shot, title, choices, correct_answer, typeToRender) => async (dispatch) => {
    const body = { shot, title, choices, correct_answer, typeToRender };
    try {
      const res = await api.post('/session/questions/', body);
      await dispatch({
        type: CREATE_SURVEY_SUCCESS
      });
      Notification('Umfrage Benachrichtigung', 'Die Frage wurde erstellt', 'success');
    } catch (err) {
      console.log(err);
      //   const errors = err.response.data.errors;
      //   if (errors) {
      //     errors.forEach((error) => Notification('Survey Benachrichtigung', error.message, 'warning'));
      //   }
      //   dispatch({
      //     type: CREATE_SURVEY_FAIL
      //   });
    }
  };

  /**
   * Deletes an existing survey/question based on id.
   * @param {number} id Id of the survey/question that will be deleted.
   * @returns Survey/Question deleted api response.
   */
export const deleteQuestion = (id) => async (dispatch) => {
  try {
    await api.delete(`/session/questions/${id}/`);
    dispatch({
      type: DELETE_QUESTION_SUCCESS
    });
    Notification('Umfrage Benachrichtigung', 'Die Frage wurde gelöscht', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => Notification('Umfrage Benachrichtigung', error.message, 'warning'));
    }
    dispatch({
      type: DELETE_QUESTION_FAIL
    });
  }
};

/**
 * Sends an answer to sent survey/question during the session.
 * @param {number} question_id Id of the question that is answered.
 * @param {*} answer Answer chosen by User.
 * @param {*} type Type of the question(Survey or Question).
 * @returns Answer sent api response.
 */
export const sendAnswer = (question_id, answer, type) => async (dispatch) => {
  const body = { question_id, answer };
  try {
    if (type === 'radiogroup') {
      let data = [];
      data.push(answer);
      const body1 = { question_id, answer: data };
      await api.post('/session/answers/', body1);
      dispatch({
        type: SEND_ANSWER_SUCCESS
      });
      Notification('Umfrage Benachrichtigung', 'Die Antwort wurde gesendet', 'success');
      return;
    }
    await api.post('/session/answers/', body);
    dispatch({
      type: SEND_ANSWER_SUCCESS
    });
    Notification('Umfrage Benachrichtigung', 'Die Antwort wurde gesendet', 'success');
  } catch (err) {
    console.log(err);
    dispatch({
      type: SEND_ANSWER_FAIL
    });
  }
};

/**
 * Updates an existing survey/question based on id.
 * @param {number} shot Id of the shot which the question/survey is written for.
 * @param {string} title Question for the survey/question.
 * @param {*} choices Answer choices.
 * @param {string} correct_answer Correct answer from answer choices. Must be the same as one of the choices.
 * @param {string} typeToRender Type of the question that will be rendered(Survey or Question).
 * @param {number} id Id of the survey/question that will be updated.
 * @returns Survey/Question information update based on id api response.
 */
export const updateSurveyById =
  (shot, title, choices, correct_answer, typeToRender, id) => async (dispatch) => {
    const body = { shot, title, choices, correct_answer, typeToRender };
    try {
      const res = await api.put(`/session/questions/${id}/`, body);
      await dispatch({
        type: UPDATE_QUESTION_BY_ID_SUCCESS
      });
      Notification('Umfrage Benachrichtigung', 'Die Frage wurde aktualisiert', 'success');
      console.log(res);
    } catch (err) {
      console.log(err);
      //   const errors = err.response.data.errors;
      //   if (errors) {
      //     errors.forEach((error) => Notification('Survey Benachrichtigung', error.message, 'warning'));
      //   }
      //   dispatch({
      //     type: CREATE_SURVEY_FAIL
      //   });
    }
  };

/**
 * Load a survey/question based on id from the backend server.
 * @param {number} id Id of the survey/question that will be loaded.
 * @returns Survey/Question information based on id api response.
 */
export const getQuestionById = (id) => async (dispatch) => {
  try {
    await api.get(`/session/questions/${id}/`);
    dispatch({
      type: GET_QUESTION_BY_ID_SUCCESS
    });
    // Notification('Question Benachrichtigung', 'the question has been deleted', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    // if (errors) {
    //   errors.forEach((error) => Notification('Sentences Benachrichtigung', error.message, 'warning'));
    // }
    // dispatch({
    //   type: DELETE_QUESTION_FAIL
    // });
  }
};
