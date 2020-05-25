import React from 'react';
import { connect } from 'react-redux';

import FlatButton from '../FlatButton/FlatButton';
import { addItem } from '../../redux/cart/CartActions';

import './CollectionItem.scss';

const CollectionItem = ({ item, addItem }) => {
  const { name, price, imageUrl } = item;

  return (
    <div className='collection-item'>
      <div
        className='image'
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      ></div>
      <div className='collection-footer'>
        <span className='name'>{name}</span>
        <span className='price'>{`$${price}`}</span>
      </div>
      <FlatButton inverted onClick={() => addItem(item)}>
        Add to cart
      </FlatButton>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  addItem: item => dispatch(addItem(item)),
});

export default connect(null, mapDispatchToProps)(CollectionItem);
