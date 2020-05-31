import ActionNames from './CartActions';

import { addItemToCart } from './CartUtils';

const INITIAL_STATE = {
  hidden: true,
  cartItems: [],
};

const CartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionNames.TOGGLE_CART_VISIBILITY:
      return {
        ...state,
        hidden: !state.hidden,
      };

    case ActionNames.ADD_ITEM:
      return {
        ...state,
        cartItems: addItemToCart(state.cartItems, action.payload),
      };

    default:
      return state;
  }
};

export default CartReducer;
