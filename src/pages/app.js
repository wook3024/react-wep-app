import React from "react";
import { Switch, BrowserRouter } from "react-router-dom";
import axios from "axios";
import { createMemoryHistory } from "history";

import reducer from "../reducers/index";
import { createStore } from "redux";
import { Provider } from "react-redux";

import Connection from "../route/front";
import Navigation from "../components/navigation";

const history = createMemoryHistory();
axios.defaults.baseURL = "http://localhost:8080";

let store = createStore(reducer);

const App = () => {
  return (
    <Provider store={store}>
      <Navigation />
      <Connection />
    </Provider>
  );
};

export default App;
