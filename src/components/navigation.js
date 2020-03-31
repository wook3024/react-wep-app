import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { USER_INFO_REFRESH } from "../reducers/actions";

const { SubMenu } = Menu;

const Span = styled.span``;

const Navigation = () => {
  const { userInfo } = useSelector(state => state);

  const dispatch = useDispatch();

  useEffect(() => {
    const loginCheck = axios({
      method: "post",
      url: `http://localhost:8080/user/signincheck`,
      withCredentials: true
    });
    loginCheck.then(res => {
      dispatch({
        type: USER_INFO_REFRESH,
        payload: res.data
      });
    });
  }, [dispatch, userInfo.username]);

  const handleClick = e => {
    // console.log("click ", e);
  };

  return (
    <>
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
              Navigation Three - Submenu
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
          <Link to={{ pathname: "/", state: "flushDeal" }}>Home</Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <AppstoreOutlined />
          <Link to={{ pathname: "/profile", state: "flushDeal" }}>Profile</Link>
        </Menu.Item>
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
        <Menu.Item key="index">
          <AppstoreOutlined />
          <Link to={{ pathname: "/index", state: "flushDeal" }}>Index</Link>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default Navigation;
