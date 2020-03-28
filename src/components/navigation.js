import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { SubMenu } = Menu;

const Span = styled.span``;

const Navigation = () => {
  const handleClick = e => {
    console.log("click ", e);
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
          <Link to={{ pathname: "/home", state: "flushDeal" }}>Home</Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <AppstoreOutlined />
          <Link to={{ pathname: "/profile", state: "flushDeal" }}>Profile</Link>
        </Menu.Item>
        <Menu.Item key="signup">
          <AppstoreOutlined />
          <Link to={{ pathname: "/signup", state: "flushDeal" }}>Sign Up</Link>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default Navigation;
