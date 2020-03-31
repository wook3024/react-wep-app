import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, Form, message } from "antd";
import axios from "axios";

import { GET_POST_DATA } from "../reducers/actions";

const { TextArea } = Input;

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { userInfo, post } = useSelector(state => state);

  const dispatch = useDispatch();

  const onChangeTitle = e => {
    setContent(e.target.value);
  };
  const onChangeContent = e => {
    setTitle(e.target.value);
  };

  const onSubmit = useCallback(async () => {
    if (!(userInfo && userInfo.username)) {
      message.warning("Login Please! 😱");
      return;
    }

    axios({
      method: "post",
      url: "http://localhost:8080/post/publish",
      params: {
        title,
        content
      },
      withCredentials: true
    }).then(async () => {
      axios({
        method: "get",
        url: "http://localhost:8080/post"
      }).then(postData => {
        dispatch({
          type: GET_POST_DATA,
          payload: postData.data
        });
      });
    });
  }, [content, dispatch, title, userInfo]);

  return (
    <Form style={{ width: 300 }}>
      <Input placeholder="title" allowClear onChange={onChangeContent} />
      <br />
      <br />
      <TextArea placeholder="content" allowClear onChange={onChangeTitle} />
      <br />
      <br />
      <Button type="primary" htmlType="submit" onClick={onSubmit}>
        Submit
      </Button>
    </Form>
  );
};

export default PostForm;
