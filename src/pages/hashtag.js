import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import Postcard from "../components/postcard";
import PostForm from "../components/postForm";
import "./App.css";
import { USER_INFO_REFRESH_ACTION } from "../reducers/actions";

const Hashtag = () => {
  const [posts, setPosts] = useState([]);
  const { post, userInfo } = useSelector((state) => state);

  const dispatch = useDispatch();

  console.log("get Hashtah Post", post);

  const onScroll = useCallback(() => {
    if (
      window.scrollY >
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight -
          500 &&
      posts.length - 1 <= post.length
    ) {
      console.log("getNewpost");
      const postIndex = post.findIndex((post) => {
        return posts[posts.length - 1].id === post.id;
      });
      let i = 0;
      while (++i <= 5 && post[postIndex + i]) {
        posts.push(post[postIndex + i]);
      }
      console.log("scroll push", posts);
      dispatch({
        type: USER_INFO_REFRESH_ACTION,
        payload: userInfo,
      });
    }
  }, [dispatch, post, posts, userInfo]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!posts[0] && posts.length <= 3) {
      let i = -1;
      while (++i <= 5 && post[i]) {
        posts.push(post[i]);
        console.log("posts check", i, post[i]);
      }
      dispatch({
        type: USER_INFO_REFRESH_ACTION,
        payload: userInfo,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {userInfo && userInfo.username && <PostForm />}
      {posts.map((data) => {
        return <Postcard key={data.created_at} post={{ data }} />;
      })}
    </div>
  );
};

export default Hashtag;
