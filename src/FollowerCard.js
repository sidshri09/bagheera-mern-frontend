import React from 'react'

const Follower = ({ id, email, username, phone, createdAt, profile_pic }) => {
  const openProfile=()=>{

    window.location.replace(`${process.env.REACT_APP_DOMAIN}profile/${username}`)
    // window.location.replace(`http://localhost:3000/profile/${username}`)

  }
  return (
    <article className='card' onClick={openProfile}>
      <img src={profile_pic} alt={email} />
      <h6>{username}</h6>
      {/* <a href={html_url} className='btn'>
        view profile
      </a> */}
    </article>
  )
}

export default Follower
