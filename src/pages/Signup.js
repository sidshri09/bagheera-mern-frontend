import React, { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../Alert";
import { useGlobalContext } from "../context";


const Signup = () => {
  
  const {username, setUsername, email, setEmail, password, setPassword, signedUp, signUp, confirmedUsername} = useGlobalContext();
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  
  return (
    <>
      {signedUp ? (
        <article style={{ display: "grid", justifyContent: "center" }}>
          <h1 style={{fontFamily:'cursive'}}>Hi !! {confirmedUsername}!!</h1>
          <Link to="/signin">
            <span style={{fontFamily:'cursive'}}>Login here to enjoi Posts</span>
          </Link>
        </article>
      ) : (
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: "50px",
            }}
            onSubmit={signUp}
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
                id="email"
                value={email}
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
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
                  background: "hsl(210, 36%, 96%)",
                }}
                type="password"
                id="password"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="button" type="submit">
                Signup
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
          )}
        </section>
      )}
    </>
  );
};

export default Signup;
