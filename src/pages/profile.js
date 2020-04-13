import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Descriptions, Button, Input, Avatar, Upload, message } from "antd";
import styled from "styled-components";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";

import "./App.css";
import { USER_INFO_REFRESH } from "../reducers/actions";

const Div = styled.div``;
const { TextArea } = Input;

const Profile = () => {
  const { userInfo } = useSelector((state) => state);
  const [changeToNickname, setChangeToNickname] = useState(
    userInfo && userInfo.nickname
  );
  const [descriptionButtonToggle, setDescriptionButtonToggle] = useState(false);
  const [changeToDescription, setChangeToDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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
        dispatch({
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

  // const handleFileInput = (e) => {
  //   setSelectedFile(e.target.files[0]);
  // };

  const handlePost = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios({
      method: "post",
      url: "http://localhost:8080/post/uploadProfileImage",
      withCredentials: true,
      data: formData,
      params: {
        userId: userInfo ? userInfo.id : null,
      },
    })
      .then((res) => {
        console.log("upload", res);
        message.success(res.data);
        setSelectedFile(null);
      })
      .catch((error) => {
        message.warning("Upload failed");
        console.error("😡 ", error);
      });
  };

  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        setSelectedFile(info.file.originFileObj);
        console.log(info.file.originFileObj);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
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
            {selectedFile === null ? (
              <Upload {...props}>
                <Button type="primary" size={"small"}>
                  select
                </Button>
              </Upload>
            ) : (
              <Button type="primary" size={"small"} onClick={handlePost}>
                modify
              </Button>
            )}
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
