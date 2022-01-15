import api from '../utils/api';
import {
  CREATE_SURVEY_SUCCESS,
  CREATE_SURVEY_FAIL,
  DELETE_QUESTION_SUCCESS,
  DELETE_QUESTION_FAIL,
  UPDATE_QUESTION_BY_ID_SUCCESS,
  GET_QUESTION_BY_ID_SUCCESS
} from './types';
import { Notification } from '../utils/notification';

export const createSurvey =
  (shot, title, choices, correct_answer, typeToRender) => async (dispatch) => {
    const body = { shot, title, choices, correct_answer, typeToRender };
    console.log(body);
    try {
      const res = await api.post('/session/questions/', body);
      await dispatch({
        type: CREATE_SURVEY_SUCCESS
      });
      Notification('Survey Notification', 'question has been created', 'success');
      console.log(res);
    } catch (err) {
      console.log(err);
      //   const errors = err.response.data.errors;
      //   if (errors) {
      //     errors.forEach((error) => Notification('Survey Notification', error.message, 'warning'));
      //   }
      //   dispatch({
      //     type: CREATE_SURVEY_FAIL
      //   });
  }
};

export const deleteQuestion = (id) => async (dispatch) => {
  try {
    await api.delete(`/session/questions/${id}/`);
    dispatch({
      type: DELETE_QUESTION_SUCCESS
    });
    Notification('Question Notification', 'the question has been deleted', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    // if (errors) {
    //   errors.forEach((error) => Notification('Sentences Notification', error.message, 'warning'));
    // }
    // dispatch({
    //   type: DELETE_QUESTION_FAIL
    // });
  }
};

//edit Survey
export const updateSurveyById =
  (shot, title, choices, correct_answer, typeToRender, id) => async (dispatch) => {
    const body = { shot, title, choices, correct_answer, typeToRender };
    console.log(body);
    try {
      const res = await api.put(`/session/questions/${id}/`, body);
      await dispatch({
        type: UPDATE_QUESTION_BY_ID_SUCCESS
      });
      Notification('Survey Notification', 'question has been created', 'success');
      console.log(res);
    } catch (err) {
      console.log(err);
      //   const errors = err.response.data.errors;
      //   if (errors) {
      //     errors.forEach((error) => Notification('Survey Notification', error.message, 'warning'));
      //   }
      //   dispatch({
      //     type: CREATE_SURVEY_FAIL
      //   });
    }
  };

//get question by id
export const getQuestionById = (id) => async (dispatch) => {
  try {
    await api.get(`/session/questions/${id}/`);
    dispatch({
      type: GET_QUESTION_BY_ID_SUCCESS
    });
    Notification('Question Notification', 'the question has been deleted', 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    // if (errors) {
    //   errors.forEach((error) => Notification('Sentences Notification', error.message, 'warning'));
    // }
    // dispatch({
    //   type: DELETE_QUESTION_FAIL
    // });
  }
};