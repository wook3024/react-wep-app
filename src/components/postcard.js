import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Avatar, Button, Popover, message, Tooltip } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  MessageOutlined
} from "@ant-design/icons";
import axios from "axios";

import ButtonGroup from "antd/lib/button/button-group";
import { REMOVE_POST_ACTION } from "../reducers/actions";
import PostForm from "./postForm";
import Commentform from "./commentform";
import Comment from "./comment";

const { Meta } = Card;

const Postcard = ({ post }) => {
  const [revisePost, setRevisePost] = useState(false);
  const [addComment, setAddComment] = useState(false);
  const { userInfo } = useSelector(state => state);

  const dispatch = useDispatch();

  useEffect(() => {
    setRevisePost(false);
    setAddComment(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo && userInfo.username]);

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
      withCredentials: true
    })
      .then(res => {
        console.log("postRemove result", res);
        if (res.status === 201) {
          message.success(res.data);
          dispatch({
            type: REMOVE_POST_ACTION,
            payload: { id: post.data.id, userId: userInfo.id }
          });
        } else {
          message.warning(res.data);
        }
      })
      .catch(error => {
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
    <Card>
      <Card
        style={{ width: 300 }}
        cover={
          <img
            alt="example"
            src="https://i.pinimg.com/originals/75/b4/1f/75b41f385a28c3bd06aee521269e5779.jpg"
          />
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
          </Popover>
        ]}
      >
        <Meta
          avatar={
            <Avatar src="https://mblogthumb-phinf.pstatic.net/MjAxODA2MjZfMjg3/MDAxNTMwMDE5ODgyNDY5.xUK3HyMnSuvUkq4tjOyh14UNteoKwMYiTn_dlVomh8Mg.xH9q9sPqhG7qnNAGPs6oxyiODpsECynytEfwikDmoIsg.JPEG.raviefille/%EB%92%B9%EA%B5%B4%ED%95%91%ED%81%AC_%281%29.jpg?type=w2" />
          }
          title={post.data.title}
          description={post.data.content}
        />
      </Card>
      {addComment && <Commentform postId={post.data.id} />}
      {revisePost && <PostForm postId={post.data.id} />}
      {post.data.comments[0] &&
        post.data.comments.map(comment => {
          return <Comment comment={comment} />;
        })}
    </Card>
  );
};

export default Postcard;
