import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Menu, Button, message, Popover } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  ArrowUpOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import axios from "axios";

import { USER_INFO_REFRESH_ACTION, LOG_OUT_ACTION } from "../reducers/actions";

const { SubMenu } = Menu;

const Navigation = () => {
  const { userInfo } = useSelector((state) => state);

  const dispatch = useDispatch();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userInfo && userInfo.id]);

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
          <div>
            <p>content</p>
            <p>content</p>
            <p>content</p>
            <p>content</p>
            <p>content</p>
            <p>content</p>
            <p>content</p>
            <p>content</p>
            <p>content</p>
          </div>
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
          onClick={() => {
            // window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
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
            3
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
    </>
  );
};

export default Navigation;
