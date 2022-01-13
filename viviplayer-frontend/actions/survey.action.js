import api from '../utils/api';
import { CREATE_SURVEY_SUCCESS, CREATE_SURVEY_FAIL } from './types';
import { Notification } from '../utils/notification';
export const createSurvey =
  (shot, title, choices, correct_answer, typeToRender) => async (dispatch) => {
    const body = { shot, title, choices, correct_answer: 'nothing', typeToRender };
    console.log(body);
    try {
      const res = await api.post('/session/questions/', body);
      await dispatch({
        type: CREATE_SURVEY_SUCCESS
      });
      Notification('Survey Notification', 'survey has been created', 'success');
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
