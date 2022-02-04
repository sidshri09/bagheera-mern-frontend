import React, { useState, useContext, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
import useGeolocation from "react-hook-geolocation";
import moment from "moment";


const AppContext = React.createContext()

const AppProvider = ({ children }) => {

    // Login States
  const [posts, setPosts] = useState([])
  const [s3uri, setS3uri] = useState('');
  const [newUser, setNewUser] = useState(false);
  const [value, setValue] = useState('')
  const geolocation = useGeolocation();
  const [showMap, setShowMap] = useState(false);
  const [userLoading, setUserLoading] = useState(false)
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowings, setShowFollowings] = useState(false)
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({});  
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [confirmedUsername, setConfirmedUsername] = useState("");
  const [password, setPassword] = useState("");
  const [oldPass, setOldPass] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loggedin, setLoggedIn] = useState(false)
  const [signedUp, setSignedUp] = useState(false);
  const logoutUrl = process.env.REACT_APP_NODE_API_BASE_URL+"logout"
  const signinUrl = process.env.REACT_APP_NODE_API_BASE_URL+"login/"
  const tokenRefreshUrl = process.env.REACT_APP_NODE_API_BASE_URL+"token"
  const signupUrl =  process.env.REACT_APP_NODE_API_BASE_URL+"user/add"
  const userUrl =process.env.REACT_APP_NODE_API_BASE_URL+"user/"
  const singleUserUrl = `${userUrl}username/${localStorage.getItem("user_id")}`
  const postUrl = process.env.REACT_APP_NODE_API_BASE_URL+"post/"
  const passwordChangeUrl = process.env.REACT_APP_NODE_API_BASE_URL+"user/changepassword/"
  const followerUrl = "http://localhost:5000/follower/"
  const [userUpdated, setUserUpdated] = useState(false)
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
  const [postId, setPostId] = useState('');
  const [loginProgress, setLoginProgress] = useState(false)



// Sidebar States

const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// Sidebar Handlers

const openSidebar = () => {
  setIsSidebarOpen(true);
};
const closeSidebar = () => {
  setIsSidebarOpen(false);
};

