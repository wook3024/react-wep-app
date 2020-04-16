import React, {
  createElement,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Comment, Tooltip, Avatar, message, Input, Form, Button } from "antd";
import moment from "moment";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Lightbox from "react-image-lightbox";

import "react-medium-image-zoom/dist/styles.css";
import Commentform from "./commentform";
import {
  COMMENT_REMOVE_ACTION,
  COMMENT_UPDATE_ACTION,
} from "../reducers/actions";

const { TextArea } = Input;

const Reply = ({ post, comment }) => {
  const [likeVal, setLikes] = useState(0);
  const [likeState, setLikeState] = useState(false);
  const [dislikeVal, setDislikes] = useState(0);
  const [dislikeState, setDislikeState] = useState(false);
  const [changeState, setChangeState] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [replyCommentState, setReplyCommentState] = useState(false);
  const [visible, setVisible] = useState("hidden");
  const [isZoomed, setIsZoomed] = useState(false);
  const [isOpenUserImage, setIsOpenUserImage] = useState(false);
  const commentForm = useRef(null);
  const { userInfo } = useSelector((state) => state);

  const dispatch = useDispatch();

  let subCommentList = null;
  let subCommentStore = [];

  // console.log("userinfo Info", userInfo);
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

  const openUserImage = useCallback(() => {
    setIsOpenUserImage(isOpenUserImage ? false : true);
  }, [isOpenUserImage]);

  const handleZoomChange = useCallback((shouldZoom) => {
    console.log("shouldZoom", shouldZoom);
    setIsZoomed(shouldZoom);
    setVisible(shouldZoom === false ? "hidden" : "visible");
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
    console.log("comment Set check", comment);
    console.log("commentRemoveCheck");
    axios({
      method: "post",
      url: "http://localhost:8080/post/comment/remove",
      params: {
        commentId: comment.id,
        postId: post.id,
        group: comment.group,
        sort: comment.sort,
        force: false,
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

        comment.comments.forEach((comment) => {
          axios({
            method: "post",
            url: "http://localhost:8080/post/comment/remove",
            params: {
              commentId: comment.id,
              postId: post.id,
              group: comment.group,
              sort: comment.sort,
              force: true,
            },
            withCredentials: true,
          })
            .then((res) => {
              console.log(
                "commentRemove response",
                res,
                comment.id,
                comment.postId
              );
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
        });
      })
      .then((res) => {
        console.log("res check", res);

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

  const replyComment = () => {
    setReplyCommentState(replyCommentState ? false : true);
    console.log("comment Info", comment);
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
    <span key="comment-basic-reply-to" onClick={replyComment}>
      {userInfo && userInfo.id ? "Reply to" : ""}
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
        comment.user.images[0] &&
        comment.user.images[0].filename !== undefined ? (
          <>
            <Avatar
              src={`./images/${comment.user.images[0].filename}`}
              alt="Han Solo"
              onClick={() => setIsOpenUserImage(true)}
            />
            {isOpenUserImage && (
              <Lightbox
                //css변경할 때 사용
                reactModalStyle={{
                  overlay: {},
                  content: {},
                }}
                mainSrc={`./images/${comment.user.images[0].filename}`}
                onCloseRequest={() => setIsOpenUserImage(false)}
              />
            )}
          </>
        ) : (
          <>
            <Avatar icon={<UserOutlined />} />
          </>
        )
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
    >
      {replyCommentState && <Commentform post={post} comment={comment} />}
      {(comment.comments[0] &&
        comment.comments.forEach((childComment) => {
          // console.log(
          //   "comment sub commnet",
          //   childComment.comment,
          // );
          const commentsSize = comment.comments.length;
          const subCommentsSize =
            subCommentList && subCommentList.comments[0]
              ? subCommentList.comments.length
              : 0;
          if (
            subCommentList !== null &&
            childComment.depth <= comment.depth + 1
          ) {
            if (subCommentsSize > 0) {
              //이전값을 기준으로 출력할 값을 정하기 때문에
              //순회가 끝나도 하나의  값이 처리되지 못해 끝에 더미값을 푸쉬한다.
              subCommentList.comments.push({
                ...subCommentList.comments[commentsSize - 1],
                depth: subCommentList.comments[0].depth,
              });
              subCommentStore.push(subCommentList);
              subCommentList = null;
              // console.log("subCommentStore", subCommentStore);
            } else {
              subCommentStore.push(subCommentList);
            }
            //데이더 변질을 막기 위해 스프레드 연산자 사용
            subCommentList = { ...childComment };
            subCommentList.comments = [];
          } else if (subCommentList === null) {
            subCommentList = { ...childComment };
            subCommentList.comments = [];
            // return <Reply comment={subCommentList} />;
          } else {
            subCommentList.comments.push(childComment);
          }
        })) ||
        //댓글이 최신순으로 정렬되어있어 오랜된 댓글부터 보기위해 뒤집어준다.
        subCommentStore.reverse().map((comment) => {
          // console.log("subCommentCheck", comment);
          return <Reply post={post} comment={comment} />;
        })}
    </Comment>
  );
};

export default Reply;
