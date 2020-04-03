import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Form, Button, message } from "antd";
import axios from "axios";

import { ADD_COMMENT_ACTION } from "../reducers/actions";

const { TextArea } = Input;

const Commentform = ({ postId }) => {
  const [comment, setComment] = useState("");
  const { username } = useSelector(state => state.userInfo);
  const commentForm = useRef(null);

  const dispatch = useDispatch();

  const changeComment = e => {
    setComment(e.target.value);
  };

  const addCommnet = () => {
    axios({
      method: "post",
      url: "http://localhost:8080/post/comment/add",
      params: { postId, username, comment },
      withCredentials: true
    }).then(res => {
      console.log("comment add", res);

      dispatch({
        type: ADD_COMMENT_ACTION,
        payload: {
          postId,
          username,
          comment,
          likes: [],
          dislikes: [],
          created_at: Date()
        }
      }).catch(error => {
        console.error("😡 ", error);
      });

      if (res.status === 201) {
        message.success(res.data);
      } else {
        message.warning(res.data);
      }
    });

    commentForm.current.state.value = null;
    setComment(null);
  };

  return (
    <Form>
      <TextArea
        rows={4}
        style={{
          margin: "0 0 0.5rem 0",
          width: "300px",
          display: "block"
        }}
        onChange={changeComment}
        ref={commentForm}
      />
      <Button type="primary" onClick={addCommnet}>
        submit
      </Button>
    </Form>
  );
};

export default Commentform;
