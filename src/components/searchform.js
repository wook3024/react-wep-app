import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Input } from "antd";

import {
  POST_LIST_REMOVE_ACTION,
  SET_HASHTAG_ACTION,
} from "../reducers/actions";

const { Search } = Input;

const Searchform = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const inputSearch = useRef(null);

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
  );
};

export default Searchform;
