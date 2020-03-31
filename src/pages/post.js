import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import axios from "axios";

import { GET_POST_DATA } from "../reducers/actions";
import Postcard from "../components/postcard";
import PostForm from "../components/postForm";
import "./App.css";

const Div = styled.div``;

const Profile = () => {
  const { post } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/post"
    }).then(postData => {
      dispatch({
        type: GET_POST_DATA,
        payload: postData.data
      });
    });
  }, [dispatch, post.length]);

  return (
    <Div>
      <PostForm />
      {post.map(data => {
        return <Postcard key={data.created_at} post={{ data }} />;
      })}
    </Div>
  );
};

export default Profile;
