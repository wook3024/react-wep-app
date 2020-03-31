import React, { Suspense } from "react";
import SignIn from "../pages/signin";
import Profile from "../pages/profile";
import SignUp from "../pages/signup";
import Index from "../pages/index";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";

const Div = styled.div``;

const Connecting = () => {
  return (
    <>
      <Switch>
        <Suspense fallback={<Div>Loading...</Div>}>
          <Route path="/signin" component={SignIn} />
          <Route path="/profile" component={Profile} />
          <Route path="/signUp" component={SignUp} />
          <Route path="/index" component={Index} />
        </Suspense>
      </Switch>
    </>
  );
};

export default Connecting;
