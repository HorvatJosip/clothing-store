import ActionNames from './CartActions';

import { addItemToCart } from './CartUtils';

const INITIAL_STATE = {
  hidden: true,
  cartItems: {},
};

const CartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionNames.toggleCartVisibility:
      return {
        ...state,
        hidden: !state.hidden,
      };

    case ActionNames.addItem:
      return {
        ...state,
        cartItems: addItemToCart(state.cartItems, action.payload),
      };

    default:
      return state;
  }
};

export default CartReducer;
