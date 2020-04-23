import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Menu, Button, message, Popover, Tag } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  ArrowUpOutlined,
  MessageOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";

import {
  USER_INFO_REFRESH_ACTION,
  LOG_OUT_ACTION,
  GET_NOTIFICATION_DATA_ACTION,
  POST_LIST_REMOVE_ACTION,
  GET_POST_DATA_ACTION,
  REMOVE_NOTIFICATION_DATA_ACTION,
} from "../reducers/actions";

const { SubMenu } = Menu;

const Navigation = () => {
  const { userInfo, notification } = useSelector((state) => state);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    console.log("reload check");
    axios({
      method: "post",
      url: "/user/signincheck",
      withCredentials: true,
    })
      .then((res) => {
        console.log("login check", res);
        return dispatch({
          type: USER_INFO_REFRESH_ACTION,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.error("😡 ", error);
      });

    axios({
      method: "get",
      url: "/user/notification",
      withCredentials: true,
    })
      .then((res) => {
        console.log("get notification data", res);
        dispatch({
          type: GET_NOTIFICATION_DATA_ACTION,
          payload: { notification: res },
        });
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userInfo && userInfo.id, notification && notification.length]);

  const logOut = () => {
    axios({
      method: "post",
      url: "/user/logout",
      withCredentials: true,
    })
      .then((res) => {
        message.success(res.data);
        dispatch({
          type: LOG_OUT_ACTION,
        });
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  };

  const handleClick = (e) => {
    // console.log("click ", e);
  };

  const deleteMessage = (id) => {
    console.log("deleteMessage element id", id);
    axios({
      method: "post",
      url: "post/user/notification/delete",
      withCredentials: true,
      params: { id: id },
    })
      .then((res) => {
        console.log("deleteMessage result", res);
        dispatch({
          type: REMOVE_NOTIFICATION_DATA_ACTION,
          payload: { id: id },
        });
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  };

  const movePostPage = (id) => {
    console.log("movePostPage Post id", id);
    axios({
      method: "get",
      url: `post/${id}`,
      withCredentials: true,
      params: { id: id },
    })
      .then((res) => {
        console.log("movePostPage Post result", res);
        dispatch({
          type: POST_LIST_REMOVE_ACTION,
        });
        dispatch({
          type: GET_POST_DATA_ACTION,
          payload: { post: [res.data] },
        });
        window.scrollTo(0, 0);
        history.push("/lookuppost");
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  };

  return (
    <>
      <Menu
        style={{
          margin: "0 0 0.5rem 0",
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={handleClick}
        mode="horizontal"
      >
        <SubMenu
          title={
            <span className="submenu-title-wrapper">
              <SettingOutlined />
              Submenu
            </span>
          }
        >
          <Menu.ItemGroup title="Item 1">
            <Menu.Item key="setting:1">It will be released later.</Menu.Item>
            <Menu.Item key="setting:2">It will be released later.</Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup title="Item 2">
            <Menu.Item key="setting:3">It will be released later.</Menu.Item>
            <Menu.Item key="setting:4">It will be released later.</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
        <Menu.Item key="home">
          <AppstoreOutlined />
          <Link to={{ pathname: "/main", state: "flushDeal" }}>Home</Link>
        </Menu.Item>
        {userInfo && userInfo.username && (
          <Menu.Item key="profile">
            <AppstoreOutlined />
            <Link to={{ pathname: "/profile", state: "flushDeal" }}>
              Profile
            </Link>
          </Menu.Item>
        )}
        {userInfo && !userInfo.username && (
          <Menu.Item key="signin">
            <AppstoreOutlined />
            <Link to={{ pathname: "/signin", state: "flushDeal" }}>
              Sign In
            </Link>
          </Menu.Item>
        )}
        {userInfo && !userInfo.username && (
          <Menu.Item key="signup">
            <AppstoreOutlined />
            <Link to={{ pathname: "/signup", state: "flushDeal" }}>
              Sign Up
            </Link>
          </Menu.Item>
        )}
        {userInfo && userInfo.username && (
          <Menu.Item key="logout">
            <AppstoreOutlined />
            <Button type="link" style={{ color: "#595c51" }} onClick={logOut}>
              Log Out
            </Button>
          </Menu.Item>
        )}
      </Menu>

      <Popover
        content={
          <>
            {Array.isArray(notification.data) &&
              notification.data.map((data) => {
                return (
                  <>
                    <div
                      onClick={() => {
                        movePostPage(data.postId);
                      }}
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                    >
                      <Tag color="magenta">username</Tag>
                      <Tag color="default">{data.username}</Tag> <br />
                      <Tag color="red">state</Tag>
                      <Tag color="default">{data.state}</Tag> <br />
                      <Tag style={{ cursor: "pointer" }} color="volcano">
                        postId
                      </Tag>
                      <Tag style={{ cursor: "pointer" }} color="default">
                        {data.postId}
                      </Tag>{" "}
                      <br />
                      {data.commentId !== null && (
                        <>
                          <Tag color="orange">commentId</Tag>
                          <Tag color="default">{data.commentId}</Tag>
                          <br />
                        </>
                      )}
                    </div>
                    <Tag
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        deleteMessage(data.id);
                      }}
                      icon={<DeleteOutlined />}
                      color="#cd201f"
                    >
                      delete
                    </Tag>{" "}
                    <br />
                    <br />
                  </>
                );
              })}
          </>
        }
        title="Notification"
        trigger="click"
      >
        <Button
          style={{
            display: "block",
            position: "fixed",
            bottom: "60px",
            right: "30px",
            zIndex: 99,
            borderRadius: "50px",
          }}
          type="primary"
          ghost
        >
          <MessageOutlined />
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              padding: "0.04rem 0.4rem",
              borderRadius: "50%",
              background: "#fa163f",
              color: "white",
            }}
          >
            {Array.isArray(notification.data) ? notification.data.length : null}
          </span>
        </Button>
      </Popover>
      <Button
        style={{
          display: "block",
          position: "fixed",
          bottom: "20px",
          right: "30px",
          zIndex: 99,
          borderRadius: "50px",
        }}
        onClick={() => {
          // window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }}
        type="primary"
        ghost
      >
        <ArrowUpOutlined />
      </Button>
      <div
        style={{
          display: "block",
          position: "fixed",
          bottom: "20px",
          left: "30px",
          zIndex: 99,
          opacity: 0.7,
        }}
      >
        favicon maker{" "}
        <a href="https://www.flaticon.com/kr/authors/freepik" title="Freepik">
          Freepik
        </a>{" "}
        from{" "}
        <a href="https://www.flaticon.com/kr/" title="Flaticon">
          www.flaticon.com
        </a>
      </div>
    </>
  );
};

export default Navigation;
