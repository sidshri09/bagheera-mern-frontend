import React, { Component } from "react";
import moment from "moment";

const Person = ({person}) => {
  const {id, username,email, phone, createdAt, profile_pic} = person
  let dt = moment(createdAt).format("MMMM D, YYYY, h:mm:ss a");

  const openProfile=()=>{

    // window.location.replace(`https://bagheerapost.com/profile/${email}`)
     window.location.replace(`${process.env.REACT_APP_DOMAIN}profile/${username}`)

  }


  return (
    <section key={id} className="item" onClick={openProfile}>
      <div>
        <div className="img-container" style={{ marginTop: "15px" }}>
          <img
            style={{ width: "100px", height: "100px" }}
            className="person-img"
            src={profile_pic}
          ></img>
        </div>
        <h4>{email}</h4>
        <p
          style={{
            fontFamily: "math",
            fontSize: "10px",
            marginTop: "10px",
          }}
        >
          Joined on {dt}
        </p>
      </div>
    </section>
  );
};

export default Person;
