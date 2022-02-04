import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import Alert from "../Alert";
import logo from '../Infinity-1s-200px.gif'

const Signin = () => {
  const {
    username,
    password,
    loggedin,
    handleLogin,
    setPassword,
    setUsername,
    showAlert,
    alert,
    loginProgress
  } = useGlobalContext();

  return (
    <div>
      {(loggedin || localStorage.getItem("loggedin"))? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <Link className="link" to="/" style={{fontFamily:'cursive'}}>
            {" "}
            Welcome, {localStorage.getItem("user_id")}, enjoi posts here
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", justifyContent:'center', alignItems:'center' }}>
          
            <form
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: "50px",
              }}
              onSubmit={handleLogin}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <input
                  style={{
                    border: "none",
                    borderTopLeftRadius: "5px",
                    borderBottomLeftRadius: "5px",
                    paddingLeft: "15px",
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    height: "35px",
                    width: "100px",
                    background: "hsl(210, 36%, 96%)",
                  }}
                  type="text"
                  id="username"
                  value={username}
                  placeholder="username"
                  onChange={(e) => setUsername(e.target.value)}
                />

                <input
                  style={{
                    border: "none",
                    borderTopLeftRadius: "5px",
                    borderBottomLeftRadius: "5px",
                    paddingLeft: "15px",
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    height: "35px",
                    width: "100px",
                    marginLeft: "10px",
                    background: "hsl(210, 36%, 96%)",
                  }}
                  type="password"
                  id="password"
                  value={password}
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="button" type="submit">
                Login
              </button>
              
            </form>
            {loginProgress?<img style={{width:'5%', background:'transparent', marginTop:'10px'}} src={logo}/>:null}
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
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Signin;
