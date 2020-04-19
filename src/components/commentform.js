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
        const commentsData = res.data.fulfillmentValue.map((comment) => {
          comment = {
            ...comment,
            user: {
              ...comment.user,
              images: [
                {
                  filename: comment.user.images[0]
                    ? comment.user.images[0].filename
                    : undefined,
                },
              ],
            },
          };
          return comment;
        });
        dispatch({
          type: ADD_COMMENT_ACTION,
          payload: { comments: [...commentsData], postId: post.id },
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
