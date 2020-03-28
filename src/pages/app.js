import React from "react";

import Connection from "../Route/index";
import { BrowserRouter } from "react-router-dom";
import Navigation from "../components/navigation";

const App = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <Connection />
    </BrowserRouter>
  );
};

export default App;
