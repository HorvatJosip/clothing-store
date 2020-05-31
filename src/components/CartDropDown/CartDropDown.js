import React from 'react';
import { connect } from 'react-redux';

import FlatButton from '../FlatButton/FlatButton';
import CartItem from '../CartItem/CartItem';

import './CartDropDown.scss';

const CartDropDown = ({ cartItems }) => (
  <div className='cart-drop-down'>
    <div className='cart-items'>
      {cartItems.map(cartItem => (
        <CartItem key={cartItem.id} item={cartItem} />
      ))}
    </div>
    <FlatButton>Go to checkout</FlatButton>
  </div>
);

const mapStateToProps = ({ cart: { cartItems } }) => ({
  cartItems,
});

export default connect(mapStateToProps)(CartDropDown);
