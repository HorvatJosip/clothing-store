export const setCurrentUser = user => ({
  type: NAMES.SET_CURRENT_USER,
  payload: user,
});

const NAMES = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',
};

export default NAMES;
