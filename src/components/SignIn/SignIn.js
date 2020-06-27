import React, { useState } from 'react';

import { connect } from 'react-redux';

import FormInput from '../FormInput/FormInput';
import FlatButton from '../FlatButton/FlatButton';

import {
  googleSignInStart,
  emailSignInStart,
} from '../../redux/user/UserActions';

import './SignIn.scss';

const SignIn = ({ emailSignInStart, googleSignInStart }) => {
  const [userData, setUserData] = useState({ email: '', password: '' });

  const { email, password } = userData;

  const handleSubmit = async e => {
    e.preventDefault();

    emailSignInStart(email, password);
  };

  const handleChange = e => {
    const { name, value } = e.target;

    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className='sign-in'>
      <h2>I already have an account</h2>
      <span>Sign in with your email and password.</span>

      <form onSubmit={handleSubmit}>
        <FormInput
          name='email'
          type='email'
          value={email}
          handleChange={handleChange}
          label='email'
          required
        />
        <FormInput
          name='password'
          type='password'
          value={password}
          handleChange={handleChange}
          label='password'
          required
        />

        <div className='buttons'>
          <FlatButton type='submit'>Sign In</FlatButton>
          <FlatButton
            type='button'
            onClick={googleSignInStart}
            isGoogleSignIn={true}
          >
            Sign In with Google
          </FlatButton>
        </div>
      </form>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  googleSignInStart: () => dispatch(googleSignInStart()),
  emailSignInStart: (email, password) =>
    dispatch(emailSignInStart({ email, password })),
});

export default connect(null, mapDispatchToProps)(SignIn);
