import React, { useEffect, lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Spinner from './components/Spinner/Spinner';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';

import { selectCurrentUser } from './redux/user/UserSelectors';
import { checkUserSession } from './redux/user/UserActions';

import './App.css';

const ShopPage = lazy(() => import('./pages/ShopPage/ShopPage'));
const AccountPage = lazy(() => import('./pages/AccountPage/AccountPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage/CheckoutPage'));

const App = ({ checkUserSession, currentUser }) => {
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  return (
    <div>
      <Header />
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Suspense fallback={<Spinner />}>
          <Route path='/shop' component={ShopPage} />
          <Route exact path='/checkout' component={CheckoutPage} />
          <Route
            exact
            path='/account'
            render={() => (currentUser ? <Redirect to='/' /> : <AccountPage />)}
          />
        </Suspense>
      </Switch>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = dispatch => ({
  checkUserSession: () => dispatch(checkUserSession()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
