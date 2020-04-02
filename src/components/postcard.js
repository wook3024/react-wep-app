import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Avatar, Button, Popover, message, Tooltip } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  MessageOutlined
} from "@ant-design/icons";
import axios from "axios";

import { REMOVE_POST_ACTION } from "../reducers/actions";
import PostForm from "./postForm";
import Commentform from "./commentform";
import ButtonGroup from "antd/lib/button/button-group";

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
      url: "http://localhost:3000/post/remove",
      params: { id: post.data.id },
      withCredentials: true
    }).then(res => {
      console.log("postRemove result", res);

      dispatch({
        type: REMOVE_POST_ACTION,
        payload: { id: post.data.id }
      });

      if (res.status === 201) {
        message.success(res.data);
      } else {
        message.warning(res.data);
      }
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
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
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
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          }
          title={post.data.title}
          description={post.data.content}
        />
      </Card>
      {addComment && <Commentform postId={post.data.id} />}
      {revisePost && <PostForm postId={post.data.id} />}
    </Card>
  );
};

export default Postcard;
