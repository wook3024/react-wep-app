import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Input } from "antd";

import {
  POST_LIST_REMOVE_ACTION,
  SET_SEARCHTAG_ACTION,
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
      type: SET_SEARCHTAG_ACTION,
      payload: { searchtag: value },
    });
    console.log("input search", inputSearch);
    inputSearch.current.input.state.value = null;
    // history.push("/main");
    history.push("/searchtag");
  };

  return (
    <Search
      style={{
        display: "flex",
        margin: "0 auto",
        width: 400,
      }}
      placeholder="input search text"
      onSearch={onSearch}
      ref={inputSearch}
    />
  );
};

export default Searchform;
