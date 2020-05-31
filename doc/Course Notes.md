# React Course Notes

## yarn

`npm i -g yarn`

if you run a script with yarn, it will check if it has same one with 'pre' before it and it will run that one before executing the one you specified (for example there are `deploy` and `predeploy` and when you run `yarn deploy`, it will first run `predeploy` and then `deploy`)

## Deploying to GitHub Pages

`yarn add gh-pages`
Add the following to `package.json`:

``` jso
"homepage": "[https://.github.io/.github.io/ Name>",
. . .
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
. . .
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
. . .
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

![Reducer Flow](.\img\Reducer Flow.png)

![Redux Flow](.\img\Redux Flow.png)

![Reducer Flow](.\img\Reducer Flow Diagram.png)

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

. . .

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

![Redux Result](.\Redux Result.png)

## Cool Stuff

#### Spreading parameters

If we are passing many parameters from an item into a component that match by name, we use the spread operator:

```react
{this.state.sections.map(({ id, ...otherSectionProps }) => (
	<MenuItem key={id} {...otherSectionProps} />
))}
```

#### Sass `mixin`s

If we have a block that we need to repeat, we can use it like this. (`$main-color` is a sass variable)

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