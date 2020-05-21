import React from 'react';

import SignIn from '../../components/SignIn/SignIn';
import SignOut from '../../components/SignOut/SignOut';

import './AccountPage.scss';

const AccountPage = () => (
  <div className='account'>
    <SignIn />
    <SignOut />
  </div>
);

export default AccountPage;
