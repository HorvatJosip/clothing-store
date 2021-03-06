# React Course Notes

![Responsibilities](./img/Responsibilities.png)

## yarn

`npm i -g yarn`

if you run a script with yarn, it will check if it has same one with 'pre' before it and it will run that one before executing the one you specified (for example there are `deploy` and `predeploy` and when you run `yarn deploy`, it will first run `predeploy` and then `deploy`)

## Deploying to GitHub Pages

`yarn add gh-pages`
Add the following to `package.json`:

``` json
"homepage": "https://<GitHub Username>.github.io/<GitHub Project Name>",
// . . .
"scripts": {
    "predeploy": "yarn build",
    "deploy": "gh-pages -d build"
}
```

## `setState` with reference to state

If there is a need to use the state inside `setState`, always use the overload that takes in a method `(prevState, prevProps) => { <perform state changes here> }` as first parameter. Callback (second parameter) should be used if there is a need to use updated state immediately after it changes.
Constructor of component takes in props which should be passed to `super(props);` If there is no need for it, but there is a need for state, state can be declared as class member by directly using `state = { <values> }` inside the class

## Lifecycle

* `constructor`
* `render`
* `componentDidMount`

Whenever props or state changes (`forceUpdate()` is also there, but should be avoided), `shouldComponentUpdate(nextProps, nextState)` is called which determines if the component should be updated (re-rendered) - if it does, it renders it again (with `render` method) and `componentDidUpdate` is called

Whenever a component gets re-rendered, all of its children get re-rendered. The way to stop that is by using `shouldComponentUpdate`
For example, it doesn't make sense to re-render if `nextProps.text` is the same as `this.props.text`

If for some reason a component is removed (good example is loading), it will go through unmounting phase in which the `componentWillUnmount` method is called before unmounting it from the DOM
So `if(loading)`, mount the loading component, once the loading gets set to false, display something else (inside render, it will go into the `else` block) and this will make react unmount the components inside the `if(loading)`

# SHOP

`yarn add node-sass`

In case of problems:

```bash
rm -rf yarn.lock
rm -rf node_modules/
yarn
```


## Routing 

`yarn add react-router-dom`

* `<BrowserRouter>` - SPA routing - needs to be used to wrap the `App` component inside `index.js`

* `<Route>`

  * component - component to render for the route
  * render - can be used instead of component to render some HTML
  * path - URL path (for example. '/' for home) (can have parameters with `:parameterName`, for example `/people/:personId` which would be stored in `props.match.params.personId`)
  * exact - if we have two routes - '/' and '/people', if we go to '/people' in the browser, it will render both (first component for '/' and then component for '/people') if we don't have exact

* `<Switch>` - wrapper around `<Route>`s - as soon as it hits one of those paths, it won't go further (example for 'exact' would render only '/' path)

* `<Link>`

  * `to` - path to which we want to go (other way to do this is through `props.history.push('/people')`)

  * Dynamic

    ``` react
    <Link to={`${props.match.url}/13`} >To person 13</Link>
    ```

* `withRouter()` - wrapper for component (usage: `export default withRouter(ComponentName);`) that gives it access to things like `history`

## [Firebase](https://console.firebase.google.com/)

