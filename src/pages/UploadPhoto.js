import React, { useEffect } from 'react';
import S3UploadUsingCognitoIdPool from "../S3UploadUsingCognitoIdPool";
import { useGlobalContext } from "../context";



export default function UploadPhoto(){
    const {user, fetchUserDetails} = useGlobalContext()
    useEffect(() => {
        fetchUserDetails();
        
      }, [localStorage.getItem("accessToken"), localStorage.getItem("user_id"),user.phone]);
    
    return(<div
        style={{
          width: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "50px",
          backgroundColor: "white",
          padding: "25px",
          border:'2px solid #34b38d', borderTopLeftRadius:'10%', padding:'20px'
        }}
      >
        <img
          src={user["profile_pic"]}
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        ></img>
        <h3 style={{ marginTop: "20px", fontFamily:'cursive' }}>Upload Profile Picture</h3>
        <S3UploadUsingCognitoIdPool />
      </div>)

}