import { USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGOUT } from '../actions/types';

const initialState = {
  token: '',
  isAuthenticated: false,
  isAuthenticatedWithTan: false,
  loading: true,
  user: null
};

function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case LOGIN_SUCCESS_WITH_TAN:
      return {
        ...state,
        isAuthenticated: false,
        isAuthenticatedWithTan: true,
        loading: false,
        user: payload
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case AUTH_ERROR:
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isAuthenticatedWithTan: false,
        loading: false,
        user: null
      };
    default:
      return state;
  }
}

export default authReducer;
