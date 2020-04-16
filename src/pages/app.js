import React from "react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

import Connection from "../route/front";
import Navigation from "../components/navigation";

axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <Connection />
    </BrowserRouter>
  );
};

export default App;
