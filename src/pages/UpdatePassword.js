import React, { useEffect } from 'react';
import { useGlobalContext } from "../context";
import Alert from "../Alert";


export default function UpdatePassword(){
    const {user,password,fetchUserDetails, setPassword, oldPass, setOldPass,updatePassword, alert, showAlert} = useGlobalContext()

    useEffect(() => {
        fetchUserDetails();
        
      }, [localStorage.getItem("accessToken"), localStorage.getItem("user_id"),user.phone]);
    

    return(<section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <form
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: "50px",
            backgroundColor: "white",
            padding: "25px",
            width: "500px",
          }}
          onSubmit={updatePassword}
        >
          <div style={{ display: "flex", flexDirection: "column", border:'2px solid #34b38d', borderTopLeftRadius:'10%', padding:'20px' }}>
            
            <label>
              Old Password{" "}
              <input
                style={{
                  marginLeft: "35px",
                  border: "none",
                  borderTopLeftRadius: "5px",
                  borderBottomLeftRadius: "5px",
                  paddingLeft: "15px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  height: "35px",
                  width: "100px",
                  background: "white",
                }}
                type="password"
                id="password"
                value={oldPass}
                placeholder="password"
                onChange={(e) => setOldPass(e.target.value)}
              />
            </label>
            <label>
              New Password{" "}
              <input
                style={{
                  marginLeft: "35px",
                  border: "none",
                  borderTopLeftRadius: "5px",
                  borderBottomLeftRadius: "5px",
                  paddingLeft: "15px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  height: "35px",
                  width: "100px",
                  background: "white",
                }}
                type="password"
                id="password"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            
            <button
              style={{ marginTop: "20px" }}
              className="account-btn"
              type="submit"
              onClick={updatePassword}
            >
              Update
            </button>
          </div>
        </form>
        {alert.show && (
          <Alert
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            {...alert}
            removeAlert={showAlert}
            condition={password}
          />
        )}</section>)

}