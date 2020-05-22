import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import ShopPage from './pages/ShopPage/ShopPage';
import AccountPage from './pages/AccountPage/AccountPage';

import { auth, createUserProfileDocument } from './firebase/firebaseUtils';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (!userAuth) {
        this.setState({ currentUser: null });
        return;
      }

      const userRef = await createUserProfileDocument(userAuth);

      userRef.onSnapshot(snapshot => {
        this.setState({
          currentUser: {
            id: snapshot.id,
            ...snapshot.data(),
          },
        });
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header user={this.state.currentUser} />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/shop' component={ShopPage} />
          <Route path='/account' component={AccountPage} />
        </Switch>
      </div>
    );
  }
}

export default App;
