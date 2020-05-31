import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store as ReduxStore, persistor } from './redux/Store';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={ReduxStore}>
      <BrowserRouter>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