On the bottom left, we have a [plan](https://firebase.google.com/pricing) (free by default).

On the "Develop" tab we have the following sections that we need:

* Authentication - sign in methods, users
* Database - data
* Storage - images, videos (assets in general)

To set up the project

* Go to "Project Overview" above the "Develop" tab and click on web icon (`</>`)
* Set nickname that will be used through the console to represent the app (so that it can be visually easier to identify)
* Copy the object that is presented in front of you (set to `firebaseConfig` variable)
* `yarn add firebase`
* Add folder `src/firebase`
* Add the file `firebaseUtils.js` with following content:

``` react
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyBNQ7cxUG7hGpW-Ue8WpSth_V2DHcCeU_o',
  authDomain: 'hoc-clothing-store.firebaseapp.com',
  databaseURL: 'https://hoc-clothing-store.firebaseio.com',
  projectId: 'hoc-clothing-store',
  storageBucket: 'hoc-clothing-store.appspot.com',
  messagingSenderId: '341087581268',
  appId: '1:341087581268:web:3041836edd253b789f69c1',
  measurementId: 'G-RWD13TPQJE',
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

// Always use Google popup for Google Auth Provider usage (auth)
provider.setCustomParameters({
  prompt: 'select_account',
});

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;

```

* Allow Google sign in on Firebase
  * Go to `Develop/Authentication/Users`
  * Click `Set up sign-in method`
  * Under `Sign-in providers`, click on edit button on the right of `Google` item
  * Enable it, select an email for support (contact in case something goes wrong) and click `Save`
* Add a call to `signInWithGoogle` to a button

``` react
import { signInWithGoogle } from '../../firebase/firebaseUtils';
// . . .
render()
(
    <FlatButton onClick={signInWithGoogle}>
        Sign In with Google
    </FlatButton>
)
```

* Save the user to state inside the `App.js`

``` react
import { auth } from '../../firebase/firebaseUtils';
// . . .
unsubscribeFromAuth = null;

componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(user => {
        this.setState({ currentUser: user }, () => console.log(this.state))
    });
}

componentWillUnmount() {
	this.unsubscribeFromAuth();
}
```

* Allow for storing users inside the database

  * Create a collection `users`
  * Add code for adding a user inside the `firebaseUtils.js`

  ``` react
  export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;
  
    const userRef = firestore.collection('users').doc(userAuth.uid);
  
    const snapshot = await userRef.get();
  
    if (!snapshot.exists) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();
  
      try {
        await userRef.set({
          displayName,
          email,
          createdAt,
          ...additionalData,
        });
      } catch (e) {
        console.error('error creating user', e.message);
      }
    }
  
    return userRef;
  };
  ```

  * Change the call inside `componentDidMount`

  ``` react
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
  ```

## Redux

`yarn add redux redux-logger react-redux`

![Reducer Flow](./img/Reducer Flow.png)

![Redux Flow](./img/Redux Flow.png)

![Reducer Flow](./img/Reducer Flow Diagram.png)

First, we have to define actions that are going to occur on specific reducers. Inside the folder `src/redux/user`, we can create `UserActions.js` which will define which actions can be performed by the `UserReducer`.

```react
export const setCurrentUser = user => ({
  type: NAMES.setCurrentUser,
  payload: user,
});

const NAMES = {
  setCurrentUser: 'SET_CURRENT_USER',
};

export default NAMES;
```

Next, based on that, we define how to change the state based on those actions. `state` parameter, which is provided to the reducer defines what the state is at that point. The goal of a reducer is to return an object with new state OR, if state didn't change, unchanged state which means we won't update unnecessarily.

If we need an initial state, we use default parameters to set the default value for the `state` to some initial state that we need for the reducer. The `INITIAL_STATE` is provided to the `state` argument as the default value (initial value).

```react
import ActionNames from './UserActions';

const INITIAL_STATE = {
  currentUser: null,
};

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionNames.setCurrentUser:
      return {
        ...state,
        currentUser: action.payload,
      };

    default:
      return state;
  }
};

export default UserReducer;
```

All of the reducers that we create need to be exposed to the root reducer which will combine all of them:

```react
import { combineReducers } from 'redux';

import UserReducer from './user/UserReducer';

export default combineReducers({
  user: UserReducer,
});
```

Once we have the root reducer, we need to create a store - an object that will be used by redux to manage the state and manage action requests it gets.

```react
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

import RootReducer from './RootReducer';

const middlewares = [logger];

const store = createStore(RootReducer, applyMiddleware(...middlewares));

export default store;
```

Similarly like we wrapped the `App` component with the `BrowserRouter` inside `index.js`, we also need to wrap it with the redux `Provider` to which we pass the store we created previously.

```react
import { Provider } from 'react-redux';
import ReduxStore from './redux/Store';

// . . .

(
    <Provider store={ReduxStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
)
```

In order to now use it, we have to use a HOC (Higher Order Component) that wraps the current component (like `withRouter()` that can be used for routing in order to give the component access to stuff like `history`) with specific method provided by redux that will return the component we defined, but with extended functionalities.

What we want here is access to the store. To achieve this we first import the redux `connect` method.

```react
import { connect } from 'react-redux';
```

This will allow us to connect the component to the store. This method takes in two other methods: `mapStateToProps` and `mapDispatchToProps`.

`mapStateToProps` takes in the state as parameter which means we can use reducers that the state consists of. This means we can get the current user in the `Header` component from redux:

``` react
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Header);
```

`mapDispatchToProps` takes in `dispatch` as parameter which is used for dispatching actions. It adds properties to the current component which are used to actually invoke the defined actions. First, we define the method and pass it into the `connect` that we imported from `react-redux`. If we don't use `mapDispatchToProps`, we can set it as null and just pass in `mapDispatchToProps`.

```react
const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(App);
```

In this case, `connect` will add a prop to the `App` component called `setCurrentUser` which will take in `user` as parameter and dispatch the `setCurrentUser` action that we import from the actions by doing

```react
import { setCurrentUser } from './redux/user/UserActions';
```

Next, we can use it to set the user inside the `componentDidMount`. We can access it from the props, here we use deconstruction on the first line.

```react
const { setCurrentUser } = this.props;

this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
    if (!userAuth) {
        setCurrentUser(null);
        return;
    }

    const userRef = await createUserProfileDocument(userAuth);

    userRef.onSnapshot(snapshot => {
        setCurrentUser({
            id: snapshot.id,
            ...snapshot.data(),
        });
    });
});
```

The process can be visualized nicely from the middleware `redux-logger` we added:

![Redux Result](.\img\Redux Result.png)

## Memoization

The method `mapStateToProps` is called whenever state changes, even if it isn't connected to the reducer from which we are pulling the values.

``` react
const mapStateToProps = ({ cart: { cartItems } }) => ({
  itemCount: cartItems.reduce(
    (currentValue, cartItem) => (currentValue += cartItem.quantity),
    0
  ),
});
```

The example above will re-render the component every time anything changes in the global state. In order to not re-render everything if we assign some values which didn't change, but Redux thinks they did, we need to use `memoization`. There is a library called `reselect` which will help us achieve that and extract our `mapStateToProps` logic code into something reusable.

`yarn add reselect`

It allows us to write selectors:

* Input selector - doesn't use `createSelector`
  * Example: `const selectCart = state => state.cart;`
* Output selector - uses input selectors and `createSelector` to build themselves
  * `createSelector` takes in 2 arguments:
  * Array of input selectors
  * Function that will return the value we need
    * Parameters that will be passed in are selectors passed in as first argument
  * Example:

``` react
const selectCart = state => state.cart;

export const selectCartItems = createSelector(
  [selectCart],
  cart => cart.cartItems
);

export const selectCartItemsCount = createSelector(
  [selectCartItems],
  cartItems =>
    cartItems.reduce(
      (currentValue, cartItem) => (currentValue += cartItem.quantity),
      0
    )
);
```

And now, to use it, we just import it and use it by passing in the state:

``` react
import { selectCartItemsCount } from '../../redux/cart/CartSelectors';

// . . .

const mapStateToProps = state => ({
  itemCount: selectCartItemsCount(state),
});
```

If we have multiple selectors in `mapStateToProps`, we can use a structured selector to convert for example this:

``` react
const mapStateToProps = state => ({
  currentUser: selectCurrentUser(state),
  hidden: selectCartHidden(state),
});
```

to this:

``` react
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  hidden: selectCartHidden,
});
```

And this is the way we should use it always, even if we have only one selector. This is future proof.

## Redux persist

`yarn add redux-persist`

After we create a store in `Store.js`, we need to give it to `redux-persist` and then export the `persistor`:

``` react
// . . .

const store = createStore(RootReducer, applyMiddleware(...middlewares));

const persistor = persistStore(store);

export default { store, persistor };
```

Next, inside the `RootReducer.js` file, we need to add persistence as well: 

``` react
import { persistReducer } from 'redux-persist';
// use localStorage
import storage from 'redux-persist/lib/storage';
// OR...
// use sessionStorage
import storage from 'redux-persist/lib/storage/session';
```

After that, we have to define the config which consists of the following:

* `key` - at what point of our reducer do we want to start storing everything (from which reducer - 'root' will apply it to root reducer which will in turn apply it to all reducers)
* `storage` - what type of storage we want to use - here we pass in the imported storage defined in previous step
* `whitelist` - names of reducers we want to store
  * For example, we want to persist the cart reducer because we are handling it. The user reducer can stay intact because it is being handled by Firebase.

Now we are able to use the persistence by modifying the store logic slightly:

``` react
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'],
};

const rootReducer = combineReducers({
  user: UserReducer,
  cart: CartReducer,
});

export default persistReducer(persistConfig, rootReducer);
```

To make this work, we need to add it to our `index.js`:

```react
import { PersistGate } from 'redux-persist/integration/react';
```

The `redux-persist` exists for multiple platforms (React, React Native, Electron) which means there are platform specific implementations and here we are importing the one for React.

After that, we need to modify import of the store to match the changed export:

```react
import { ReduxStore, persistor } from './redux/Store';
```

Last step is wrapping the `App` with `PersistGate` to which we pass in the `persistor`:

``` react
<PersistGate persistor={persistor}>
    <App />
</PersistGate>
```

## Handling route parameters

``` react
<div className='shop-page'>
    <Route exact path={`${match.path}`} component={CollectionsOverview} />

    <Route path={`${match.path}/:collectionId`} component={CollectionPage} />
</div>
```

Here we are using a default route for shop and a route for different collections that are handled by `CollectionPage`.

Inside the `CollectionPage`, we are using `mapStateToProps` with both of its arguments in order to select a collection based on route (passed in parameter defined as `collectionId`). The parameter will be passed into the component through the props inside the `match.params` object.

``` react
const mapStateToProps = (state, ownProps) => ({
  collection: selectCollection(ownProps.match.params.collectionId)(state),
});
```

`selectCollection` is written as a selector that is constructed from a parameter (in this case `collectionId`):

``` react
export const selectCollection = collectionUrlParam =>
  createSelector(
    [selectCollections],
    collections => collections[collectionUrlParam]
  );
```

## Deploying

* Create Heroku account
* Download and install their [CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
* Test that it works by running `heroku --version` in the terminal
* Login into the CLI by using `heroku login`
* Create a Heroku project: `heroku create <project name> --buildpack https://github.com/mars/create-react-app-buildpack.git`
  * `--buildpack` - specific configuration for the build we want - deploys our React app as a static website (best and most efficient way to host the React project with `create-react-app`)
*  Upload the project to Heroku: `git push heroku master`
* To open the site, use `heroku open`
* To allow Google sign in again, do the following:
  * Go to the [Firebase console](https://console.firebase.google.com/) and then click on your project
  * Go to `Authentication` - `Sign-in method` and scroll to `Authorized domains` and add Heroku app domain
* Optional: [automate the deploys after code push](https://devcenter.heroku.com/articles/github-integration#automatic-deploys)

## Styled components

`yarn add styled-components`

Prevents global classes problem. Benefits of JavaScript alongside Sass.

``` react
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

const OptionContainerStyles = css`
  padding: 10px 15px;
  cursor: pointer;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;
  height: 70%;
  margin: 0 0 25px 0;
`;

export const LogoContainer = styled(Link)`
  width: 70px;
  height: 100%;
  padding: 25px;
`;

export const OptionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  width: 50%;
  height: 100%;
`;

export const OptionLink = styled(Link)`
  ${OptionContainerStyles}
`;

export const OptionDiv = styled.div`
  ${OptionContainerStyles}
`;

```

If the only difference in type of element, we don't have to reuse the styles with `css`, but we can delete the `OptionDiv` and tell the `OptionLink` to act as a `div` by doing `<OptionLink as='div' />` (`as` can take in a component as well):

``` react
import styled from "styled-components";
import { Link } from "react-router-dom";

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;
  height: 70%;
  margin: 0 0 25px 0;
`;

export const LogoContainer = styled(Link)`
  width: 70px;
  height: 100%;
  padding: 25px;
`;

export const OptionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  width: 50%;
  height: 100%;
`;

export const OptionLink = styled(Link)`
  padding: 10px 15px;
  cursor: pointer;
`;

// . . .

<OptionLink as='div' onClick={() => auth.signOut()}>
    SIGN OUT
</OptionLink>
```

## Extending Firebase usage

Reminder from previous Firebase section (`userAuth` is parameter that contains information about the user):

``` javascript
const userRef = firestore.collection('users').doc(userAuth.uid);

const snapshot = await userRef.get();

if (!snapshot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
        await userRef.set({
            displayName,
            email,
            createdAt,
            ...additionalData,
        });
    } catch (e) {
        console.error('error creating user', e.message);
    }
}
```

In Firebase we work with references and snapshots. `userRef` is a `DocumentReference` because we used the `doc` method. If we referenced a collection (method `collection`), we would get back a `CollectionReference`.

There are few operations we can perform:

* On a `CollectionReference`, we can use `add` method to insert a document into the collection or a `get` method to retrieve its snapshot
  * `get` method returns a `QuerySnapshot`
    * We can check if the collection is empty by using the `empty` property. If it isn't empty, we can get all of the documents inside of it by using `docs` method (number of documents can be checked by using the `size` property) which is an array of document snapshots
* On a `DocumentReference`, we can perform CRUD operations with methods `set`, `get`, `update` and `delete`
  * `get` method returns a `DocumentSnapshot`
    * We can check if the document exists by using its `exists` property. If it exists, we can get its properties by using `data` method which returns a JSON object

There are several types that can be used for fields (columns):

* String
* Number
* Boolean
* Map (dictionary) (JavaScript object)
* Array (Map where index is the key)
* Null
* Timestamp
* `Geopoint`

We can add documents in batches. Here is an example where we insert a collection and documents inside of it:

``` javascript
const addCollectionAndDocuments = (collectionKey, objectsToAdd) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();

  objectsToAdd.forEach(obj => {
    // If we don't pass anything to the doc method, we are telling it to create a new document with unique id
    const newDocRef = collectionRef.doc();

    batch.set(newDocRef, obj);
  });

  return batch.commit();
};
```

## Implementing Firebase data

``` react
  import {
    firestore,
    convertCollectionsSnapshotToMap,
  } from '../../firebase/firebaseUtils';
  import { updateCollections } from '../../redux/shop/ShopActions';

  // . . .

  unsubscribeFromSnapshot = null;

  componentDidMount() {
    const { updateCollections } = this.props;
    const collectionRef = firestore.collection('collections');

    this.unsubscribeFromSnapshot = collectionRef.onSnapshot(async snapshot => {
      updateCollections(convertCollectionsSnapshotToMap(snapshot));
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromSnapshot();
  }
```

`onSnapshot` takes in an observer that will be notified with initial data and whenever data changes in the collection.

**If we don't want to use the observable pattern, we can use the `get` method which will return a promise.**

If we want to use the **Fetch API**, we can make calls to the following URL: `https://firestore.googleapis.com/v1/projects/<your project id>/databases/(default)/documents/`.

> The Project ID is available by clicking on the gear icon (next to Project Overview) => Project settings

If we want to get the users in the database, we would use Fetch API GET request to `https://firestore.googleapis.com/v1/projects/<your project id>/databases/(default)/documents/users`. But that is really inconvenient using Firebase database. 

`convertCollectionsSnapshotToMap` utility:

``` react
export const convertCollectionsSnapshotToMap = snapshot => {
  const transformedCollection = snapshot.docs.map(doc => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items,
    };
  });

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;

    return accumulator;
  }, {}); // {} is initial accumulator value
};
```

## Higher Order Component (HOC)

A component that takes in another component as parameter. For example, we can make a loading HOC:

``` react
const WithSpinner = WrappedComponent => ({ isLoading, ...otherProps }) => {
  return isLoading ? (
    <SpinnerOverlay>
      <SpinnerContainer />
    </SpinnerOverlay>
  ) : (
    <WrappedComponent {...otherProps} />
  );
};
```

and use it on a page:

```react
const CollectionsOverviewWithSpinner = WithSpinner(CollectionsOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

// . . .

    const { match } = this.props;
    const { loading } = this.state;

    return (
      <div className='shop-page'>
        <Route
          exact
          path={`${match.path}`}
          render={props => (
            <CollectionsOverviewWithSpinner isLoading={loading} {...props} />
          )}
        />

        <Route
          path={`${match.path}/:collectionId`}
          render={props => (
            <CollectionPageWithSpinner isLoading={loading} {...props} />
          )}
        />
      </div>
    );
```

## Redux Thunk

`yarn add redux-thunk`

Allows us to handle asynchronous event handling and firing multiple actions.

We need to add it as a middleware inside `Store.js`:

``` react
import thunk from 'redux-thunk';

const middlewares = [thunk];
```

Basically, if `redux-thunk` is enabled, any time you attempt to `dispatch` a function instead of an object, the middleware will call that function with `dispatch` method itself as the first argument.

This makes writing asynchronous actions easy to write:

``` javascript
import {
  firestore,
  convertCollectionsSnapshotToMap,
} from '../../firebase/firebaseUtils';

export const fetchCollectionsStart = () => ({
  type: NAMES.FETCH_COLLECTIONS_START,
});

export const fetchCollectionsSuccess = collectionsMap => ({
  type: NAMES.FETCH_COLLECTIONS_SUCCESS,
  payload: collectionsMap,
});

export const fetchCollectionsFailure = errorMessage => ({
  type: NAMES.FETCH_COLLECTIONS_FAILURE,
  payload: errorMessage,
});

export const fetchCollectionsStartAsync = () => dispatch => {
  dispatch(fetchCollectionsStart());

  const collectionRef = firestore.collection('collections');

  collectionRef
    .get()
    .then(async snapshot => {
      const collectionsMap = convertCollectionsSnapshotToMap(snapshot);

      dispatch(fetchCollectionsSuccess(collectionsMap));
    })
    .catch(error => dispatch(fetchCollectionsFailure(error)));
};

const NAMES = {
  FETCH_COLLECTIONS_START: 'FETCH_COLLECTIONS_START',
  FETCH_COLLECTIONS_SUCCESS: 'FETCH_COLLECTIONS_SUCCESS',
  FETCH_COLLECTIONS_FAILURE: 'FETCH_COLLECTIONS_FAILURE',
};

export default NAMES;

```

Now, we can make a selector for `isFetching`:

``` javascript
export const selectIsFetchingCollection = createSelector(
  [selectShop],
  shop => shop.isFetching
);
```

and use it inside the `ShopPage`:

```react
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import CollectionsOverview from '../../components/CollectionsOverview/CollectionsOverview';
import CollectionPage from '../CollectionPage/CollectionPage';
import WithSpinner from '../../components/WithSpinner/WithSpinner';

import { fetchCollectionsStartAsync } from '../../redux/shop/ShopActions';
import { selectIsFetchingCollection } from '../../redux/shop/ShopSelectors';

const CollectionsOverviewWithSpinner = WithSpinner(CollectionsOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

class ShopPage extends Component {
  componentDidMount() {
    const { fetchCollectionsStartAsync } = this.props;
    fetchCollectionsStartAsync();
  }

  render() {
    const { match, isFetchingCollections } = this.props;

    return (
      <div className='shop-page'>
        <Route
          exact
          path={`${match.path}`}
          render={props => (
            <CollectionsOverviewWithSpinner
              isLoading={isFetchingCollections}
              {...props}
            />
          )}
        />

        <Route
          path={`${match.path}/:collectionId`}
          render={props => (
            <CollectionPageWithSpinner
              isLoading={isFetchingCollections}
              {...props}
            />
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  isFetchingCollections: selectIsFetchingCollection,
});

const mapDispatchToProps = dispatch => ({
  fetchCollectionsStartAsync: () => dispatch(fetchCollectionsStartAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopPage);

```

## Container pattern

Moving HOC nesting inside a separate file. Example:

``` javascript
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { selectIsFetchingCollections } from '../../redux/shop/ShopSelectors';

import WithSpinner from '../WithSpinner/WithSpinner';
import CollectionsOverview from './CollectionsOverview';

const mapStateToProps = createStructuredSelector({
  // We must make sure that the name matches the property of WithSpinner HOC
  isLoading: selectIsFetchingCollections,
});

// compose will do it from bottom to top:
// CollectionsOverview will get passed into WithSpinner and then
// that component will be passed into connect
const CollectionsOverviewContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(CollectionsOverview);

export default CollectionsOverviewContainer;

```

Doing this makes the `ShopPage` code much nicer and easier to read:

``` react
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CollectionsOverviewContainer from '../../components/CollectionsOverview/CollectionsOverviewContainer';
import CollectionPageContainer from '../../pages/CollectionPage/CollectionPageContainer';

import { fetchCollectionsStartAsync } from '../../redux/shop/ShopActions';

class ShopPage extends Component {
  componentDidMount() {
    const { fetchCollectionsStartAsync } = this.props;
    fetchCollectionsStartAsync();
  }

  render() {
    const { match } = this.props;

    return (
      <div className='shop-page'>
        <Route
          exact
          path={`${match.path}`}
          component={CollectionsOverviewContainer}
        />

        <Route
          path={`${match.path}/:collectionId`}
          component={CollectionPageContainer}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchCollectionsStartAsync: () => dispatch(fetchCollectionsStartAsync()),
});

export default connect(null, mapDispatchToProps)(ShopPage);

```

## Redux Saga

`yarn add redux-saga`

Popular way of handling side effects - API calls or something that triggers an impure reaction (function that doesn't always return the same value - for example, API call may return data or it may return an error because it failed to fetch data).

Based on generator methods (`async` and `await` are built on top of them):

``` javascript
function* generator(number) {
    yield number;
    yield number + 10;
    return 25;
}

const g = generator(10);
g.next(); // Output: { value: 10, done: false }
g.next(); // Output: { value: 20, done: false }
g.next(); // Output: { value: 25, done: true }
```

Saga example for fetching collections:

##### Original

```javascript
export const fetchCollectionsStartAsync = () => dispatch => {
  dispatch(fetchCollectionsStart());

  const collectionRef = firestore.collection('collections');

  collectionRef
    .get()
    .then(async snapshot => {
      const collectionsMap = convertCollectionsSnapshotToMap(snapshot);

      dispatch(fetchCollectionsSuccess(collectionsMap));
    })
    .catch(error => dispatch(fetchCollectionsFailure(error)));
};
```

##### As saga

``` javascript
// takeEvery - listens for every action of a specific type we pass to it
// call:
//    Instead of calling the method directly, we defer control back to the saga middleware
//    In case it needs to cancel, saga can cancel it for us
// put - dispatching
import { takeEvery, call, put } from 'redux-saga/effects';

import {
  firestore,
  convertCollectionsSnapshotToMap,
} from '../../firebase/firebaseUtils';

import {
  fetchCollectionsSuccess,
  fetchCollectionsFailure,
} from './ShopActions';

import ShopActions from './ShopActions';

export function* fetchCollectionsAsync() {
  try {
    const collectionRef = firestore.collection('collections');

    // When this value comes back, it comes back in a promise form (similar to await)
    const snapshot = yield collectionRef.get();

    const collectionsMap = yield call(
      convertCollectionsSnapshotToMap,
      snapshot
    );

    yield put(fetchCollectionsSuccess(collectionsMap));
  } catch (error) {
    yield put(fetchCollectionsFailure(error));
  }
}

export function* fetchCollectionsStart() {
  yield takeEvery(ShopActions.FETCH_COLLECTIONS_START, fetchCollectionsAsync);
}

```

There are different saga `effects`:

* `take` - waits for the given action to happen; when it does, it returns a payload
  * The code that is written after the take will happen only once
  * `take` effects are taking an action from the regular redux flow, processing it and then passing the result to regular Redux flow by passing the actions to reducers (success or failure)

`const incrementPayload = yield take('INCREMENT')`

* `takeEvery`
  * The function (task) we pass to it happens every time the action we specify occurs
  * Similar to `take` inside `while(true)` loop

`yield takeEvery('INCREMENT', incrementHandlerGeneratorFunction)`

* `takeLatest` - it will cancel any previous that are being processed and let only the latest one go through (for example, something is triggered by click, we click once and it doesn't finish what it was processing and we click again, it gets canceled and a new saga is launched)

`yield takeLatest('INCREMENT', incrementHandlerGeneratorFunction)`

* `delay` - puts the saga on hold (sleeps on that thread)

`yield delay(3000)`

* `call`
  * Instead of calling the method directly, we defer control back to the saga middleware
  * In case it needs to cancel, saga can cancel it for us

`yield call(methodToCall, parametersForTheMethod)`

* put - dispatching the action

`yield put(sameAsForDispatch)`

Inside the store, we should add code to setup the saga middleware:

``` javascript
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

import rootSaga from './RootSaga';

const middlewares = [sagaMiddleware];

const store = createStore(RootReducer, applyMiddleware(...middlewares));

sagaMiddleware.run(rootSaga);
```

The root saga will contain all of the sagas:

```javascript
import { all, call } from 'redux-saga/effects';

import { fetchCollectionsStart } from './shop/ShopSagas';

export default function* rootSaga() {
  yield all([call(fetchCollectionsStart)]);
}
```

The `all` effect is used so that we can initialize all sagas side by side instead of one by one.

## Hooks

### `useState`

`const [name, setName] = useState('Hoc');`

### `useEffect`

Used for firing side effects inside functional components.

The method we pass into It as first parameter gets called whenever the component changes or when another component updates and re-renders.

The second parameter is an array of state properties which will trigger the method when they change. For example, if we pass in `[name]` (specified by the `useState` call from above), it wouldn't react on other properties inside the state. The method would only be called when the component mounts (`onComponentDidMount`) and whenever the `name` property changes. If we want the method to only be fired when the component mounts, we just need to pass in an empty array ("I want this effect to depend on nothing").

If we don't pass in anything as second argument (meaning it should call the given method on every side effect), using `setName` inside of it would create an infinite loop because we are changing the state and it fires every time the state has changed. Here is an example of how to use it propertly:

``` javascript
const [user, setUser] = useState(null);
const [searchQuery, setSearchQuery] = useState('Bret');

useEffect(() => {
    const fetchFunc = async () => {
        const response = await fetch(
        	`https://jsonplaceholder.typicode.com/users?username=${searchQuery}`
        );
        
        const response = await response.json();
        
        setUser(response[0]);
    }
    
    fetchFunc();
}, [searchQuery]);
```

### Rules

* The method we pass into `useEffect` cannot return anything - this means that asynchronous methods should be declared and then called after declaration
  * The reason is because it can return a function that will be called once the component unmounts, nothing else is accepted as return value
* `useEffect` must be positioned on the top level, it cannot be nested inside, for example, an if statement

When we talk about rendering cycles in our components, we know that our `ShopPage` component will only re-render if either our props change or if we called `setState` inside (`useState` hook) or if the parent of this component (`App` component) ends up calling re-render. The only time we know that will happen is if the property on `App` component (called `currentUser`) changes. If we don't listen for that kind of change, we will end up calling `useEffect` twice (because the user signed in and the `App` component re-rendered).

Giving an empty array to `useEffect` will cause a warning so we can pass in the method that comes from `mapDispatchToProps` because we know it won't change.

If we need to do something once the component unmounts (in `componentWillUnmount`), we can return a function inside the first parameter that we give to `useEffect`.

### `useEffect` cheat sheet

* `componentDidMount`

``` javascript
//Class
componentDidMount() {
    console.log('I just mounted!');
}
 
//Hooks
useEffect(() => {
    console.log('I just mounted!');
}, []);
```

* `componentWillUnmount`

``` javascript
//Class
componentWillUnmount() {
    console.log('I am unmounting');
}
 
//Hooks
useEffect(() => {
    return () => console.log('I am unmounting');
}, []);
```

* `componentWillReceiveProps`

``` javascript
//Class
componentWillReceiveProps(nextProps) {
    if (nextProps.count !== this.props.count) {
        console.log('count changed', nextProps.count);
    }
}
 
//Hooks
useEffect(() => {
    console.log('count changed', props.count);
}, [props.count]);
```

### `useReducer`

Redux reducer inside a component.

``` react
const INITIAL_STATE = {
  currentUser: null,
  searchQuery: 'Bret'
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      };
    default:
      return state;
  }
};

