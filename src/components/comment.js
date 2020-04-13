import React, { createElement, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Comment, Tooltip, Avatar, message, Input, Form, Button } from "antd";
import moment from "moment";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";
import axios from "axios";

import {
  COMMENT_REMOVE_ACTION,
  COMMENT_UPDATE_ACTION,
} from "../reducers/actions";

const { TextArea } = Input;

const Reply = ({ comment }) => {
  const [likeVal, setLikes] = useState(0);
  const [likeState, setLikeState] = useState(false);
  const [dislikeVal, setDislikes] = useState(0);
  const [dislikeState, setDislikeState] = useState(false);
  const [changeState, setChangeState] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const commentForm = useRef(null);
  const { userInfo } = useSelector((state) => state);

  const dispatch = useDispatch();

  // console.log("comment Info", comment);
  let likeCount = comment.likes.length + likeVal;
  let dislikeCount = comment.dislikes.length + dislikeVal;

  //이미 좋아요 했을 시 1 더하고 아닐 시 -1 더한다.
  let pluelikeOrUnlikeVal = 0;

  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/post/comment/likeState",
      params: { userId: userInfo.id, commentId: comment.id },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data === true) {
          setLikeState(true);
        }
      })
      .catch((error) => {
        console.error("😡 ", error);
      });

    axios({
      method: "post",
      url: "http://localhost:8080/post/comment/dislikeState",
      params: { userId: userInfo.id, commentId: comment.id },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data === true) {
          setDislikeState(true);
        }
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const likeCheck = (res) => {
    if (res.status !== 201) {
      message.warning(res.data);
      return false;
    }

    if (res.data === "unLike") pluelikeOrUnlikeVal = -1;
    else pluelikeOrUnlikeVal = 1;
    return true;
  };

  const like = () => {
    axios({
      method: "post",
      url: "http://localhost:8080/post/comment/like",
      params: { commentId: comment.id },
      withCredentials: true,
    })
      .then((res) => {
        if (likeCheck(res)) {
          setLikes(likeVal === 0 ? pluelikeOrUnlikeVal : 0);
          setLikeState(likeState ? false : true);
        }
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  };

  const dislike = () => {
    axios({
      method: "post",
      url: "http://localhost:8080/post/comment/dislike",
      params: { commentId: comment.id },
      withCredentials: true,
    })
      .then((res) => {
        if (likeCheck(res)) {
          setDislikes(dislikeVal === 0 ? pluelikeOrUnlikeVal : 0);
          setDislikeState(dislikeState ? false : true);
        }
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  };

  const commentRemove = () => {
    console.log("commentRemoveCheck");
    axios({
      method: "post",
      url: "http://localhost:8080/post/comment/remove",
      params: {
        commentId: comment.id,
        userId: userInfo && userInfo.id,
      },
      withCredentials: true,
    })
      .then((res) => {
        console.log("commentRemove response", res, comment.id, comment.postId);
        if (res.status === 201) {
          message.success(res.data);
        } else {
          message.warning(res.data);
        }

        dispatch({
          type: COMMENT_REMOVE_ACTION,
          payload: {
            commentId: comment.id,
            postId: comment.postId,
          },
        });
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  };

  const commentChangeToggle = () => {
    setChangeState(changeState ? false : true);
  };

  const commentValueChange = (e) => {
    setCommentValue(e.target.value);
    console.log(commentValue);
  };

  const commentChangeSubmit = () => {
    setChangeState(changeState ? false : true);

    axios({
      method: "post",
      url: "http://localhost:8080/post/comment/change",
      withCredentials: true,
      params: {
        commentId: comment.id,
        comment: commentValue,
      },
    })
      .then((res) => {
        console.log("commnetUpdateResponse", res);

        if (res.status !== 201) {
          return message.warning(res.data);
        }
        message.success(res.data);

        dispatch({
          type: COMMENT_UPDATE_ACTION,
          payload: {
            commentId: comment.id,
            postId: comment.postId,
            comment: commentValue,
          },
        });
      })
      .catch((error) => {
        console.error("😡 ", error);
      });

    console.log("commentChangeSubmit");
  };

  const actions = [
    <span key="comment-basic-like">
      <Tooltip title="Like">
        {createElement(likeState === true ? LikeFilled : LikeOutlined, {
          onClick: like,
        })}
      </Tooltip>
      <span className="comment-action">{likeCount}</span>
    </span>,
    <span key=' key="comment-basic-dislike"'>
      <Tooltip title="Dislike">
        {React.createElement(
          dislikeState === true ? DislikeFilled : DislikeOutlined,
          {
            onClick: dislike,
          }
        )}
      </Tooltip>
      <span className="comment-action">{dislikeCount}</span>
    </span>,
    <span key="comment-basic-reply-to">
      {userInfo && userInfo.id === comment.user.id ? "Reply to" : ""}
    </span>,
    <span key="comment-basic-change" onClick={commentChangeToggle}>
      {userInfo && userInfo.id === comment.user.id ? "Change" : ""}
    </span>,
    <span key="comment-basic-remove" onClick={commentRemove}>
      {userInfo && userInfo.id === comment.user.id ? "Remove" : ""}
    </span>,
  ];

  return (
    <Comment
      style={{ width: "300px" }}
      actions={actions}
      author={comment.user ? comment.user.nickname : "not found"}
      avatar={
        <Avatar
          src={
            comment.user.images[0]
              ? require(`../images/${comment.user.images[0].filename}`)
              : "https://i.pinimg.com/originals/0b/39/ea/0b39ea68844c6d4664d54af04bf83088.png"
          }
          alt="Han Solo"
        />
      }
      content={
        changeState ? (
          <Form>
            <TextArea
              rows={4}
              style={{
                margin: "0 0 0.5rem 0",
                width: "300px",
                display: "block",
              }}
              onChange={commentValueChange}
              ref={commentForm}
              defaultValue={comment.comment}
            />
            <Button type="primary" onClick={commentChangeSubmit}>
              submit
            </Button>
          </Form>
        ) : (
          comment.comment
        )
      }
      datetime={
        <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
          <span>{moment(comment.created_at).fromNow()}</span>
        </Tooltip>
      }
    ></Comment>
  );
};

export default Reply;
