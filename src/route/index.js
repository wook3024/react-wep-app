import React, { Suspense } from "react";
import Home from "../pages/home";
import Profile from "../pages/profile";
import SignUp from "../pages/signup";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";

const Div = styled.div``;

const Connecting = () => {
  return (
    <>
      <Switch>
        <Suspense fallback={<Div>Loading...</Div>}>
          <Route path="/home" component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/signUp" component={SignUp} />
        </Suspense>
      </Switch>
    </>
  );
};

export default Connecting;
