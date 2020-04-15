import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Form, Button, message } from "antd";
import axios from "axios";

import { ADD_COMMENT_ACTION } from "../reducers/actions";

const moment = require("moment");
const { now } = moment;

const { TextArea } = Input;

const Commentform = ({ post, comment }) => {
  const [commentContent, setComment] = useState("");
  const { userInfo } = useSelector((state) => state);
  const commentForm = useRef(null);

  const dispatch = useDispatch();

  const changeComment = (e) => {
    setComment(e.target.value);
  };

  const addCommnet = () => {
    console.log("comment addComment", comment);
    axios({
      method: "post",
      url: "http://localhost:8080/post/comment/add",
      params: {
        postId: post.id,
        userId: userInfo && userInfo.id,
        comment: commentContent,
        depth: comment ? comment.depth + 1 : 1,
        group: comment ? comment.group : moment(now()).format("YYYYMMDDhmmss"),
        sort: comment ? comment.sort : 1,
      },
      withCredentials: true,
    })
      .then((res) => {
        commentForm.current.state.value = null;
        setComment(null);

        console.log("comment add", res);
        if (!res.data.fulfillmentValue) {
          return message.warning(res.data);
        }

        const commentsData = res.data.fulfillmentValue.map((comment) => {
          comment = {
            ...comment,
            likes: [],
            dislikes: [],
            user: {
              username: userInfo && userInfo.username,
              nickname: userInfo && userInfo.nickname,
              id: userInfo && userInfo.id,
              images: [{ filename: userInfo.profileImage }],
            },
          };
          return comment;
        });
        dispatch({
          type: ADD_COMMENT_ACTION,
          payload: { comments: commentsData, postId: post.id },
        });
        message.success("Comment add Complete! 🐳");
        // if (res.status === 201) {
        //   message.success(res.data);
        // } else {
        //   message.warning(res.data);
        // }
      })
      .catch((error) => {
        console.error("😡 ", error);
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
