
import React, { Component } from 'react';

const About = () => {
    return(
        <section className='section about-section'>
            <h1 style={{fontFamily:'cursive'}} className='section-title'>About Us</h1>
            <p style={{fontFamily:'cursive'}}>
                Hi, this is Siddhartha Shrivastava, a hobbyist developer. 
                I have now built this app on MERN stack. The REST API backend which was initially created using Python FASTAPI framework and Postgresql, is now totally migrated to NodeJS, EXpress and Mongo DB.
                Frontend is still using React JS. That makes is a full stack MERN application.
                
                This app was built using react js for frontend and Python FastAPI framework for backend. It used Postgres SQL as peristent data store. All passwords are still hashed. Profile pictures are stored on AWS S3. It uses AWS Cognito, id pool unauthorized role to access S3 bucket. React App is deployed on S3 fronted by AWS CloudFront, the CDN service by AWS. I have registered the domain on AWS Route 53 which is where it is hosted as well.

                I would like to thank <a href='https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ'><span style={{color:'blue'}}>FreeCodeCamp</span></a> community on YouTube. Their <a href='https://www.youtube.com/watch?v=4UZrsTqkcW4' style={{color:'blue'}}> React JS</a> and <a href='https://www.youtube.com/watch?v=0sOvCWFmrtA' style={{color:'blue'}}>FASTAPI</a>  videos helped me build this App.
            </p>
        </section>
    )
}

export default About
