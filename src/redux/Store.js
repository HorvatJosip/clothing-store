import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { persistStore } from 'redux-persist';

import RootReducer from './RootReducer';

const middlewares = [logger];

const store = createStore(RootReducer, applyMiddleware(...middlewares));

const persistor = persistStore(store);

export { store, persistor };
