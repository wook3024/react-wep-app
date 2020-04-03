import React, { useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, Form, message } from "antd";
import axios from "axios";

import { GET_POST_DATA, UPDATE_POST_ACTION } from "../reducers/actions";

const { TextArea } = Input;

const PostForm = ({ postId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { userInfo } = useSelector(state => state);

  const dispatch = useDispatch();

  const inputTitle = useRef(null);
  const inputContent = useRef(null);

  const onChangeTitle = e => {
    setContent(e.target.value);
  };
  const onChangeContent = e => {
    setTitle(e.target.value);
    console.log("postId", postId);
  };

  const updatePost = useCallback(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/post/update",
      params: {
        id: postId,
        title,
        content
      },
      withCredentials: true
    })
      .then(res => {
        console.log(res);

        dispatch({
          type: UPDATE_POST_ACTION,
          payload: { content, title, id: postId }
        });

        inputTitle.current.state.value = null;
        inputContent.current.state.value = null;
      })
      .catch(error => {
        console.error("😡 ", error);
      });
  }, [content, dispatch, postId, title]);

  const onSubmit = useCallback(async () => {
    if (postId !== undefined) {
      updatePost();
      return;
    }

    inputTitle.current.state.value = null;
    inputContent.current.state.value = null;

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
      })
        .then(postData => {
          dispatch({
            type: GET_POST_DATA,
            payload: postData.data
          });
        })
        .catch(error => {
          console.error("😡 ", error);
        });
    });
  }, [content, dispatch, postId, title, updatePost, userInfo]);

  return (
    <Form style={{ width: 300 }}>
      <Input
        placeholder="title"
        ref={inputTitle}
        allowClear
        onChange={onChangeContent}
      />
      <br />
      <br />
      <TextArea
        placeholder="content"
        ref={inputContent}
        allowClear
        onChange={onChangeTitle}
      />
      <br />
      <br />
      <Button type="primary" htmlType="submit" onClick={onSubmit}>
        Submit
      </Button>
    </Form>
  );
};

export default PostForm;
