import React from "react";
import { useSelector } from "react-redux";

import Postcard from "../components/postcard";
import Searchform from "../components/searchform";
import "./App.css";

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
