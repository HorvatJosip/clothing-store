import React from 'react';

import FlatButton from '../FlatButton/FlatButton';

import './CartDropDown.scss';

const CartDropDown = () => (
  <div className='cart-drop-down'>
    <div className='cart-items' />
    <FlatButton>Go to checkout</FlatButton>
  </div>
);

export default CartDropDown;
