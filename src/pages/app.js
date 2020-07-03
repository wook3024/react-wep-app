import React from "react";
import axios from "axios";

import reducer from "../reducers/index";
import { createStore } from "redux";
import { Provider } from "react-redux";

import Connection from "../route/front";
import Navigation from "../components/navigation";

axios.defaults.baseURL = "http://18.211.13.162";

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
