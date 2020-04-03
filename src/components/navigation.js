import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Menu, Button, message } from "antd";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import styled from "styled-components";
import axios from "axios";

import { USER_INFO_REFRESH, LOG_OUT_ACTION } from "../reducers/actions";

const { SubMenu } = Menu;
const Span = styled.span``;

const Navigation = () => {
  const { userInfo } = useSelector(state => state);

  const dispatch = useDispatch();

  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/user/signincheck",
      withCredentials: true
    })
      .then(res => {
        return dispatch({
          type: USER_INFO_REFRESH,
          payload: res.data
        });
      })
      .catch(error => {
        console.error("😡 ", error);
      });
  }, [dispatch]);

  const logOut = () => {
    axios({
      method: "post",
      url: "http://localhost:8080/user/logout",
      withCredentials: true
    })
      .then(res => {
        message.success(res.data);
        dispatch({
          type: LOG_OUT_ACTION
        });
      })
      .catch(error => {
        console.error("😡 ", error);
      });
  };

  const handleClick = e => {
    // console.log("click ", e);
  };

  return (
    <Menu
      style={{
        margin: "0 0 2rem 0"
      }}
      onClick={handleClick}
      mode="horizontal"
    >
      <SubMenu
        title={
          <Span className="submenu-title-wrapper">
            <SettingOutlined />
            Submenu
          </Span>
        }
      >
        <Menu.ItemGroup title="Item 1">
          <Menu.Item key="setting:1">Option 1</Menu.Item>
          <Menu.Item key="setting:2">Option 2</Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title="Item 2">
          <Menu.Item key="setting:3">Option 3</Menu.Item>
          <Menu.Item key="setting:4">Option 4</Menu.Item>
        </Menu.ItemGroup>
      </SubMenu>
      <Menu.Item key="home">
        <AppstoreOutlined />
        <Link to={{ pathname: "/main", state: "flushDeal" }}>Home</Link>
      </Menu.Item>
      {userInfo && userInfo.username && (
        <Menu.Item key="profile">
          <AppstoreOutlined />
          <Link to={{ pathname: "/profile", state: "flushDeal" }}>Profile</Link>
        </Menu.Item>
      )}
      {userInfo && !userInfo.username && (
        <Menu.Item key="signin">
          <AppstoreOutlined />
          <Link to={{ pathname: "/signin", state: "flushDeal" }}>Sign In</Link>
        </Menu.Item>
      )}
      {userInfo && !userInfo.username && (
        <Menu.Item key="signup">
          <AppstoreOutlined />
          <Link to={{ pathname: "/signup", state: "flushDeal" }}>Sign Up</Link>
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
  );
};

export default Navigation;
