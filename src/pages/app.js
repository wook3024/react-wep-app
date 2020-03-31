import React from "react";
import { BrowserRouter } from "react-router-dom";

import Connection from "../route/front";
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
