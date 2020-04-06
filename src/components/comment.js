import React, { createElement, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Comment, Tooltip, Avatar, message } from "antd";
import moment from "moment";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";
import axios from "axios";

const Reply = ({ comment }) => {
  const [likeVal, setLikes] = useState(0);
  const [likeState, setLikeState] = useState(false);
  const [dislikeVal, setDislikes] = useState(0);
  const [dislikeState, setDislikeState] = useState(false);
  const { userInfo } = useSelector((state) => state);

  // console.log("comment Reply", comment);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
      });
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
    // <span key="comment-basic-reply-to">Reply to</span>
  ];

  return (
    <Comment
      style={{ width: "300px" }}
      actions={actions}
      author={comment.nickname}
      avatar={
        <Avatar
          src="https://i.pinimg.com/originals/0b/39/ea/0b39ea68844c6d4664d54af04bf83088.png"
          alt="Han Solo"
        />
      }
      content={comment.comment}
      datetime={
        <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
          <span>{moment(comment.created_at).fromNow()}</span>
        </Tooltip>
      }
    />
  );
};

export default Reply;
