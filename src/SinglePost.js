import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlineLike,
  AiTwotoneLike,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineMore,
} from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { RiReplyLine } from "react-icons/ri";
import moment from "moment";
import Replies from "./Replies";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { useGlobalContext } from "./context";

const SinglePost = ({ post }) => {
  const textRef = useRef(null);
  const voteUrl = process.env.REACT_APP_NODE_API_BASE_URL+"vote/"
  const postUrl = process.env.REACT_APP_NODE_API_BASE_URL+"post/"
  const [postLiked, setPostLiked] = useState(false);
  const [postDeleted, setPostDeleted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [postReply, setPostReply] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyList, setReplyList] = useState([]);
  const [anyReply, setAnyReply] = useState(false);
  const [postLike, setPostLike] = useState(0)
  const [replyCount, setReplyCount] = useState(0);
  const [mediaPost, setMediaPost] = useState(false)
  const [imgPost, setImgPost] = useState(false)
  const [vidPost, setVidPost] = useState(false)

  const {
    refreshToken,
    postId,
    setPostId,
  } = useGlobalContext();
  const { _id, content, user, createdAt, parent_post, voters, votes } = post;

  let dt = moment(createdAt).format("MMMM D, YYYY, h:mm:ss a");

  useEffect(() => {
    setPostId(_id);
    setPostLike(votes.length);
    setPostContent(content);
    fetchReplies();
  }, [post,_id,votes,content]);

  useEffect(() => {
    //re render on update
    setPostLike((prev) => prev);
  }, [postLiked]);

  useEffect(()=>{
    if(voters)
      {
        voters.map(voter => {
          if(voter.username === localStorage.getItem("user_id")){
            setPostLiked(true);
          }
        })
      }
      if(post.content && post.content.includes("https://bagheera-img.s3.amazonaws.com/")){
        setMediaPost(true);
        if(post.content.endsWith(".jpg") ||
        post.content.endsWith(".png") ||
        post.content.endsWith(".jpeg") ||
        post.content.endsWith(".gif") ||
        post.content.endsWith(".bpm") ||
        post.content.endsWith(".apng") ||
        post.content.endsWith(".svg") ||
        post.content.endsWith("ico")){
          setImgPost(true)
        }
        if(post.content.endsWith(".mp4") ||
        post.content.endsWith(".ogg") ||
        post.content.endsWith(".webm")){
          setVidPost(true)
        }
      }
  }, [postLiked,voters]);


  const fetchReplies = async () => {
    const response = await fetch(postUrl + "replies/" + _id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      setReplyList(data);
      setAnyReply(true);
      setReplyCount(data.length);
    } 
    if (response.status === 404)  {
      setReplyList([]);
      setAnyReply(false);
      console.log("no replies for post id", _id);
    }
    if (response.status === 403){
      refreshToken();
    } 
  };
  

const editPost = async (e) => {
  e.preventDefault();
  const response = await fetch(`${postUrl}${_id}`, {
    method: "PUT",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({
      content: postContent,
    }),
  });
  if (response.status === 403){
    refreshToken();
  } 
  if(response.status === 404){
    console.log("post not found, invalid post id");
  }
  if(response.status === 200)
  {  setEditing(false);
    window.location.reload();}
};

const postReplyFunc = async (e) => {
  e.preventDefault();
  const response = await fetch(postUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({
      content: replyContent,
      parent_post: post._id,
    }),
  });
  if (response.status === 403){
    refreshToken();
  } 
  if(response.status === 400){
    console.log("bad request: post reply")
  }
  if(response.status === 200)
  {  setPostReply(false);
    window.location.reload();}
};

  const addLike = async () => {
    if (postLiked) return;
    setPostLiked(true);
    setPostLike((prev) => prev + 1);
    const response = await fetch(voteUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ id: _id, dir: true }),
    });
    if (response.status === 403){
      refreshToken();
    } 
    if (response.status === 200) {
      setPostLiked(true);
    } else {
      setPostLiked(false);
      setPostLike((prev) => prev - 1);
    }
  };
  
  const unlikePost = async () => {
    if (!postLiked) return;
    setPostLiked(false);
    setPostLike((prev) => prev - 1);
  
    const response = await fetch(voteUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ id: _id, dir: false }),
    });
    if (response.status === 403){
      refreshToken();
    } 
    if (response.status === 200) {
      setPostLiked(false);
    }else{
      setPostLiked(true);
      setPostLike((prev) => prev + 1);
    }
  
  };
  
  const handleDelete = async () => {
    const response = await fetch(`${postUrl}${_id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.status === 403){
      refreshToken();
    } 
    if (response.status === 200) {
      setPostDeleted(true);
      window.location.replace(process.env.REACT_APP_DOMAIN)
      // window.location.replace(`http://localhost:3000`);
    }
    if (response.status === 400) {
      console.log("invalid post id: delete error")
    }
  };
  
  const handleEdit = () => {
    setEditing(true);
  };
  
  const handleReply = () => {
    console.log("inside handleReply");
    setPostReply(true);
  };
  
  const openSinglePost = () => {
    window.location.replace(`${process.env.REACT_APP_DOMAIN}post/${_id}`);
    // window.location.replace(`http://localhost:3000/post/${_id}`);
  };
  
  const handlePostClick = (e) => {
    if (
      e.target.classList.contains("item") ||
      e.target.classList.contains("item-center") ||
      e.target.classList.contains("img-container") ||
      e.target.classList.contains("person-img") ||
      e.target.classList.contains("itm")
    ) {
      openSinglePost();
    }
  };
  return (
    <>
      {postDeleted ? null : editing ? (
        <section className="section-center">
          <form className="grocery-form">
            <div className="form-control">
              <input
                type="text"
                id="content"
                ref={textRef}
                autoFocus
                value={postContent}
                placeholder={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: "15px",
              }}
            >
              <button className="button" type="submit" onClick={editPost}>
                Submit
              </button>
              <button
                className="button"
                type="submit"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : postReply ? (
        <section className="section-center">
          <form className="grocery-form">
            <div className="form-control">
              <input
                type="text"
                id="content"
                autoFocus
                value={replyContent}
                placeholder="Reply..."
                onChange={(e) => setReplyContent(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: "15px",
              }}
            >
              <button className="button" type="submit" onClick={postReplyFunc}>
                Submit
              </button>
              <button
                className="button"
                type="submit"
                onClick={() => setPostReply(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "25px",
          }}
        >
          <section
            key={_id}
            className="item"
            onClick={(e) => handlePostClick(e)}
          >
            {parent_post && (
              <Link to={`/post/${parent_post}`}>
                <AiOutlineMore data-tip data-for="parentTip" />
                <ReactTooltip id="parentTip" place="top" effect="solid">
                  Original Post
                </ReactTooltip>
              </Link>
            )}
            <div className="item-center">
              <div className="img-container" style={{ marginTop: "15px" }}>
                <img
                  style={{ width: "100px", height: "100px" }}
                  className="person-img"
                  src={user.profile_pic}
                ></img>
              </div>
              <h4 className="itm" style={{ fontColor: "black" }}>
                {user.username}
              </h4>
              {imgPost?
              <img src={post.content}></img>:vidPost?
              <video width="900" height="1000" controls>
                  <source src={post.content} type="video/mp4" />
                  Your browser does not support the video tag.
              </video>:
              <p
                className="itm"
                style={{
                  fontFamily: "Gill Sans",
                  fontSize: "20px",
                  fontColor: "black",
                }}
              >
                {post.content}
              </p>}
              <p
                className="itm"
                style={{
                  fontFamily: "math",
                  fontSize: "10px",
                  marginTop: "10px",
                  fontColor: "black",
                }}
              >
                {dt}
              </p>
              <div className="post-btn-container">
                <AiOutlineEdit
                  data-tip
                  data-for="editTip"
                  className="post-btn"
                  onClick={handleEdit}
                />
                <ReactTooltip id="editTip" place="top" effect="solid">
                  Edit
                </ReactTooltip>
                <AiOutlineDelete
                  data-tip
                  data-for="deleteTip"
                  className="post-btn"
                  onClick={handleDelete}
                />
                <ReactTooltip id="deleteTip" place="top" effect="solid">
                  Delete
                </ReactTooltip>
                <div style={{color:'#34b38d'}}>
                  <FaRegComment
                    data-tip
                    data-for="replyTip"
                    className="post-btn"
                    onClick={handleReply}
                  />

                  <ReactTooltip id="replyTip" place="top" effect="solid">
                    Reply
                  </ReactTooltip>
                  {replyCount}
                </div>
                <div data-tip data-for="likeTip">
                  {!postLiked ? (
                    <AiOutlineLike className="post-btn" onClick={addLike} />
                  ) : (
                    <AiTwotoneLike className="post-btn" onClick={unlikePost} />
                  )}
                  <label className="post-btn" style={{ marginLeft: "5px" }}>
                    {postLike}
                  </label>
                </div>
                <ReactTooltip id="likeTip" place="top" effect="solid">
                  likes
                </ReactTooltip>
              </div>
            </div>
          </section>

          {showReply ? <Replies posts={replyList} /> : null}
        </div>
      )}
    </>
  );
};

export default SinglePost;
