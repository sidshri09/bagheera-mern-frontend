import React from "react";
import SinglePost from "./SinglePost";
import Loading from "./Loading";

const GetProfilePosts = ({ posts, loading, username }) => {
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
          if (post.user.username === username){
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

export default GetProfilePosts;
