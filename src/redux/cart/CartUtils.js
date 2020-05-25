export const addItemToCart = (cartItems, newItem) => {
  const existingCartItem = cartItems[newItem.id];

  cartItems[newItem.id] = {
    item: newItem,
    quantity: existingCartItem?.quantity + 1 || 1,
  };

  return cartItems;
};
