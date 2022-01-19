import { combineReducers } from 'redux';
import auth from './auth';
import session from './session';
/**
 * Root Reducer combining both Reducers.
 */
const rootReducer = combineReducers({
  auth,
  session
});

export default rootReducer;
