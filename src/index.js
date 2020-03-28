import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./pages/App.css";
import App from "./pages/app";
import Connection from "./Route/index";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Connection />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
