export const setCurrentUser = user => ({
  type: NAMES.setCurrentUser,
  payload: user,
});

const NAMES = {
  setCurrentUser: 'SET_CURRENT_USER',
};

export default NAMES;
