import React from "react";
import { Descriptions } from "antd";

import "./App.css";

const Profile = () => {
  return (
    <Descriptions style={{ margin: "7rem auto", maxWidth: 600 }} bordered title="User Info" size={"small"}>
      <Descriptions.Item label="UserName">swook</Descriptions.Item>
      <Descriptions.Item label="NickName">swook</Descriptions.Item>
      <Descriptions.Item label="Created_At">2019-04-24 18:00:00</Descriptions.Item>
      <Descriptions.Item label="ProfileImage">empty</Descriptions.Item>
      <Descriptions.Item label="Address">No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China</Descriptions.Item>
      <Descriptions.Item label="Telephone">+82 010-2848-9145</Descriptions.Item>
      <Descriptions.Item label="Description">empty</Descriptions.Item>
      <Descriptions.Item label="Config Info">
        Data disk type: MongoDB
            <br />
        Database version: 3.4
            <br />
        Package: dds.mongo.mid
            <br />
        Storage space: 10 GB
            <br />
        Replication factor: 3
            <br />
        Region: East China 1<br />
      </Descriptions.Item>
    </Descriptions >
  );
};

export default Profile;
