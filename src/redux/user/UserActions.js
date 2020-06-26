export const googleSignInStart = () => ({
  type: NAMES.GOOGLE_SIGN_IN_START,
});

export const emailSignInStart = emailAndPassword => ({
  type: NAMES.EMAIL_SIGN_IN_START,
  payload: emailAndPassword,
});

export const signInSuccess = user => ({
  type: NAMES.SIGN_IN_SUCCESS,
  payload: user,
});

export const signInFailure = error => ({
  type: NAMES.SIGN_IN_FAILURE,
  payload: error,
});

export const checkUserSession = () => ({
  type: NAMES.CHECK_USER_SESSION,
});

export const signOutStart = () => ({
  type: NAMES.SIGN_OUT_START,
});

export const signOutSuccess = () => ({
  type: NAMES.SIGN_OUT_SUCCESS,
});

export const signOutFailure = error => ({
  type: NAMES.SIGN_OUT_FAILURE,
  payload: error,
});

const NAMES = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  GOOGLE_SIGN_IN_START: 'GOOGLE_SIGN_IN_START',
  EMAIL_SIGN_IN_START: 'EMAIL_SIGN_IN_START',
  SIGN_IN_SUCCESS: 'SIGN_IN_SUCCESS',
  SIGN_IN_FAILURE: 'SIGN_IN_FAILURE',
  CHECK_USER_SESSION: 'CHECK_USER_SESSION',
  SIGN_OUT_START: 'SIGN_OUT_START',
  SIGN_OUT_SUCCESS: 'SIGN_OUT_SUCCESS',
  SIGN_OUT_FAILURE: 'SIGN_OUT_FAILURE',
};

export default NAMES;
