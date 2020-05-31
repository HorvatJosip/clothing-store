import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import FlatButton from '../FlatButton/FlatButton';
import CartItem from '../CartItem/CartItem';
import { selectCartItems } from '../../redux/cart/CartSelectors';
import { toggleCartVisibility } from '../../redux/cart/CartActions';

import './CartDropDown.scss';

const CartDropDown = ({ cartItems, history, dispatch }) => (
  <div className='cart-drop-down'>
    <div className='cart-items'>
      {cartItems.length ? (
        cartItems.map(cartItem => (
          <CartItem key={cartItem.id} item={cartItem} />
        ))
      ) : (
        <span className='empty-message'>Your cart is empty</span>
      )}
    </div>
    <FlatButton
      onClick={() => {
        history.push('/checkout');
        dispatch(toggleCartVisibility());
      }}
    >
      Go to checkout
    </FlatButton>
  </div>
);

const mapStateToProps = createStructuredSelector({
  cartItems: selectCartItems,
});

export default withRouter(connect(mapStateToProps)(CartDropDown));
