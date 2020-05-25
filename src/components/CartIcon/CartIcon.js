import React from 'react';
import { connect } from 'react-redux';

import { ReactComponent as ShoppingIcon } from '../../assets/shopping-bag.svg';
import { toggleCartVisibility } from '../../redux/cart/CartActions';

import './CartIcon.scss';

console.log(toggleCartVisibility());

const CartIcon = ({ toggleCartVisibility }) => (
  <div className='cart-icon' onClick={toggleCartVisibility}>
    <ShoppingIcon className='shopping-icon' />
    <span className='item-count'>0</span>
  </div>
);

const mapDispatchToProps = dispatch => ({
  toggleCartVisibility: () => dispatch(toggleCartVisibility()),
});

export default connect(null, mapDispatchToProps)(CartIcon);
