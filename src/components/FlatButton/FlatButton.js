import React from 'react';

import './FlatButton.scss';

const FlatButton = ({ children, isGoogleSignIn, ...otherProps }) => (
  <button
    className={`${isGoogleSignIn ? 'google-sign-in' : ''} flat-button`}
    {...otherProps}
  >
    {children}
  </button>
);

export default FlatButton;
