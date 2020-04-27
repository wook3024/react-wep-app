import React, { useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  POST_LIST_REMOVE_ACTION,
  SET_SEARCHTAG_ACTION,
} from "../reducers/actions";
import Input from "antd/lib/input";

import "antd/lib/input/style/css";

const { Search } = Input;

const Searchform = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const inputSearch = useRef(null);

  const onSearch = useCallback(
    (value) => {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
