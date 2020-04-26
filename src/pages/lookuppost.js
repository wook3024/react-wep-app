import React, { lazy } from "react";
import { useSelector } from "react-redux";

import "./App.css";

const Postcard = lazy(() => import("../components/postcard"));
const Searchform = lazy(() => import("../components/searchform"));

const Profile = () => {
  const { post } = useSelector((state) => state);

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
