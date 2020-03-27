import React, { useState } from "react";
import { Button, List, Card } from "antd";
import Icon from "@ant-design/icons";

import "./App.css";

const Index = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <List>
        <p>You clicked {count} times </p>
        <button onClick={() => setCount(count + 1)}>Click me</button>
      </List>
    </div>
  );
};

export default Index;
