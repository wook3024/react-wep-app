import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";

import SignIn from "../pages/signin";
import Profile from "../pages/profile";
import SignUp from "../pages/signup";
import Post from "../pages/post";
import Hashtag from "../pages/hashtag";

const Div = styled.div``;

const Connecting = () => {
  return (
    <Switch>
      <Suspense fallback={<Div>Loading...</Div>}>
        <Route path="/signin" component={SignIn} />
        <Route path="/profile" component={Profile} />
        <Route path="/signUp" component={SignUp} />
        <Route path="/main" component={Post} />
        <Route path="/hashtag" component={Hashtag} />
      </Suspense>
    </Switch>
  );
};

export default Connecting;
