import ActionNames from './UserActions';

const INITIAL_STATE = {
  currentUser: null,
  error: null,
};

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionNames.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        error: null,
      };

    case ActionNames.SIGN_OUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        error: null,
      };

    case ActionNames.SIGN_UP_FAILURE:
    case ActionNames.SIGN_IN_FAILURE:
    case ActionNames.SIGN_OUT_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default UserReducer;
