import React from 'react';

import SignIn from '../../components/SignIn/SignIn';
import SignOut from '../../components/SignUp/SignUp';

import './AccountPage.scss';

const AccountPage = () => (
  <div className='account'>
    <SignIn />
    <SignOut />
  </div>
);

export default AccountPage;
