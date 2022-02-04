import React from "react";
import SinglePost from "./SinglePost";
import Loading from "./Loading";

const GetPosts = ({ posts, loading }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems:"center"
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        posts.map((post) => {
          if (post.user.username === localStorage.getItem("user_id")){
            return loading ? (
              <h2>Loading</h2>
            ) : (
              <SinglePost key={post._id} post={post} />
            );
          }
        })
      )}
    </div>
  );
};

export default GetPosts;
