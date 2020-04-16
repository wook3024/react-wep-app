import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Avatar, Button, Popover, message, Tooltip } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Lightbox from "react-image-lightbox";
import ModalImage from "react-modal-image";
import { Controlled as ControlledZoom } from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import "react-image-lightbox/style.css";
import ButtonGroup from "antd/lib/button/button-group";
import { REMOVE_POST_ACTION } from "../reducers/actions";
import PostForm from "./postForm";
import Commentform from "./commentform";
import Comment from "./comment";

const { Meta } = Card;

const Postcard = ({ post }) => {
  const [revisePost, setRevisePost] = useState(false);
  const [addComment, setAddComment] = useState(false);
  const [visible, setVisible] = useState("hidden");
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state);

  const dispatch = useDispatch();
  // console.log("post.comments", post.data.comments);

  let commentList = null;
  let commentStore = [];

  useEffect(() => {
    setRevisePost(false);
    setAddComment(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo && userInfo.username, post.data.comments.length]);

  const openLightbox = useCallback(() => {
    setCurrentImage(0);
    setViewerIsOpen(true);
    setIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const images = [];

  const handleZoomChange = useCallback((shouldZoom) => {
    console.log("shouldZoom", shouldZoom);
    setIsZoomed(shouldZoom);
    setVisible(shouldZoom === false ? "hidden" : "visible");
  }, []);

  const loginCheck = () => {
    if (!(userInfo && userInfo.username)) {
      message.warning("Login Please! 😱");
      return false;
    }
    return true;
  };

  const postRemove = () => {
    if (!loginCheck()) return;

    axios({
      method: "post",
      url: "http://localhost:8080/post/remove",
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
  };

  const postChange = () => {
    if (!loginCheck()) return;
    setRevisePost(revisePost === true ? false : true);
  };

  const commentChange = () => {
    if (!loginCheck()) return;
    setAddComment(addComment === true ? false : true);
  };

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
                images.push(`./images/${image.filename}`);
                if (image.filename === post.data.images[0].filename) {
                  console.log("image data", image);
                  return (
                    <img
                      src={`./images/${image.filename}`}
                      onClick={openLightbox}
                      alt={image.filename}
                    />
                  );
                }
                return (
                  <ModalImage
                    small={`./images/${image.filename}`}
                    large={`./images/${image.filename}`}
                  />
                );
              })}
              {isOpen && (
                <Lightbox
                  mainSrc={images[photoIndex]}
                  nextSrc={images[(photoIndex + 1) % images.length]}
                  prevSrc={
                    images[(photoIndex + images.length - 1) % images.length]
                  }
                  onCloseRequest={() => setIsOpen(false)}
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
          <Tooltip
            placement="topLeft"
            title="change"
            arrowPointAtCenter
            onClick={postChange}
          >
            <EditOutlined key="edit" />
          </Tooltip>,
          <Tooltip
            placement="topLeft"
            title="comment"
            arrowPointAtCenter
            onClick={commentChange}
          >
            <MessageOutlined key="comment" />
          </Tooltip>,
          <Popover
            key="ellipsis"
            content={
              <ButtonGroup>
                <Button Button danger onClick={postRemove}>
                  remove
                </Button>
                <Button Button type="primary" ghost>
                  in detail
                </Button>
              </ButtonGroup>
            }
          >
            <EllipsisOutlined key="ellipsis" />
          </Popover>,
        ]}
      >
        <Meta
          avatar={
            <>
              <Avatar
                src={
                  post.data.user.images[0] &&
                  post.data.user.images[0].filename !== undefined
                    ? `./images/${post.data.user.images[0].filename}`
                    : "https://i.pinimg.com/originals/0b/39/ea/0b39ea68844c6d4664d54af04bf83088.png"
                }
                onClick={handleZoomChange}
              />
              <ControlledZoom
                isZoomed={isZoomed}
                onZoomChange={handleZoomChange}
              >
                <img
                  style={{
                    position: "absolute",
                    visibility: visible,
                  }}
                  alt="that wanaka tree"
                  src={
                    post.data.user.images[0] &&
                    post.data.user.images[0].filename !== undefined
                      ? `./images/${post.data.user.images[0].filename}`
                      : "https://i.pinimg.com/originals/0b/39/ea/0b39ea68844c6d4664d54af04bf83088.png"
                  }
                  width="500"
                />
              </ControlledZoom>
            </>
          }
          title={post.data.title}
          description={post.data.content}
        />
      </Card>
      {addComment && <Commentform post={post.data} />}
      {revisePost && <PostForm postId={post.data.id} />}
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
              // console.log("commentList", commentList, comment);
              //이전값을 기준으로 출력할 값을 정하기 때문에
              //순회가 끝나도 하나의  값이 처리되지 못해 끝에 더미값을 푸쉬한다.
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
              if (comment.id === post.data.comments[commentsSize].id) {
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
            }
          } else {
            commentList.comments.push(comment);
          }
        })}
      {post.data.comments[0] &&
        commentStore.map((comment) => {
          // console.log("comment deptg", comment);
          return <Comment post={post.data} comment={comment} />;
        })}
    </Card>
  );
};

export default Postcard;