const setUser = user => ({
  type: 'SET_USER',
  payload: user
});

const setSearchQuery = queryString => ({
  type: 'SET_SEARCH_QUERY',
  payload: queryString
});

const UseReducerExample = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { user, searchQuery } = state;

  useEffect(() => {
    const fetchFunc = async () => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users?username=${searchQuery}`
      );
      const resJson = await response.json();
      dispatch(setUser(resJson[0]));
    };

    fetchFunc();
  }, [searchQuery]);

  return (
    <Card>
      <input
        type='search'
        value={searchQuery}
        onChange={event => dispatch(setSearchQuery(event.target.value))}
      />
      {user ? (
        <div>
          <h3>{user.name}</h3>
          <h3> {user.username} </h3>
          <h3> {user.email} </h3>
        </div>
      ) : (
        <p>No user found</p>
      )}
    </Card>
  );
};

export default UseReducerExample;
```

#### Custom hooks

Example (`src/effects/UseFetch.js`):

```javascript
import { useState, useEffect } from 'react';

const useFetch = url => {
    const [data, setData] = useState(null);
    
    useEffect(() => {
       const fetchData = async () => {
           const response = await fetch(url);
           
           setData(await response.json());
       }
       
       fetchData();
    }/* , [url] */);
    
    return data;
}

export default useFetch;
```

## Context API

Managing state using React. This is internally used by Redux. 

The benefit of Context API is that it is lightweight, verbose and easy to use. The drawback is that we lose the flexibility of Redux ecosystem - sagas, asynchronous actions, re-composability of the components (no tight coupling like with Context API). Also, we have to write providers and contexts for different sections. Reducer just has one provider where we give it a root reducer.

Big, complex applications should use Redux.

Setting and using initial state

```react
// src/contexts/collections/CollectionsContext.js

import { createContext } from 'react';

import SHOP_DATA from './shop.data';

const CollectionsContext = createContext(SHOP_DATA);

export default CollectionsContext;

/// ...

const CollectionPage = ({ match }) => {
  return (
    <CollectionsContext.Consumer>
      {collections => {
        const collection = collections[match.params.collectionId];
        const { title, items } = collection;

        return (
          <div className='collection-page'>
            <h2 className='title'>{title}</h2>
            <div className='items'>
              {items.map(item => (
                <CollectionItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      }}
    </CollectionsContext.Consumer>
  );
};

// OR, the shorter way:

import React, { useContext } from 'react';
// ...
  const collections = useContext(CollectionsContext);
  const collection = collections[match.params.collectionId];
```

Changing the state:

```react
// src/contexts/CurrentUser/CurrentUserContext.js

import { createContext } from 'react';

const CurrentUserContext = createContext(null);

export default CurrentUserContext;

// ... using state required ...

// We need to wrap components that will use the currentUser (they will receive by using useContext hook)
<CurrentUserContext.Provider value={this.state.currentUser}>
    <Header />
</CurrentUserContext.Provider>
```

Another example:

``` react
// src/contexts/Cart/CartContext.js

import { createContext } from 'react';

const CartContext = createContext({
  hidden: true,
  toggleHidden: () => {},
});

export default CartContext;

// Header
  const [hidden, setHidden] = useState(true);
  const toggleHidden = () => setHidden(!hidden);

// ...

<CartContext.Provider
    value={{
        hidden,
        toggleHidden,
    }}
    >
    <CartIcon />
</CartContext.Provider>

// CartIcon
  const { toggleHidden } = useContext(CartContext);

  return (
    <div className='cart-icon' onClick={toggleHidden}>
      <ShoppingIcon className='shopping-icon' />
      <span className='item-count'>{itemCount}</span>
    </div>
  );
```

Custom provider (`src/providers/cart/CartProvider.js`):

``` react
import React, { createContext, useState, useEffect } from 'react';
import {
  addItemToCart,
  removeItemFromCart,
  filterItemFromCart,
  getCartItemsCount,
  getCartTotal,
} from './cart.utils';

export const CartContext = createContext({
  hidden: true,
  toggleHidden: () => {},
  cartItems: [],
  addItem: () => {},
  removeItem: () => {},
  clearItemFromCart: () => {},
  cartItemsCount: 0,
  total: 0,
});

const CartProvider = ({ children }) => {
  const [hidden, setHidden] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [total, setTotal] = useState(0);

  const toggleHidden = () => setHidden(!hidden);
  const addItem = item => setCartItems(addItemToCart(cartItems, item));
  const removeItem = item => setCartItems(removeItemFromCart(cartItems, item));
  const clearItemFromCart = item =>
    setCartItems(filterItemFromCart(cartItems, item));

  useEffect(() => {
    setCartItemsCount(getCartItemsCount(cartItems));
    setTotal(getCartTotal(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        hidden,
        toggleHidden,
        cartItems,
        addItem,
        removeItem,
        cartItemsCount,
        clearItemFromCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

```

We can then add it to `index.js` just like the Redux provider.

Wherever we need to use the values exposed by `CartContext.Provider.value`, we just need to call `const { <properties we need here> } = useContext(CartContext);` 

## Performance

* `Chunkifying` code

  * with `React.lazy`

  Instead of

  ``` javascript
  import HomePage from './pages/HomePage/HomePage';
  ```

  We can do

  ``` javascript
  const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
  ```

  The problem is that it will throw an error unless we use the `Suspense` component to wrap the `HomePage` component where we want to render it.

  * and with ``React.Suspense`
    * Component that allows you to wrap any part of the application that might be rendering asynchronous components (lazy loading components)
    * It must take in a `fallback` which is any HTML element (usually a spinner or something that indicates loading) that it will render instead of the child element we have given it

  ```react
  <Suspense fallback={<Spinner />}>
      <Route exact path='/' component={HomePage} />
  </Suspense>
  ```

  * We usually want to do this for every page (or any bigger set of components) except the home page (because it is the one that is initially loaded)
  * We can wrap all of those pages in a single `Suspense`

* Adding error boundary to handle errors (network or similar).

```react
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
```

* `memoization`
  * Functional component always re-renders when parent re-renders. To stop it from doing so if no properties have changed, we can use `React memo` (for class based components, we can use `PureComponent`) by wrapping the component with `React.memo` which will `memoize` the component (**`memo` is an optimization if we know that the component will not need to update in certain scenarios, otherwise it is actually bad because the component load time increases if we wrap it with `memo`**)
      * This is also true for `shouldComponentUpdate` and `PureComponent` (`PureComponent` implements the checks inside `shouldComponentUpdate` so that you don't have to do so manually)
      * **It is important to use variables to pass as props and not directly (like <Person person={{name: 'Hoc', age: 22}} />) because that passed in object is created every time `render` method is invoked instead of using reference to the same object. Methods and arrays are also objects which means they have the same effect if passed in directly.**
        * The method creation can be `memoized` using `useCallback` hook. We give it the method we want to use as first parameter and an array of dependencies as the second parameter. It will only recreate the method if some of the dependencies have changed, otherwise it will give us the same method that has been instantiated before.
        * If we want to `memoize` a value of some complex method (for example, something that does mathematically complex operations), we can use `useMemo` hook and store it inside a variable. It is very similar to `useCallback`, but this one expects the method we pass into it to return a value which it will cache. The value will be re-computed only when some of the dependencies change.
      * Many parts of the application are already `memoized` thanks to `reselect`
* `gzip`
  * `gzip` is a compression strategy for the server to have files in smaller package which get unzipped in client's browser. Once it is unzipped it is at full size of the bundles that the zip contains.
  * Add `gzip` to the server
    * `yarn add compression`
    * Inside `server.js`, add these lines:
      * `const compression = require('compression');`
      * `app.use(compression());`
* For testing components, we can wrap them in `Profiler` component that takes in properties `id` which is used for identifying which profiler is logging the data and `onRender` which takes in the following parameters:
  * `id` - the "id" prop of the Profiler tree that has just committed
  * `phase` - either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  * `actualDuration` - time spent rendering the committed update
  * `baseDuration` - estimated time to render the entire subtree without `memoization`
  * `startTime` - when React began rendering this update
  * `commitTime` - when React committed this update
  * `interaction` - the Set of interactions belonging to this update
* [Cheat sheet](https://houssein.me/progressive-react)

## Cool Stuff

#### `process.env`

Contains useful information about the environment. For example, we can use `process.env.NODE_ENV` to determine in which environment is the app running (production, development or test).

#### Spreading parameters

If we are passing many parameters from an item into a component that match by name, we use the spread operator:

```react
{this.state.sections.map(({ id, ...otherSectionProps }) => (
	<MenuItem key={id} {...otherSectionProps} />
))}
```

#### Sass `mixin`s

If we have a block that we need to repeat, we can use it like this. (`$main-color` is a sass variable, e.g. `$main-color: red`)

``` scss
@mixin shrinkLabel {
  top: -14px;
  font-size: 12px;
  color: $main-color;
}

.some-class {
    @include shrinkLabel();
}
```

#### `connect`

In case we use the `connect` method from Redux and don't provide the `mapDispatchToProps`, it will provide the `dispatch` method as a prop to the component. This is useful if we need it only once on that component.

#### `sessionStorage`

Stores data while the session is open - until the tab is closed.

#### `localStorage`

Stores data until we clear it - we will have access to it event after closing the tab or even closing the browser.