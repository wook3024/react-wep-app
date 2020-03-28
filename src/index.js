import React from "react";
import ReactDOM from "react-dom";

import reducer from "./reducers/index";
import { createStore } from "redux";
import { Provider } from "react-redux";

import "./pages/App.css";
import App from "./pages/app";

let store = createStore(reducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
