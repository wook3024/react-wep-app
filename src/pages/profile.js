import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Descriptions, Button, Input, Avatar } from "antd";
import styled from "styled-components";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";

import "./App.css";
import { USER_INFO_REFRESH, GET_POST_DATA } from "../reducers/actions";

const Div = styled.div``;
const { TextArea } = Input;

const Profile = () => {
  const { userInfo } = useSelector((state) => state);
  const [changeToNickname, setChangeToNickname] = useState(
    userInfo && userInfo.nickname
  );
  const [descriptionButtonToggle, setDescriptionButtonToggle] = useState(false);
  const [changeToDescription, setChangeToDescription] = useState("");

  const dispatch = useDispatch();

  const onChangeNickname = (e) => {
    setChangeToNickname(e.target.value);
  };

  const onChangeDescription = (e) => {
    setChangeToDescription(e.target.value);
  };

  const descriptionChange = () => {
    setDescriptionButtonToggle(true);
  };

  const descriptionModify = () => {
    axios({
      method: "post",
      url: "http://localhost:8080/post/user/descriptionChange",
      params: { description: changeToDescription, id: userInfo.id },
      withCredentials: true,
    })
      .then((res) => {
        console.log("changeToDescription result", res);
        return dispatch({
          type: USER_INFO_REFRESH,
          payload: res.data,
        });
      })
      .then(() => {
        setDescriptionButtonToggle(false);

        // return dispatch({
        //   type: GET_POST_DATA,
        // });
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  };

  const changeNickname = () => {
    axios({
      method: "post",
      url: "http://localhost:8080/post/user/nicknamechange",
      params: { changeToNickname, id: userInfo.id },
      withCredentials: true,
    })
      .then((res) => {
        console.log("changeToNickname result", res);
        return dispatch({
          type: USER_INFO_REFRESH,
          payload: res.data,
        });
      })
      .then(() => {
        setChangeToNickname(userInfo.nickname);

        // return dispatch({
        //   type: GET_POST_DATA,
        // });
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  };

  return (
    <Descriptions
      style={{ margin: "7rem auto", maxWidth: 600 }}
      bordered
      title="User Info"
      size={"small"}
    >
      <Descriptions.Item label="UserName">
        {userInfo && userInfo.username}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Div>
            NickName&nbsp;
            <Button size={"small"} type="primary" onClick={changeNickname}>
              modify
            </Button>
          </Div>
        }
      >
        <Input
          defaultValue={userInfo && userInfo.nickname}
          onChange={onChangeNickname}
        />
      </Descriptions.Item>
      <Descriptions.Item label="Created_At">
        {userInfo && userInfo.created_at}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Div>
            ProfileImage&nbsp;
            <Button size={"small"} type="primary">
              modify
            </Button>
          </Div>
        }
      >
        {userInfo && userInfo.profileImage ? (
          <Avatar src={require(`../images/${userInfo.profileImage}`)} />
        ) : (
          <Avatar icon={<UserOutlined />} />
        )}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Div>
            Description&nbsp;
            {descriptionButtonToggle ? (
              <Button size={"small"} type="primary" onClick={descriptionModify}>
                modify
              </Button>
            ) : (
              <Button size={"small"} type="primary" onClick={descriptionChange}>
                change
              </Button>
            )}
          </Div>
        }
      >
        {descriptionButtonToggle ? (
          <TextArea rows={4} onChange={onChangeDescription} />
        ) : (
          userInfo && `${userInfo.description}`
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};
export default Profile;
