export const toggleCartVisibility = () => ({
  type: NAMES.toggleCartVisibility,
});

export const addItem = item => ({
  type: NAMES.addItem,
  payload: item,
});

const NAMES = {
  toggleCartVisibility: 'TOGGLE_CART_VISIBILITY',
  addItem: 'ADD_ITEM',
};

export default NAMES;
