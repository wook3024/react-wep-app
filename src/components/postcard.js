import React, { useState, useEffect, useCallback, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  EditOutlined,
  EllipsisOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Lightbox from "react-image-lightbox";
import PropTypes from "prop-types";

import "react-image-lightbox/style.css";
import ButtonGroup from "antd/lib/button/button-group";
import {
  REMOVE_POST_ACTION,
  SET_HASHTAG_ACTION,
  POST_LIST_REMOVE_ACTION,
} from "../reducers/actions";
import Avatar from "antd/lib/avatar";
import message from "antd/lib/message";
import Button from "antd/lib/button";
import Popover from "antd/lib/popover";
import Card from "antd/lib/card";

import "antd/lib/avatar/style/css";
import "antd/lib/message/style/css";
import "antd/lib/button/style/css";
import "antd/lib/popover/style/css";
import "antd/lib/card/style/css";

const PostForm = lazy(() => import("./postForm"));
const Commentform = lazy(() => import("./commentform"));
const Comment = lazy(() => import("./comment"));

const { Meta } = Card;

const Postcard = ({ post }) => {
  const [revisePost, setRevisePost] = useState(false);
  const [addComment, setAddComment] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUserImage, setIsOpenUserImage] = useState(false);
  const { userInfo } = useSelector((state) => state);

  const dispatch = useDispatch();
  const history = useHistory();

  let commentList = null;
  const commentStore = [];
  const images = [];

  useEffect(() => {
    setRevisePost(false);
    setAddComment(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userInfo && userInfo.username,
    post.data.comments.length,
    post.data.updated_at,
  ]);

  const searchHashtag = useCallback(
    (hashtag) => {
      console.log("hashtag: ", hashtag);
      dispatch({
        type: POST_LIST_REMOVE_ACTION,
      });
      dispatch({
        type: SET_HASHTAG_ACTION,
        payload: { hashtag: hashtag },
      });
      window.scrollTo(0, 0);
      history.push("/hashtag");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const loginCheck = useCallback(() => {
    if (!(userInfo && userInfo.username)) {
      message.warning("Login Please! 😱");
      return false;
    }
    return true;
  }, [userInfo]);

  const openImagebox = useCallback((e) => {
    console.log(e.target.alt);
    setPhotoIndex(e.target.alt);
    setIsOpen(true);
  }, []);

  const postRemove = useCallback(() => {
    if (!loginCheck()) return;

    axios({
      method: "post",
      url: "/post/remove",
      params: { postId: post.data.id, userId: userInfo.id },
      withCredentials: true,
    })
      .then((res) => {
        console.log("postRemove result", res);
        if (res.status === 201) {
          message.success(res.data);
          dispatch({
            type: REMOVE_POST_ACTION,
            payload: { id: post.data.id, userId: userInfo.id },
          });
        } else {
          message.warning(res.data);
        }
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  }, [dispatch, loginCheck, post.data.id, userInfo.id]);

  const postChange = useCallback(() => {
    if (!loginCheck()) return;
    setRevisePost(revisePost === true ? false : true);
  }, [loginCheck, revisePost]);

  const commentChange = useCallback(() => {
    if (!loginCheck()) return;
    setAddComment(addComment === true ? false : true);
  }, [addComment, loginCheck]);

  const onFollowing = useCallback(() => {
    // console.log("insert follwoing data check", userInfo, post.data);
    axios({
      method: "post",
      url: "/post/user/following",
      withCredentials: true,
      params: { userId: userInfo.id, targetUserId: post.data.userId },
    })
      .then((res) => {
        if (res.status === 200) {
          message.success("following success! 🐳");
        } else {
          message.warning(res.data);
        }
        console.log("following state check", res);
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  }, [post.data.userId, userInfo.id]);

  const onScrap = useCallback(() => {
    axios({
      method: "post",
      url: "/post/user/scrap",
      withCredentials: true,
      params: { userId: userInfo.id, postId: post.data.id },
    })
      .then((res) => {
        if (res.status === 200) {
          message.success("scrap success! 🐳");
        } else {
          message.warning(res.data);
        }
        console.log("scrap state check", res);
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  }, [post.data.id, userInfo.id]);

  return (
    <Card
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{ width: 400 }}
        cover={
          post.data.images[0] && (
            <>
              {post.data.images.map((image) => {
                images.push(image.location);
                return (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <img
                    src={image.location}
                    onClick={openImagebox}
                    alt={images.length - 1}
                  />
                );
              })}
              {isOpen && (
                <Lightbox
                  mainSrc={images[photoIndex]}
                  onCloseRequest={() => setIsOpen(false)}
                  nextSrc={images[(photoIndex + 1) % images.length]}
                  prevSrc={
                    images[(photoIndex + images.length - 1) % images.length]
                  }
                  onMovePrevRequest={() =>
                    setPhotoIndex(
                      (photoIndex + images.length - 1) % images.length
                    )
                  }
                  onMoveNextRequest={() =>
                    setPhotoIndex((photoIndex + 1) % images.length)
                  }
                />
              )}
            </>
          )
        }
        actions={[
          <Popover
            key="topLeft"
            content="change 🐳"
            arrowPointAtCenter
            onClick={postChange}
          >
            <EditOutlined key="edit" />
          </Popover>,
          <Popover
            key="topLeft"
            content="comment 🐳"
            arrowPointAtCenter
            onClick={commentChange}
          >
            <MessageOutlined key="comment" />
          </Popover>,
          <Popover
            key="ellipsis"
            content={
              userInfo && userInfo.id ? (
                <>
                  {userInfo.id === post.data.userId ? (
                    <ButtonGroup>
                      <Button Button danger onClick={postRemove}>
                        remove
                      </Button>
                      <Button Button type="primary" ghost onClick={onScrap}>
                        scrap
                      </Button>
                    </ButtonGroup>
                  ) : null}
                  {userInfo.id !== post.data.userId ? (
                    <ButtonGroup>
                      <Button Button type="primary" ghost onClick={onFollowing}>
                        following
                      </Button>
                      <Button Button type="primary" ghost onClick={onScrap}>
                        scrap
                      </Button>
                    </ButtonGroup>
                  ) : null}
                </>
              ) : (
                "Login please! 🐳"
              )
            }
          >
            <EllipsisOutlined key="ellipsis" />
          </Popover>,
        ]}
      >
        <Meta
          avatar={
            post.data.user.images[0] &&
            post.data.user.images[0].location !== undefined ? (
              <>
                <Avatar
                  src={post.data.user.images[0].location}
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
                    mainSrc={post.data.user.images[0].location}
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
          title={post.data.title.split(" ").map((title) => {
            // console.log("title check", title);
            if (title.charAt(0) === "#") {
              return (
                <span
                  style={{ color: "#3399ff", cursor: "pointer" }}
                  onClick={() => {
                    searchHashtag(title.slice(1));
                  }}
                >
                  {title}&nbsp;
                </span>
              );
            } else {
              return <span>{title}&nbsp;</span>;
            }
          })}
        />
        <br />
        <div
          style={{
            display: "inline-block",
            width: "340px",
            float: "left",
            wordBreak: "break-all",
          }}
        >
          {post.data.content.split(" ").map((content) => {
            // console.log("content check", content);
            if (content.charAt(0) === "#") {
              return (
                <span
                  style={{ color: "#3399ff", cursor: "pointer" }}
                  onClick={() => {
                    searchHashtag(content.slice(1));
                  }}
                >
                  {content}&nbsp;
                </span>
              );
            } else {
              return <span>{content}&nbsp;</span>;
            }
          })}
        </div>
      </Card>
      {addComment && <Commentform post={post.data} />}
      {revisePost && <PostForm post={post.data} />}
      {post.data.comments[0] &&
        post.data.comments.forEach((comment) => {
          const commentsSize = post.data.comments.length - 1;
          if (
            commentList !== null &&
            (comment.group !== commentList.group ||
              comment.id === post.data.comments[commentsSize].id)
          ) {
            //반복되는 리렌더링에 의해 무결성 요구됨
            //데이더 변질을 막기 위해 스프레드 연산자 사용
            if (commentList.comments.length > 0) {
              //이전값을 기준으로 출력할 값을 정하기 때문에
              //순회가 끝나도 하나의  값이 처리되지 못해 끝에 더미값을 푸쉬한다.
              // console.log("commentList", commentList, comment);
              if (
                comment.id === post.data.comments[commentsSize].id &&
                comment.group === commentList.group
              ) {
                commentList.comments.push(comment);
              }
              commentList.comments.push({
                ...commentList.comments[commentList.comments.length - 1],
                depth: commentList.comments[0].depth,
              });
              commentStore.push(commentList);
              if (
                comment.id === post.data.comments[commentsSize].id &&
                comment.group !== commentList.group
              ) {
                commentStore.push({ ...comment, comments: [] });
              }
            } else if (comment.id === post.data.comments[commentsSize].id) {
              if (comment.group === commentList.group) {
                commentList.comments.push(comment);
                commentList.comments.push({
                  ...commentList.comments[commentList.comments.length - 1],
                  depth: commentList.comments[0].depth,
                });
                commentStore.push(commentList);
              } else {
                commentStore.push(commentList);
                commentStore.push({ ...comment, comments: [] });
              }
            } else {
              commentStore.push(commentList);
            }

            commentList = { ...comment };
            commentList.comments = [];
          } else if (commentList === null) {
            commentList = { ...comment };
            commentList.comments = [];
            if (!commentsSize) {
              commentStore.push(commentList);
              // console.log("commentSize", commentsSize);
            }
          } else {
            commentList.comments.push(comment);
          }
        })}
      {post.data.comments[0] &&
        commentStore.map((comment) => {
          // console.log("comment deptg", comment, commentStore.length);
          return (
            <Comment key={comment.id} post={post.data} comment={comment} />
          );
        })}
    </Card>
  );
};

Postcard.propTypes = {
  post: PropTypes.object,
};

export default Postcard;
