import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Avatar, Button, Popover, message, Tooltip } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import axios from "axios";

import ButtonGroup from "antd/lib/button/button-group";
import { REMOVE_POST_ACTION } from "../reducers/actions";
import PostForm from "./postForm";
import Commentform from "./commentform";
import Comment from "./comment";
import { now } from "moment";

const { Meta } = Card;

const Postcard = ({ post }) => {
  const [revisePost, setRevisePost] = useState(false);
  const [addComment, setAddComment] = useState(false);
  // const [commentList, setCommentList] = useState(null);
  // const [commentStore, setCommentStore] = useState(null);
  const { userInfo } = useSelector((state) => state);

  const dispatch = useDispatch();
  console.log("post.comments", post.data.comments);
  const imageUrl = "20200404144126_cat-4223305_1920.jpg";

  let commentList = null;
  let commentStore = [];

  useEffect(() => {
    setRevisePost(false);
    setAddComment(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo && userInfo.username, post.data.comments.length]);

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
          post.data.images[0] &&
          post.data.images.map((image) => {
            return (
              <img alt="example" src={require(`../images/${image.filename}`)} />
            );
          })
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
            <Avatar
              src={
                post.data.user.images[0] &&
                post.data.user.images[0].filename !== undefined
                  ? require(`../images/${post.data.user.images[0].filename}`)
                  : "https://i.pinimg.com/originals/0b/39/ea/0b39ea68844c6d4664d54af04bf83088.png"
              }
            />
          }
          title={post.data.title}
          description={post.data.content}
        />
      </Card>
      {addComment && <Commentform post={post.data} />}
      {revisePost && <PostForm postId={post.data.id} />}
      {post.data.comments[0] &&
        post.data.comments.forEach((comment) => {
          if (
            commentList !== null &&
            (comment.group !== commentList.group ||
              comment.sort === commentList.sort)
          ) {
            //반복되는 리렌더링에 의해 무결성 요구됨
            if (commentList.comments.length > 0) {
              //이전값을 기준으로 출력할 값을 정하기 때문에
              //순회가 끝나도 하나의  값이 처리되지 못해 끝에 더미값을 푸쉬한다.
              commentList.comments.push({
                ...commentList.comments[commentList.comments.length - 1],
                depth: commentList.comments[0].depth,
              });
              // console.log("commentList", commentList);
              commentStore.push(commentList);
            } else {
              commentStore.push(commentList);
            }
            //데이더 변질을 막기 위해 스프레드 연산자 사용
            commentList = { ...comment };
            commentList.comments = [];
          } else if (commentList === null) {
            commentList = { ...comment };
            commentList.comments = [];
          } else {
            commentList.comments.push(comment);
          }
        })}
      {post.data.comments[0] &&
        [...commentStore, commentList].map((comment) => {
          console.log("comment deptg", commentList);
          return <Comment post={post.data} comment={comment} />;
        })}
    </Card>
  );
};

export default Postcard;
