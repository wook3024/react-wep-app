import React from "react";
import { Card, Avatar, Button, Popover } from "antd";
import { EditOutlined, EllipsisOutlined } from "@ant-design/icons";

const { Meta } = Card;

const Postcard = ({ post }) => {
  return (
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
              <Button type="primary" ghost>
                change
              </Button>
              <Button danger>remove</Button>
            </Button.Group>
          }
        >
          <EditOutlined key="edit" />
        </Popover>,
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
        title="Card title"
        description="This is the description"
      />
    </Card>
  );
};

export default Postcard;
