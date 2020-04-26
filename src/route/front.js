import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";

const SignIn = lazy(() => import("../pages/signin"));
const Profile = lazy(() => import("../pages/profile"));
const SignUp = lazy(() => import("../pages/signup"));
const Post = lazy(() => import("../pages/post"));
const Hashtag = lazy(() => import("../pages/hashtag"));
const Search = lazy(() => import("../pages/searchtag"));
const Lookuppost = lazy(() => import("../pages/lookuppost"));

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
        <Route path="/searchtag" component={Search} />
        <Route path="/lookuppost" component={Lookuppost} />
      </Suspense>
    </Switch>
  );
};

export default Connecting;
