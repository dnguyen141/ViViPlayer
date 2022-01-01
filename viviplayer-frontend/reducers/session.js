import {
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAIL,
  GET_SESSION_SUCCESS,
  GET_SESSION_FAIL,
  GET_SENTENCES_SUCCESS
} from '../actions/types';

const initialState = {
  sessionInfo: null,
  loading: false,
  sentences: null
};

function sessionReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_SESSION_SUCCESS:
      return {
        ...state,
        sessionInfo: payload,
        loading: true
      };
    case GET_SESSION_SUCCESS:
      return {
        ...state,
        sessionInfo: payload,
        loading: true
      };
    case GET_SENTENCES_SUCCESS:
      return {
        ...state,
        sentences: payload,
        loading: true
      };
    default:
      return state;
  }
}

export default sessionReducer;
