// src/Profile.js
import React, {useState} from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {SlUser} from "react-icons/sl";

const Profile = () => {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  const handleFollow = async(e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/follow`,config)
      }
      catch(err){
        console.log(err)
      }
  }

  return (
    <>
        <NavBar/>
        <div className="container mx-auto px-4 w-full md:w-1/2">
        <div className="flex items-center mt-8">
            {user.profile_pic_url.includes("None")?<SlUser className="w-8 h-8 text-black-800"/>: 
              <img
              src={user.profile_pic_url}
              alt={user.username}
              className="w-24 h-24 rounded-full mr-4"
              />
            }
            <div>
              <div className="flex flex-row items-center">
                <h2 className="text-xl text-green-500 font-bold mr-5">{user.username}</h2>
                <span className="rounded-lg bg-green-200 px-2" style={{cursor:"pointer"}} onClick={handleFollow}>Follow</span>
              </div>
              <p>{user.fullName}</p>
              <p className="text-gray-600">{user.bio}</p>
              <div className="mt-4">
                  <span className="mr-3">
                  <strong>{user.posts}</strong> <span className="text-xs">posts</span>
                  </span>
                  <span className="mr-3">
                  <strong>{user.followers}</strong> <span className="text-xs">followers</span>
                  </span>
                  <span>
                  <strong>{user.following}</strong> <span className="text-xs">following</span>
                  </span>
              </div>
            </div>
        </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
                {/* {user.posts.map((post) => (
                <Link to={`/post/${post.id}`} key={post.id}>
                    <img src={post.imageUrl} alt={post.caption} className="w-full rounded" />
                </Link>
                ))} */}
            </div>
        </div>
    </>
  );
};

export default Profile;
