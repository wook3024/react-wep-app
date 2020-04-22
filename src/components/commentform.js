import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Form, Button, message } from "antd";
import axios from "axios";
import PropTypes from "prop-types";

import { GET_COMMENT_ACTION } from "../reducers/actions";

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

    if (commentContent.trim() === "") {
      return message.warning("Please include the contents.! 😱");
    }
    axios({
      method: "post",
      url: "/post/comment/add",
      params: {
        postId: post.id,
        userId: userInfo && userInfo.id,
        comment: commentContent.trimRight(),
        depth: comment ? comment.depth + 1 : 1,
        group: comment ? comment.group : moment(now()).format("YYYYMMDDhmmss"),
        sort: comment ? comment.sort : 1,
      },
      withCredentials: true,
    })
      .then((res) => {
        commentForm.current.state.value = null;
        setComment(null);

        if (!res.data.fulfillmentValue) {
          return message.warning(res.data);
        }

        console.log("comment add", res.data.fulfillmentValue);
        axios({
          method: "get",
          url: "/post/comment",
          params: { postId: post.id },
        }).then((comments) => {
          console.log("comments data check", comments);
          dispatch({
            type: GET_COMMENT_ACTION,
            payload: {
              postId: post.id,
              comments: comments.data,
            },
          });
        });
      })
      .then(() => {
        message.success("Comment add Complete! 🐳");
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  };

  return (
    <Form
      style={{
        width: "320px",
        display: "block",
        margin: "0 auto",
      }}
    >
      <TextArea
        rows={4}
        style={{
          margin: "0.5rem 0",
          display: "block",
        }}
        onChange={changeComment}
        ref={commentForm}
      />
      <Button type="primary" ghost onClick={addCommnet}>
        submit
      </Button>
    </Form>
  );
};

Commentform.propTypes = {
  post: PropTypes.object,
  comment: PropTypes.object,
};

export default Commentform;
