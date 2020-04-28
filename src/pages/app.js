import React from "react";
import axios from "axios";

import reducer from "../reducers/index";
import { createStore } from "redux";
import { Provider } from "react-redux";

import Connection from "../route/front";
import Navigation from "../components/navigation";

// axios.defaults.baseURL = "http://18.189.68.3:80";
axios.defaults.baseURL = "http://localhost:6060";

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
