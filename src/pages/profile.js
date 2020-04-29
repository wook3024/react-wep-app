import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import Lightbox from "react-image-lightbox";

import "./App.css";
import {
  USER_INFO_REFRESH_ACTION,
  GET_SCRAP_DATA_ACTION,
  GET_FOLLOWING_DATA_ACTION,
  UNFOLLOWING_ACTION,
  UNSCRAP_ACTION,
} from "../reducers/actions";
import Avatar from "antd/lib/avatar";
import message from "antd/lib/message";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Upload from "antd/lib/upload";
import Table from "antd/lib/table";
import Descriptions from "antd/lib/descriptions";

import "antd/lib/avatar/style/css";
import "antd/lib/message/style/css";
import "antd/lib/input/style/css";
import "antd/lib/button/style/css";
import "antd/lib/upload/style/css";
import "antd/lib/table/style/css";
import "antd/lib/descriptions/style/css";

const { TextArea } = Input;

const Profile = () => {
  const [changeToNickname, setChangeToNickname] = useState(false);
  const [descriptionButtonToggle, setDescriptionButtonToggle] = useState(false);
  const [nicknameButtonToggle, setNicknameButtonToggle] = useState(false);
  const [changeToDescription, setChangeToDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [followingData, setFollowingData] = useState([]);
  const [scrapData, setScrapData] = useState([]);
  const [visible, setVisible] = useState(false);
  const { userInfo, following, scrap } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    axios({
      method: "get",
      url: "/post/user/getFollowingData",
      withCredentials: true,
    })
      .then((getFollowindData) => {
        console.log("getFollowindData", getFollowindData);
        getFollowindData.data.forEach((followingUser) => {
          followingData.push({
            key: followingUser.user.id,
            name: followingUser.user.nickname,
            age: followingUser.user.age,
            created_at: followingUser.user.created_at,
            description: followingUser.user.description,
          });
        });
        dispatch({
          type: GET_FOLLOWING_DATA_ACTION,
          payload: { following: followingData },
        });
      })
      .catch((error) => {
        console.error("😡 axios getFollowingData", error);
      });

    axios({
      method: "get",
      url: "/post/user/getScrapData",
      withCredentials: true,
    })
      .then((getScrapData) => {
        // console.log("getScrapData", getScrapData);
        getScrapData.data.forEach((scrapUser) => {
          scrapData.push({
            key: scrapUser.post.id,
            title: scrapUser.post.title,
            name: scrapUser.post.user.nickname,
            created_at: scrapUser.post.created_at,
            description: scrapUser.post.content,
          });
        });
        dispatch({
          type: GET_SCRAP_DATA_ACTION,
          payload: { scrap: scrapData },
        });
      })
      .catch((error) => {
        console.error("😡 axios getScrapData", error);
      });
    console.log("inset date check", followingData, scrapData);
  }, [dispatch, followingData, scrapData]);

  console.log("profile userinfo check", userInfo);

  const followingColumns = useCallback(
    () => [
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Age", dataIndex: "age", key: "age" },
      { title: "Created_at", dataIndex: "created_at", key: "address" },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: (data) => (
          <Link
            onClick={() => {
              unFollowing(data);
            }}
          >
            Delete
          </Link>
        ),
      },
    ],
    [unFollowing]
  );

  const scrapColumns = useCallback(
    () => [
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Created_at", dataIndex: "created_at", key: "address" },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: (data) => (
          <Link
            onClick={() => {
              unScrap(data);
            }}
          >
            Delete
          </Link>
        ),
      },
    ],
    [unScrap]
  );

  const unFollowing = useCallback(
    (data) => {
      axios({
        method: "post",
        url: "/post/user/unfollowing",
        withCredentials: true,
        params: { userId: data.key },
      })
        .then((res) => {
          console.log("unFollowing response", res);
          if (res.status === 201) {
            message.success(res.data);
          } else {
            message.warning(res.data);
          }

          dispatch({
            type: UNFOLLOWING_ACTION,
            payload: { key: data.key },
          });
        })
        .catch((error) => {
          console.error("😡 unFollowing", error);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const unScrap = useCallback(
    (data) => {
      axios({
        method: "post",
        url: "/post/user/unscrap",
        withCredentials: true,
        params: { userId: data.key, postId: data.key },
      })
        .then((res) => {
          console.log("unScrap response", res);
          if (res.status === 201) {
            message.success(res.data);
          } else {
            message.warning(res.data);
          }

          dispatch({
            type: UNSCRAP_ACTION,
            payload: { key: data.key },
          });
        })
        .catch((error) => {
          console.error("😡 ", error);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onChangeNickname = useCallback((e) => {
    setChangeToNickname(e.target.value);
  }, []);

  const onChangeDescription = useCallback((e) => {
    setChangeToDescription(e.target.value);
  }, []);

  const changeDescription = useCallback(() => {
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
          type: USER_INFO_REFRESH_ACTION,
          payload: res.data,
        });
      })
      .then(() => {
        setDescriptionButtonToggle(false);
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  }, [changeToDescription, dispatch, userInfo.id]);

  const changeNickname = useCallback(() => {
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
          type: USER_INFO_REFRESH_ACTION,
          payload: { ...res.data, images: [res.data.images[0].location] },
        });
      })
      .then(() => {
        setChangeToNickname(userInfo.nickname);
        setNicknameButtonToggle(false);
      })
      .catch((error) => {
        console.error("😡 changeNockname", error);
      });
  }, [changeToNickname, dispatch, userInfo.id, userInfo.nickname]);

  const handlePost = useCallback(() => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios({
      method: "post",
      url: "/post/user/uploadProfileImage",
      withCredentials: true,
      data: formData,
      params: {
        userId: userInfo ? userInfo.id : null,
        profileImage: true,
      },
    })
      .then((res) => {
        console.log("upload", res);
        if (res.data) {
          dispatch({
            type: USER_INFO_REFRESH_ACTION,
            payload: {
              userInfo: { ...userInfo, images: [{ location: res.data }] },
            },
          });
          message.success("Update Complete With Images! 🐳");
        } else if (res.status === 200) {
          message.warning(res.data);
        } else {
          message.warning("Update failed! 😱");
        }

        setSelectedFile(null);
      })
      .catch((error) => {
        message.warning("Upload failed");
        console.error("😡 handlePost", error);
      });
  }, [dispatch, selectedFile, userInfo]);

  const props = useCallback(() => {
    return {
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
  }, []);

  return (
    <>
      <Descriptions
        style={{ margin: "5rem auto", maxWidth: 600 }}
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
                  <Button
                    size={"small"}
                    type="primary"
                    ghost
                    onClick={changeNickname}
                  >
                    modify
                  </Button>
                </>
              ) : (
                <Button
                  size={"small"}
                  type="primary"
                  ghost
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
              <Upload {...props()}>
                <Button type="primary" ghost size={"small"}>
                  select
                </Button>
              </Upload>
              {selectedFile !== null && (
                <Button
                  type="primary"
                  ghost
                  size={"small"}
                  onClick={handlePost}
                >
                  modify
                </Button>
              )}
            </div>
          }
        >
          {userInfo && userInfo.images[0] && userInfo.images[0].location ? (
            <>
              <Avatar
                src={userInfo.images[0].location}
                onClick={() => setVisible(visible ? false : true)}
              />
              {visible && (
                <Lightbox
                  mainSrc={userInfo.images[0].location}
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
                <Button
                  size={"small"}
                  type="primary"
                  ghost
                  onClick={changeDescription}
                >
                  modify
                </Button>
              ) : (
                <Button
                  size={"small"}
                  type="primary"
                  ghost
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
      <div style={{ margin: "0 auto", maxWidth: 600 }}>
        <h3>Following</h3>
        <Table
          columns={followingColumns()}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>{record.description}</p>
            ),
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          dataSource={following}
        />
      </div>
      <div style={{ margin: "5rem auto", maxWidth: 600 }}>
        <h3>Scrap</h3>
        <Table
          columns={scrapColumns()}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>{record.description}</p>
            ),
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          dataSource={scrap}
        />
      </div>
    </>
  );
};
export default Profile;
