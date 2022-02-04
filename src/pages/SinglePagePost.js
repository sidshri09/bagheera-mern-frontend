import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "../Loading";
import Replies from "../Replies";
import { FaRegComment } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import {
  TwitterIcon,
  TwitterShareButton,
  FacebookIcon,
  FacebookShareButton,
  EmailIcon,
  EmailShareButton,
} from "react-share";
import {
  AiOutlineLike,
  AiTwotoneLike,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineMore,
} from "react-icons/ai";
import { useGlobalContext } from "../context";

export default function SinglePagePost() {
  const { id } = useParams();
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
    loading,
    post, 
    fetchAPost,
    refreshToken,
    } = useGlobalContext();
 

  
  useEffect(()=>{
    fetchAPost(id)
  },[id,localStorage.getItem("accessToken")]);

  useEffect(() => {
    fetchReplies();
  }, [post]);

  useEffect(() => {
    //re render on update
    setPostContent(post.content);
    setPostLike(post.votes && post.votes.length);
  }, [post]);

  useEffect(()=>{
    if(post.voters)
      {
        post.voters.map(voter => {
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
  }, [postLiked,post]);

  const fetchReplies = async () => {
    const response = await fetch(postUrl + "replies/" + id, {
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
      console.log("no replies for post id", id);
    }
    if (response.status === 403){
      refreshToken();
    } 
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
      body: JSON.stringify({ id: post._id, dir: true }),
    });
    if (response.status === 403){
      refreshToken();
    } 
    if (response.status === 200) {
      setPostLiked(true);
    } else {
      setPostLiked(false);
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
      body: JSON.stringify({ id: id, dir: false }),
    });
    if (response.status === 403){
      refreshToken();
    } 
    if (response.status === 200) {
      setPostLiked(false);
    }
  
  };
  
  const handleDelete = async () => {
    const response = await fetch(`${postUrl}${id}`, {
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
      window.location.replace(process.env.REACT_APP_DOMAIN);
    }
    if (response.status === 400) {
      console.log("invalid post id: delete error")
    }
  };
  

  const editPost = async (e) => {
    e.preventDefault();
    const response = await fetch(`${postUrl}${id}`, {
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
        parent_post: id,
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

  const handleEdit = () => {
    setEditing(true);
  };
  
  const handleReply = () => {
    setPostReply(true);
  };
  
  
  

  if (loading) {
    console.log("loading -> ", loading);
    return <Loading />;
  }
  
  if (!loading) {
    return (
      <>
        {postDeleted ? null : editing ? (
          <section className="section-center">
            <form className="grocery-form">
              <div className="form-control">
                <input
                  type="text"
                  id="content"
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
                <button
                  className="button"
                  type="submit"
                  onClick={postReplyFunc}
                >
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
            }}
          >
            <section key={id} className="post-item">
              {post.parent_post && (
                <Link to={`/post/${post.parent_post}`}>
                  <AiOutlineMore />
                </Link>
              )}
              <div className="item-center">
                <div className="img-container" style={{ marginTop: "15px" }}>
                  <img
                    style={{ width: "100px", height: "100px" }}
                    className="person-img"
                    src={post.user && post.user.profile_pic}
                  ></img>
                </div>
                <h4>{post.user && post.user.username}</h4>

               
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
                  style={{
                    fontFamily: "math",
                    fontSize: "10px",
                    marginTop: "10px",
                  }}
                >
                  {moment(post.createdAt).format("MMMM D, YYYY, h:mm:ss a")}
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
                  <div style={{ color: "#34b38d" }}>
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
                      <AiTwotoneLike
                        className="post-btn"
                        onClick={unlikePost}
                      />
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
              <div
                data-tip
                data-for="socialTip"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TwitterShareButton url={window.location.href}>
                  <TwitterIcon className="social-icon" size={16} round={true} />
                </TwitterShareButton>
                <FacebookShareButton url={window.location.href}>
                  <FacebookIcon
                    className="social-icon"
                    size={16}
                    round={true}
                  />
                </FacebookShareButton>
                <EmailShareButton url={window.location.href}>
                  <EmailIcon className="social-icon" size={16} round={true} />
                </EmailShareButton>
              </div>
              <ReactTooltip id="socialTip" place="top" effect="solid">
                Share
              </ReactTooltip>
            </section>
            <Replies posts={replyList} />
          </div>
        )}
      </>
    );
  }
}
