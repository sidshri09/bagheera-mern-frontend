import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import {
  FaEnvelopeOpen,
  FaHeart,
  FaPhone,
  FaCalendarTimes,
  FaUserPlus,
  FaUserMinus,
} from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import moment from "moment";
import { useParams} from "react-router-dom";
import GetProfilePosts from "./GetProfilePosts";
import ReactTooltip from "react-tooltip";

export default function Profile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);
  const [value, setValue] = useState("random person");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [newUser, setNewUser] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [followings, setFollowings] = useState(0)
  const [followers, setFollowers] = useState(0)

  const getUrl = process.env.REACT_APP_NODE_API_BASE_URL+"post/?search=";

  const getUserUrl = process.env.REACT_APP_NODE_API_BASE_URL+"user/username/" + id;

  const postFollowingUrl = process.env.REACT_APP_NODE_API_BASE_URL+"follower/";



  const openFollowersPage = () => {
    window.location.replace(
      `${process.env.REACT_APP_DOMAIN}followers/${user.username}`
      // `http://localhost:3000/followers/${user.username}`
    );
  };
  const openFollowingsPage = () => {
    window.location.replace(
      `${process.env.REACT_APP_DOMAIN}following/${user.username}`
      // `http://localhost:3000/following/${user.username}`
    );
  };

  
  const addFollowing = async () => {
    const response = await fetch(postFollowingUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        following: user.id,
        dir: true,
      }),
    });
    if (response.status === 200) {
      console.log("followed");
      console.log(response.json);
      setFollowed(true);
    } else {
      console.log(response.status);
    }
  };

  const unFollow = async () => {
    const response = await fetch(postFollowingUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        following: user.id,
        dir: false,
      }),
    });
    if (response.status === 200) {
      console.log("followed");
      console.log(response.json);
      setFollowed(false);
    } else {
      console.log(response.status);
    }
  };

  const fetchUserPosts = async () => {
    const response = await fetch(getUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.status === 200) {
      const user_posts = await response.json();
      console.log(user_posts);
      setPosts(user_posts);
      setPostLoading(false);
    } else {
      console.log(response.status);
    }
  };
  const fetchUserDetails = async () => {
    const response = await fetch(getUserUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.status === 200) {
      const user_data = await response.json();
      console.log(user_data);
      setUser(user_data);
      setFollowings(user_data.followings.length)
      setFollowers(user_data.followers.length)
      setValue(user_data.username);
      setLoading(false);
    } else {
      console.log(response.status);
    }
  };
  useEffect(() => {
    fetchUserDetails();
    if (postLoading === false && posts === []) {
      setNewUser(true);
    }
    if(user.followers){
      user.followers.map(fellow=>{
        if(fellow.username === localStorage.getItem("user_id")){
          setFollowed(true);
        }
      })
    }
  }, [getUserUrl, localStorage.getItem("accessToken")]);

  useEffect(() => {
    fetchUserPosts();
  }, [user]);




  const handleValue = (e) => {
    if (e.target.classList.contains("icon")) {
      setShowFollowers(false);
      setShowFollowings(false);
      const newValue = e.target.dataset.label;

      if (newValue === "CreatedAt") {
        const dt = moment(user.createdAt).format("MMMM D, YYYY");
        const val = `Joined ${dt}`;
        setValue(val);
        return;
      }
      if (newValue === "phone") {
        if (!user.phone) {
          setValue("**********");
          return;
        }
      }
      if (newValue === "followings") {
        setShowFollowings(true);
        return;
      }

      if (newValue === "followers") {
        setShowFollowers(true);
        return;
      }
      setValue(user[newValue]);
    }
  };

  if (!localStorage.getItem("loggedin")) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3>Login to search friends</h3>
        <Loading />
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <main>
          <main>
            <div className="block bcg-black"></div>
            <div className="block">
              <div className="person-container">
                <img
                  src={user.profile_pic}
                  alt="random user"
                  className="user-img"
                />
                {showFollowers ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p style={{fontFamily:'cursive'}} style={{fontWeight:'bold'}}>{followers} followers </p>
                  </div>
                ) : null}
                {showFollowings ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p style={{fontFamily:'cursive'}} style={{fontWeight:'bold'}}>{followings} followings</p>
                  </div>
                ) : null}
                <p className="user-value" style={{fontFamily:'cursive'}}>{value}</p>

                <div className="values-list">
                  <button
                    className="icon"
                    data-label="followers"
                    data-tip
                    data-for="followers"
                    onMouseOver={handleValue}
                  >
                    <IoIosPeople onClick={openFollowersPage} />
                    <ReactTooltip id="followers" place="top" effect="solid">
                      followers
                    </ReactTooltip>
                  </button>
                  <button
                    className="icon"
                    data-label="followings"
                    data-tip
                    data-for="followings"
                    onMouseOver={handleValue}
                  >
                    <FaHeart onClick={openFollowingsPage} />
                    <ReactTooltip id="followings" place="top" effect="solid">
                      followings
                    </ReactTooltip>
                  </button>
                
                  <button
                    className="icon"
                    data-label="email"
                    onMouseOver={handleValue}
                  >
                    <FaEnvelopeOpen />
                  </button>

                  {/* <button
                    className="icon"
                    data-label="loc"
                    onMouseOver={handleValue}
                  >
                    <FaLocationArrow />
                  </button> */}
                  <button
                    className="icon"
                    data-label="phone"
                    onMouseOver={handleValue}
                  >
                    <FaPhone />
                  </button>
                  <button
                    className="icon"
                    data-label="CreatedAt"
                    onMouseOver={handleValue}
                  >
                    <FaCalendarTimes />
                  </button>
                  {followed ? (
                    <button className="icon" data-tip data-for="followingTip">
                      <FaUserMinus onClick={unFollow} />
                      <ReactTooltip
                        id="followingTip"
                        place="top"
                        effect="solid"
                      >
                        you're following {user.username}
                      </ReactTooltip>
                    </button>
                  ) : (
                    <button className="icon" data-tip data-for="followTip">
                      <FaUserPlus onClick={addFollowing} />
                      <ReactTooltip id="followTip" place="top" effect="solid">
                        follow
                      </ReactTooltip>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {newUser ? (
              <h1>You have no posts</h1>
            ) : (
              <GetProfilePosts
                posts={posts}
                loading={loading}
                username={user.username}
              />
            )}
          </div>
        </main>
      )}
    </>
  );
}
