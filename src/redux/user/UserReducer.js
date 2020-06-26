import ActionNames from './UserActions';

const INITIAL_STATE = {
  currentUser: null,
  error: null,
};

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionNames.GOOGLE_SIGN_IN_SUCCESS:
    case ActionNames.EMAIL_SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        error: null,
      };

    case ActionNames.GOOGLE_SIGN_IN_FAILURE:
    case ActionNames.EMAIL_SIGN_IN_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default UserReducer;
