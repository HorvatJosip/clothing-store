import React, { Component } from 'react';

import FormInput from '../FormInput/FormInput';
import FlatButton from '../FlatButton/FlatButton';

import { auth, signInWithGoogle } from '../../firebase/firebaseUtils';

import './SignIn.scss';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  handleSubmit = async e => {
    e.preventDefault();

    const { email, password } = this.state;

    try {
      await auth.signInWithEmailAndPassword(email, password);

      this.setState({ email: '', password: '' });
    } catch (e) {
      console.error(e.message);
    }
  };

  handleChange = e => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className='sign-in'>
        <h2>I already have an account</h2>
        <span>Sign in with your email and password.</span>

        <form onSubmit={this.handleSubmit}>
          <FormInput
            name='email'
            type='email'
            stuff={this.state.email}
            value={this.state.email}
            handleChange={this.handleChange}
            label='email'
            required
          />
          <FormInput
            name='password'
            type='password'
            value={this.state.password}
            handleChange={this.handleChange}
            label='password'
            required
          />

          <div className='buttons'>
            <FlatButton type='submit'>Sign In</FlatButton>
            <FlatButton onClick={signInWithGoogle} isGoogleSignIn={true}>
              Sign In with Google
            </FlatButton>
          </div>
        </form>
      </div>
    );
  }
}

export default SignIn;
