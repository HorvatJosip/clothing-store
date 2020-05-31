export const toggleCartVisibility = () => ({
  type: NAMES.TOGGLE_CART_VISIBILITY,
});

export const addItem = item => ({
  type: NAMES.ADD_ITEM,
  payload: item,
});

export const removeItem = item => ({
  type: NAMES.REMOVE_ITEM,
  payload: item,
});

export const clearItemFromCart = item => ({
  type: NAMES.CLEAR_ITEM_FROM_CART,
  payload: item,
});

const NAMES = {
  TOGGLE_CART_VISIBILITY: 'TOGGLE_CART_VISIBILITY',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_ITEM_FROM_CART: 'CLEAR_ITEM_FROM_CART',
};

export default NAMES;
