import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Menu, Button, message, Input } from "antd";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import axios from "axios";

import {
  USER_INFO_REFRESH_ACTION,
  LOG_OUT_ACTION,
  SET_HASHTAG_ACTION,
  POST_LIST_REMOVE_ACTION,
} from "../reducers/actions";

const { SubMenu } = Menu;
const { Search } = Input;

const Navigation = () => {
  const { userInfo } = useSelector((state) => state);

  const inputSearch = useRef(null);

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

  const onSearch = (value) => {
    console.log("onSearch", value);
    dispatch({
      type: POST_LIST_REMOVE_ACTION,
    });
    dispatch({
      type: SET_HASHTAG_ACTION,
      payload: { hashtag: value },
    });
    console.log("input search", inputSearch);
    inputSearch.current.input.state.value = null;
    history.push("/main");
    history.push("/search");
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
      <Search
        style={{
          display: "block",
          margin: "0 auto",
          width: 400,
        }}
        placeholder="input search text"
        onSearch={onSearch}
        enterButton
        ref={inputSearch}
      />
    </>
  );
};

export default Navigation;
