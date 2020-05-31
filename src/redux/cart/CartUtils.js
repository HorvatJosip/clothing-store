export const addItemToCart = (cartItems, newItem) => {
  const newCartState = [];
  let found = false;

  cartItems.forEach(cartItem => {
    if (cartItem.id === newItem.id) {
      found = true;
      cartItem.quantity++;
    }

    newCartState.push(cartItem);
  });

  if (!found) {
    newItem.quantity = 1;
    newCartState.push(newItem);
  }

  return newCartState;
};
