import React from 'react';

import { CustomButtonContainer } from './FlatButtonStyles';

const FlatButton = ({ children, ...props }) => (
  <CustomButtonContainer {...props}>{children}</CustomButtonContainer>
);

export default FlatButton;
