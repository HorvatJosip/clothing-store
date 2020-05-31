export const toggleCartVisibility = () => ({
  type: NAMES.TOGGLE_CART_VISIBILITY,
});

export const addItem = item => ({
  type: NAMES.ADD_ITEM,
  payload: item,
});

const NAMES = {
  TOGGLE_CART_VISIBILITY: 'TOGGLE_CART_VISIBILITY',
  ADD_ITEM: 'ADD_ITEM',
};

export default NAMES;
