import React, { Component } from 'react';

import {
  ErrorImageContainer,
  ErrorImageOverlay,
  ErrorImageText,
} from './ErrorBoundaryStyles';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasErrored: false,
    };
  }

  // Allows us to catch the error inside children ahead of time
  static getDerivedStateFromError(error) {
    // Catches any error that has been thrown by any child of this component

    // Returning an object to set the local state
    // If we do not do this, we are not aware that children inside this component
    // have thrown an error (state will change and we will re-render)
    return { hasErrored: true };
  }

  componentDidCatch(
    // error that occured
    error,
    // information about the error like which component threw the error
    errorInfo
  ) {
    console.error(error);
    console.info(errorInfo);
  }

  render() {
    if (this.state.hasErrored) {
      return (
        <ErrorImageOverlay>
          <ErrorImageContainer imageUrl={'https://i.imgur.com/yW2W9SC.png'}>
            <ErrorImageText>Sorry, this page is broken.</ErrorImageText>
          </ErrorImageContainer>
        </ErrorImageOverlay>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
