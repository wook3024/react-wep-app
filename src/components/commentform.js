import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Form, Button, message } from "antd";
import axios from "axios";

import { ADD_COMMENT_ACTION } from "../reducers/actions";

const { TextArea } = Input;

const Commentform = ({ postId }) => {
  const [comment, setComment] = useState("");
  const { userInfo } = useSelector((state) => state);
  const commentForm = useRef(null);

  const dispatch = useDispatch();

  const changeComment = (e) => {
    setComment(e.target.value);
  };

  const addCommnet = () => {
    axios({
      method: "post",
      url: "http://localhost:8080/post/comment/add",
      params: {
        postId,
        userId: userInfo && userInfo.id,
        comment,
      },
      withCredentials: true,
    }).then((res) => {
      commentForm.current.state.value = null;
      setComment(null);

      console.log("comment add", res);
      if (!res.data.fulfillmentValue) {
        return message.warning(res.data);
      }
      dispatch({
        type: ADD_COMMENT_ACTION,
        payload: {
          id: res.data.fulfillmentValue.id,
          postId,
          userId: userInfo && userInfo.id,
          comment,
          likes: [],
          dislikes: [],
          created_at: Date(),
          user: {
            username: userInfo && userInfo.username,
            nickname: userInfo && userInfo.nickname,
            id: userInfo && userInfo.id,
          },
        },
      });
      message.success("Comment add Complete! 🐳");
      // if (res.status === 201) {
      //   message.success(res.data);
      // } else {
      //   message.warning(res.data);
      // }
    });
  };

  return (
    <Form>
      <TextArea
        rows={4}
        style={{
          margin: "0 0 0.5rem 0",
          width: "300px",
          display: "block",
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
