import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { persistStore } from 'redux-persist';

import RootReducer from './RootReducer';

const middlewares = [];

if(process.env.NODE_ENV === 'development'){
    middlewares.push(logger);
}

const store = createStore(RootReducer, applyMiddleware(...middlewares));

const persistor = persistStore(store);

export { store, persistor };
