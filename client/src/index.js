import React from 'react';
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import {thunk} from 'redux-thunk';
import "./index.css"

import { applyMiddleware, compose} from 'redux';
import reducers from "./reducers/index"
import App from './App';

const store = createStore(reducers, compose(applyMiddleware(thunk)))
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode >
  <Provider store={store}>
    <App />
  </Provider>
  </React.StrictMode>
);
