import React from 'react';

import './FlatButton.scss';

const FlatButton = ({ children, isGoogleSignIn, inverted, ...otherProps }) => (
  <button
    className={`${inverted ? 'inverted' : ''} ${
      isGoogleSignIn ? 'google-sign-in' : ''
    } flat-button`}
    {...otherProps}
  >
    {children}
  </button>
);

export default FlatButton;
