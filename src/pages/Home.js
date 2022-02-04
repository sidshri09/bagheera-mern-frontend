import React from 'react';
import Signin from './Signin';
import Posts from '../Posts'
import { useGlobalContext } from '../context';


const Home = () => {
    const {loggedin} = useGlobalContext();
    return(
        <main>
            {(loggedin || localStorage.getItem("loggedin"))?<Posts/>:<Signin />}
        </main>
    )
}

export default Home