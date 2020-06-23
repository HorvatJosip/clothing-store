# React Course Notes

![Responsibilities](./img/Responsibilities.png)

## yarn

`npm i -g yarn`

if you run a script with yarn, it will check if it has same one with 'pre' before it and it will run that one before executing the one you specified (for example there are `deploy` and `predeploy` and when you run `yarn deploy`, it will first run `predeploy` and then `deploy`)

## Deploying to GitHub Pages

`yarn add gh-pages`
Add the following to `package.json`:

``` json
"homepage": "[https://.github.io/.github.io/ Name>",
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

Whenever props or state changes `forceUpdate()` is also there, but should be avoided), `shouldComponentUpdate(nextProps, nextState)` is called which determines if the component should be updated (re-rendered) - if it does, it renders it again (with render method) and `componentDidUpdate` is called

Whenever a component gets re-rendered, all of its children get re-rendered. The way to stop that is by using `shouldComponentUpdate`
For example, it doesn't make sense to re-render if `nextProps.text` is the same as `this.props.text`

If for some reason a component is removed (good example is loading), it will go through unmounting phase in which the `componentWillUnmount` method is called before unmounting it form the DOM
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

## Firebase

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

The example above will re-render the component every time anything changes in the global state. In order to not re-render everything if we assign some values which didn't change, but Redux thinks they did, we need to use memoization. There is a library called `reselect` which will help us achieve that and extract our `mapStateToProps` logic code into something reusable.

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