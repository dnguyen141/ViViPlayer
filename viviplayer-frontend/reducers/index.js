import { combineReducers } from 'redux';
import auth from './auth';
import session from './session';

const rootReducer = combineReducers({
  auth,
  session
});

export default rootReducer;
