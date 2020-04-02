import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Avatar, Button, Popover, message } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  MessageOutlined
} from "@ant-design/icons";
import axios from "axios";

import { REMOVE_POST_ACTION } from "../reducers/actions";
import PostForm from "./postForm";

const { Meta } = Card;

const Postcard = ({ post }) => {
  const [changeValue, setChangeValue] = useState(false);

  const dispatch = useDispatch();

  const postRemove = () => {
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
    setChangeValue(changeValue === true ? false : true);
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
          <Popover
            key="edit"
            content={
              <Button.Group>
                <Button type="primary" ghost onClick={postChange}>
                  change
                </Button>
                <Button danger onClick={postRemove}>
                  remove
                </Button>
              </Button.Group>
            }
          >
            <EditOutlined key="edit" />
          </Popover>,
          <MessageOutlined />,
          <Popover
            key="ellipsis"
            content={
              <Button Button type="primary" ghost>
                in detail
              </Button>
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
      {changeValue && <PostForm postId={post.data.id} />}
    </Card>
  );
};

export default Postcard;