// Post handlers
const fetchAllPosts = async() => {
  setLoading(true);
  const response = await fetch(`${postUrl}?search=`,{
      "method": "GET",
      "headers": {
          "accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      }
  });
  if (response.status === 404){
      showAlert(true, 'danger', 'There are no posts');
  }
  if (response.status === 200){
      const data = await response.json();
      setPosts(data)
      setLoading(false);
  }else{
      showAlert(true, 'danger', 'You\'re logged out');
  }
}

const fetchAPost = async (id) => {
  try {
    const response = await fetch(`${postUrl}${id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const data = await response.json();
    if(response.status === 200){
      setPost(data);
      setLoading(false);
      
      
    }
    if(response.status === 403){
      refreshToken();
    }
    if(response.status === 400){
      console.log("bad request, error fetching a post")
    }
    
  } catch (e) {
    console.error(e);
  }
  
}



// Fetch A User

const fetchUserDetails = async () => {
  const response = await fetch(singleUserUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  if (response.status === 403){
    refreshToken();
  } 
  if (response.status === 200) {
    const user_data = await response.json();
    setUser(user_data);
    setValue(user_data.email);
    setUserLoading(false);
  } else {
    console.log(response.status);
  }
};



const handleValue = (e) => {
  if (e.target.classList.contains("icon")) {
    setShowMap(false);
    setShowFollowers(false);
    setShowFollowings(false);
    const newValue = e.target.dataset.label;
    if (newValue === "name") {
      var mail = user.username;
      setValue(mail);
      return;
    }
    if (newValue === "email") {
      var mail = user.email;
      setValue(mail);
      return;
    }
    if (newValue === "id") {
      setValue(user._id);
      return;
    }
    if (newValue === "CreatedAt") {
      const dt = moment(user.createdAt).format("MMMM D, YYYY");
      const val = `Joined ${dt}`;
      setValue(val);
      return;
    }
    if (newValue === "phone") {
      if (user.phone === null || user.phone === '') {
        setValue("**********");
        return;
      }
      else{
        setValue(user.phone);
      }
    }
    if (newValue === "loc") {
      var str;
      if (
        !geolocation.error &&
        geolocation.latitude !== null &&
        geolocation.longitude !== null
      ) {
        str = ``;
        setShowMap(true);
      } else {
        str = "Location not found. Enable location sharing";
      }
      setValue(str);
      return;
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
// logout handler

const refreshToken = async() =>{
  const response = await fetch(tokenRefreshUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({refreshToken: localStorage.getItem('refreshToken')}),
    }
  );

  const data = await response.json()
  if(response.status === 403){
    console.log("user logged out, re-login")
  }
  if (response.status === 200){
    localStorage.setItem("accessToken", data.accessToken)
  }
}

// Signup and Update Account
const updatePassword = async (e) => {
  e.preventDefault();
  
  if (!(password === "" || oldPass === "")) {
    const update_pwd_response = await fetch(
      passwordChangeUrl,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username:user.username, old_password: oldPass , password: password }),
      }
    );
    if(update_pwd_response.status === 400) {
      showAlert(
        true,
        "danger",
        "Bad Request"
      );
    }
    if(update_pwd_response.status === 401) {
      showAlert(
        true,
        "danger",
        "Wrong old password"
      );
    }
    if (update_pwd_response.status === 200) {
      showAlert(
        true,
        "danger",
        "Password Updated"
      );
    } 
  }else {
    
    showAlert(
        true,
        "danger",
        "Please enter old and new passwords"
      );
    }
};
const updateUser = async (e) => {
  e.preventDefault();
  if ((email !== '')  || (phone !== '')) {
    const response = await fetch(userUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({email, phone}),
    });
    if(response.status === 403){
      refreshToken();
    }
    if(response.status === 400){
      showAlert(
        true,
        "danger",
        "Please enter a valid phone number or email"
      );
    }
    if (response.status === 200) {
      console.log("user details updated")
      showAlert(
        true,
        "danger",
        "User details updated"
      );
    } else {
      showAlert(
        true,
        "danger",
        "Internal Application Error, Please try again after sometime."
      );
    }
  }else {
    showAlert(
      true,
      "danger",
      "Please enter a valid phone number or email"
    );
  }
  
};


const signUp = async() => {
  const response = await fetch(signupUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username: username, password: password, email: email})
    }
    
  );

  if (response.status === 200) {
    const data = response.json()
    console.log(data);
    setConfirmedUsername(data.username);
    setEmail("");
    setPassword("");
    setSignedUp(true);
  }
  if (response.status === 409) {
    showAlert(
      true,
      "danger",
      "email or username already belong to a registered user"
    );
  }
}

const handleLogout = async() => {
  const response = await fetch(logoutUrl,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      },
    }
  );
    if(response.status === 200){ 
      setLoggedIn(false);
      localStorage.clear();
      window.location.reload();
      window.location.replace(process.env.REACT_APP_DOMAIN)
      // window.location.replace('http://localhost:3000')
    }
    if(response.status === 400){
      const data = await response.json()
      console.log(data)
    }
   
  };

const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

//   login handlers

const handleLogin = async (e) => {
    e.preventDefault();
    setLoginProgress(true);
    const response = await fetch(signinUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username, password}),
      }
    );
    const data = await response.json();
    if (response.status === 200){
      setLoginProgress(false)
      setPassword("");
      setUsername("");
      setLoggedIn(true);
      localStorage.setItem('accessToken',data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      console.log(jwtDecode(data.accessToken))
      localStorage.setItem("user_id", jwtDecode(data.accessToken).username)
      localStorage.setItem("loggedin",true)
      window.location.reload()
    }else{ 
        showAlert(true, 'danger', 'invalid credentials');
      }
  };

    return(<AppContext.Provider
    value={{
      alert,
      isSidebarOpen,
      openSidebar,
      closeSidebar,
      post,
        username,
        password,
        email,
        phone,
        handleLogin,
        setPassword,
        setUsername,
        setEmail,
        setPhone,
        loggedin,
        handleLogout,
        refreshToken,
        signUp,
        signedUp,
        setSignedUp,
        confirmedUsername,
        updatePassword,
        updateUser,
        oldPass,
        setOldPass,
        user,
        fetchUserDetails,
        fetchAPost,
        showAlert,
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
        fetchAllPosts,
        handleValue,
        openFollowersPage,
        openFollowingsPage,
        geolocation,
        posts,
        postId,
        setPostId,
        setPost,
        refreshToken,
        loginProgress
        }}  
        >
          {children}
        </AppContext.Provider>)
}
export const useGlobalContext = () => {
    return useContext(AppContext)
  }

export { AppContext, AppProvider }