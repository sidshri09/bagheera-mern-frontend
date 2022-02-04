import React, { useEffect } from 'react';
import Loading from "../Loading";
import Alert from "../Alert";
import { useGlobalContext } from "../context";


export default function UpdateUserDatails(){
    const {user, phone,fetchUserDetails, setPhone, password,  email, setEmail, updateUser, alert, showAlert} = useGlobalContext()
    useEffect(() => {
        fetchUserDetails();
        
      }, [localStorage.getItem("accessToken"), localStorage.getItem("user_id"),user.phone]);
    

    useEffect(() => {
        if (user.phone === null || user.phone === '') {
          setPhone("e.g. 9898989898");
        } else {
          setPhone(user.phone);
        }
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
          onSubmit={updateUser}
        >
          <div style={{ display: "flex", flexDirection: "column", border:'2px solid #34b38d', borderTopLeftRadius:'10%', padding:'20px' }}>
            <label>
              Email
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
                  width: "200px",
                  background: "white",
                }}
                type="text"
                id="email"
                value={email}
                placeholder={user.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            
            <label>
              Phone
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
                  width: "150px",
                  background: "white",
                }}
                type="text"
                value={phone}
                placeholder={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>

            <button
              style={{ marginTop: "20px" }}
              className="account-btn"
              type="submit"
              onClick={updateUser}
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