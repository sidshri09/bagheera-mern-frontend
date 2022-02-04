import React, { useEffect } from "react";
import GetPosts from "./GetPosts";
import PostPost from "./PostPost";
import Helmet from "react-helmet";
import logo from "./149120.svg";
import Loading from "./Loading";
import {
  FaEnvelopeOpen,
  FaHeart,
  FaUser,
  FaOrcid,
  FaLocationArrow,
  FaPhone,
  FaCalendarTimes,
} from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import {useGlobalContext} from './context'


const Posts = () => {
  const {
    loading,
    s3uri, 
    setS3uri, 
    newUser, 
    setNewUser, 
    value,
    setValue, 
    showMap, 
    setShowMap, 
    userLoading, 
    setUserLoading, 
    showFollowers,
    setShowFollowers, 
    showFollowings, 
    setShowFollowings,
    user,
    setUser,
    fetchUserDetails,
    alert,
    loggedin,
    showAlert,
    fetchAllPosts,
    posts,
    openFollowersPage,
    openFollowingsPage,
    geolocation,
    handleValue} = useGlobalContext();
  
    

  if (loading === false && posts === []) {
    setNewUser(true);
  }
      
  useEffect(() => {
    fetchAllPosts();
    fetchUserDetails();
  }, [localStorage.getItem("accessToken")]);

  if (!(loggedin || localStorage.getItem("loggedin"))) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3>You're being logged-in</h3>
        <Loading />
      </div>
    );
  }

  return (
    <main>
      <Helmet>
        <link rel="icon" href={logo} />
        <title>Bagheera Post</title>
      </Helmet>
      {userLoading ? (
        <Loading />
      ) : (
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
                    <p style={{fontFamily:'cursive'}} className='user-value'>{user.followers.length} followers </p>
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
                    <p style={{fontFamily:'cursive'}} className="user-value"> {user.followings.length}followings</p>
                  </div>
                ) : null}
              {showMap ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Link
                    to={`/map/${geolocation.latitude}/${geolocation.longitude}`}
                  >
                    <p style={{fontFamily:'cursive'}} className="user-loc">Open Map</p>
                  </Link>
                </div>
              ) : null}
              {(!showFollowers&&!showFollowings&&!showMap)?<p className="user-value" style={{fontFamily:'cursive'}}>{value}</p>:null}

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

                <button
                  className="icon"
                  data-label="loc"
                  onMouseOver={handleValue}
                >
                  <FaLocationArrow />
                </button>
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
              </div>
            </div>
          </div>
        </main>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PostPost />
        {newUser ? (
          <h1>You have no posts</h1>
        ) : (
          <GetPosts posts={posts} loading={loading} />
        )}
      </div>
    </main>
  );
};

export default Posts;
