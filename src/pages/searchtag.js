import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { message } from "antd";

import {
  GET_POST_DATA_ACTION,
  GET_MORE_POST_ACTION,
  POST_LIST_REMOVE_ACTION,
} from "../reducers/actions";
import Postcard from "../components/postcard";
import Searchform from "../components/searchform";
import "./App.css";

const Profile = () => {
  const { post, searchtag } = useSelector((state) => state);
  const dispatch = useDispatch();

  let getDataCheck = false;
  let getPost = [];
  let firstPostId = undefined;

  console.log("searchtag post", post, searchtag);

  const onScroll = () => {
    if (
      window.scrollY >
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight -
          500 &&
      !getDataCheck &&
      getPost[0] &&
      getPost.map((post) => {
        return post.id === firstPostId;
      })
    ) {
      getDataCheck = true;
      console.log(
        "getNewpost",
        getPost,
        getPost.length - 1,
        getPost[getPost.length - 1]
      );
      axios({
        method: "get",
        url: "/post/searchtag",
        params: {
          id: getPost[0] ? getPost[getPost.length - 1].id : undefined,
          content: searchtag,
        },
      })
        .then((hashtagData) => {
          getPost = hashtagData.data.map((searchtag) => searchtag);
          firstPostId = firstPostId === undefined ? getPost[0].id : firstPostId;
          dispatch({
            type: GET_MORE_POST_ACTION,
            payload: { post: getPost },
          });
        })
        .then(() => {
          getDataCheck = false;
        })
        .catch((error) => {
          console.error("😡 ", error);
        });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("useEffect check", post, getPost);
    if (getPost[0] !== post[0]) {
      dispatch({
        type: POST_LIST_REMOVE_ACTION,
      });
      getPost = [];
    }
    axios({
      method: "get",
      url: "/post/searchtag",
      params: {
        id: getPost[0] ? getPost[getPost.length - 1].id : undefined,
        content: searchtag,
      },
    })
      .then((searchtagData) => {
        console.log("searchtagData", searchtagData);
        getPost = searchtagData.data.map((searchtag) => searchtag);
        dispatch({
          type: GET_POST_DATA_ACTION,
          payload: { post: getPost },
        });
      })
      .then(() => {
        if (getPost.length === 0) {
          message.warning("not found! 🐳");
        }
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchtag, searchtag !== post.searchtag]);

  return (
    <div>
      <Searchform />
      {post.map((data) => {
        return <Postcard key={data.created_at} post={{ data }} />;
      })}
    </div>
  );
};

export default Profile;
