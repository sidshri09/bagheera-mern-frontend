import React from "react";
import Loading from "../Loading";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";


export default function MyAccount() {
  const {user} = useGlobalContext()


 
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
        <h3>You're not loggedin</h3>
        <Loading />
      </div>
    );
  }
  return (
    <>
     (<section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
          <img
          src={user["profile_pic"]}
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        ></img>

        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', marginTop:'20px'}}>
          <Link to="/update-password">
            <button className="member-search-btn" style={{fontFamily:'cursive'}}>
              Change Password
            </button>
          </Link>
          <div className="underline"></div>
        </div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', marginTop:'20px'}}>
          <Link to="/upload-photo">
            <button className="member-search-btn" style={{fontFamily:'cursive'}}>
              Upload Profile Picture
            </button>
          </Link>
          <div className="underline"></div>
        </div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', marginTop:'20px', marginBottom:'20px'}}>
          <Link to="/update-user">
            <button className="member-search-btn" style={{fontFamily:'cursive'}}>
              Update Personal Details
            </button>
          </Link>
          <div className="underline"></div>
        </div>
        </section>
      )
    </>
  );
}
