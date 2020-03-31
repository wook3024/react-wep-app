import React from "react";
import styled from "styled-components";

import Postcard from "../components/postcard";
import PostForm from "../components/postForm";
import "./App.css";

const Div = styled.div``;

const Profile = () => {
  return (
    <Div>
      <PostForm />
      <Postcard />
    </Div>
  );
};

export default Profile;
