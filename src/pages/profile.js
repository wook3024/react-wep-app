import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Descriptions, Button, Input, Avatar, Upload, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import Lightbox from "react-image-lightbox";

import "./App.css";
import { USER_INFO_REFRESH } from "../reducers/actions";

const { TextArea } = Input;

const Profile = () => {
  const [changeToNickname, setChangeToNickname] = useState(false);
  const [descriptionButtonToggle, setDescriptionButtonToggle] = useState(false);
  const [nicknameButtonToggle, setNicknameButtonToggle] = useState(false);
  const [changeToDescription, setChangeToDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [visible, setVisible] = useState(false);
  const { userInfo } = useSelector((state) => state);

  const dispatch = useDispatch();

  console.log("profile userinfo check", userInfo);
  const onChangeNickname = useCallback((e) => {
    setChangeToNickname(e.target.value);
  }, []);

  const onChangeDescription = useCallback((e) => {
    setChangeToDescription(e.target.value);
  }, []);

  const changeDescription = () => {
    axios({
      method: "post",
      url: "/post/user/descriptionChange",
      params: { description: changeToDescription, id: userInfo.id },
      withCredentials: true,
    })
      .then((res) => {
        console.log("changeToDescription result", res);
        if (res.data.nickname) {
          message.success("Description change succeeded!  🐳");
        } else {
          message.warning(res.data);
        }
        return dispatch({
          type: USER_INFO_REFRESH,
          payload: res.data,
        });
      })
      .then(() => {
        setDescriptionButtonToggle(false);
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  };

  const changeNickname = () => {
    axios({
      method: "post",
      url: "/post/user/nicknamechange",
      params: { changeToNickname, id: userInfo.id },
      withCredentials: true,
    })
      .then((res) => {
        console.log("changeToNickname result", res);
        if (res.data.nickname) {
          message.success("Nickname change succeeded!  🐳");
        } else {
          message.warning(res.data);
        }
        dispatch({
          type: USER_INFO_REFRESH,
          payload: { ...res.data, profileImage: res.data.images[0].filename },
        });
      })
      .then(() => {
        setChangeToNickname(userInfo.nickname);
        setNicknameButtonToggle(false);
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  };

  const handlePost = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios({
      method: "post",
      url: "/post/uploadProfileImage",
      withCredentials: true,
      data: formData,
      params: {
        userId: userInfo ? userInfo.id : null,
      },
    })
      .then((res) => {
        console.log("upload", res);
        if (res.data) {
          message.success("Update Complete With Images! 🐳");
        } else if (res.status === 200) {
          message.warning(res.data);
        } else {
          message.warning("Update failed! 😱");
        }

        dispatch({
          type: USER_INFO_REFRESH,
          payload: { userInfo: { ...userInfo, profileImage: res.data } },
        });
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
        {userInfo && userInfo.id ? userInfo.username : "undefined"}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div>
            NickName&nbsp;
            {nicknameButtonToggle ? (
              <>
                <Button size={"small"} type="primary" onClick={changeNickname}>
                  modify
                </Button>
              </>
            ) : (
              <Button
                size={"small"}
                type="primary"
                onClick={() =>
                  setNicknameButtonToggle(nicknameButtonToggle ? false : true)
                }
              >
                change
              </Button>
            )}
          </div>
        }
      >
        {nicknameButtonToggle ? (
          <Input
            defaultValue={userInfo && userInfo.nickname}
            onChange={onChangeNickname}
          />
        ) : (
          <Descriptions.Item label="Nickname">
            {userInfo && userInfo.id ? userInfo.nickname : "undefined"}
          </Descriptions.Item>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Created_At">
        {userInfo && userInfo.id ? userInfo.created_at : "undefined"}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div>
            ProfileImage&nbsp;
            <Upload {...props}>
              <Button type="primary" size={"small"}>
                select
              </Button>
            </Upload>
            {selectedFile !== null && (
              <Button type="primary" size={"small"} onClick={handlePost}>
                modify
              </Button>
            )}
          </div>
        }
      >
        {userInfo && userInfo.profileImage ? (
          <>
            <Avatar
              src={`./images/${userInfo.profileImage}`}
              onClick={() => setVisible(visible ? false : true)}
            />
            {visible && (
              <Lightbox
                mainSrc={`./images/${userInfo.profileImage}`}
                onCloseRequest={() => setVisible(false)}
              />
            )}
          </>
        ) : (
          <Avatar icon={<UserOutlined />} />
        )}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div>
            Description&nbsp;
            {descriptionButtonToggle ? (
              <Button size={"small"} type="primary" onClick={changeDescription}>
                modify
              </Button>
            ) : (
              <Button
                size={"small"}
                type="primary"
                onClick={() =>
                  setDescriptionButtonToggle(
                    descriptionButtonToggle ? false : true
                  )
                }
              >
                change
              </Button>
            )}
          </div>
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
