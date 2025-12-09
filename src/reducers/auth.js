import { LOGIN, LOGOUT, REGISTER, ASYNC_START, ASYNC_END } from '../constants/actionTypes';

const initialState = {
  token: null,
  currentUser: null,
  inProgress: false,
  errors: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null,
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user,
      };
    case LOGOUT:
      return {
        ...initialState
      };
    case ASYNC_START:
      if (action.subtype === LOGIN || action.subtype === REGISTER) {
        return { ...state, inProgress: true };
      }
      return state;
    case ASYNC_END:
      return { ...state, inProgress: false };
    default:
      return state;
  }
};
