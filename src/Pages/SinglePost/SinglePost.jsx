// src/SinglePost.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import NavBar from '../../Components/NavBar/NavBar';
import {useNavigate} from 'react-router-dom'
import { IoHeartOutline, IoHeart, IoBookmarkOutline,IoBookmark, IoPaperPlaneOutline } from 'react-icons/io5';
import axios from 'axios';

const SinglePost = () => {
  const [liked, setLiked] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [likes, setLikes] = useState(false);
  const [bookmarks, setBookmarks] = useState(false);
  const [post,setPost] = useState(null)
  const navigate = useNavigate();


  const {postId} = useParams()
  useEffect(()=>{
    const fetchPost = async() => {
      const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
      try{
        const res = await axios.get(`https://scicommons-backend.onrender.com/api/feed/${postId}/`, config)
        console.log(res.data.success)
        setLiked(res.data.success.liked)
        setBookmark(res.data.success.isbookmarked)
        setLikes(res.data.success.likes)
        setBookmarks(res.data.success.bookmarks)
        setPost(res.data.success)
      } catch(err) {
        console.log(err)
      }
    }

    fetchPost()
  },[])

  const handleLike = async(e) => {
    e.preventDefault()
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }
    if(liked) {
        try{
            const res = await axios.post(`https://scicommons-backend.onrender.com/api/feed/unlike/`,{post: postId}, config)
            setLiked((prevLiked) => !prevLiked)
            setLikes((prevLikes) => prevLikes - 1)
        } catch(err) {
            console.log(err)
        }
        
    }
    else {
        try{
            const res = await axios.post(`https://scicommons-backend.onrender.com/api/feed/like/`,{post: postId}, config)
            setLiked((prevLiked) => !prevLiked)
            setLikes((prevLikes) => prevLikes + 1)
        } catch(err) {
            console.log(err)
        }

    }
    
  };

  const handleComment = (e) => {
    e.preventDefault()
    navigate(`/post/${post.id}`)
  };


  const handleBookmark = async(e) => {
    // Implement bookmark logic here
    e.preventDefault()
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }
    if(bookmark) {
        try{
            const res = await axios.post(`https://scicommons-backend.onrender.com/api/feed/unbookmark/`,{post: postId}, config)
            setBookmark((prevBookmark) => !prevBookmark)
            setBookmarks((prevBookmarks) => prevBookmarks - 1)
        } catch(err) {
            console.log(err)
        }


    }
    else {
        try{
            const res = await axios.post(`https://scicommons-backend.onrender.com/api/feed/bookmark/`,{post: postId}, config)
            setBookmark((prevBookmark) => !prevBookmark)
            setBookmarks((prevBookmarks) => prevBookmarks + 1)
        } catch(err) {
            console.log(err)
        }

    }
    
  };



  const handleProfile = (e) => {
    e.preventDefault()
    navigate(`/profile/${post.username}`)
  }

  const handleShare = () => {
    // Implement share logic here
    console.log('Share post:', post);
  };

    const findTime = (date) => {
        const time = new Date(date)
        const now = new Date()
        const diff = now - time
        const seconds = Math.floor(diff/1000)
        const minutes = Math.floor(seconds/60)
        const hours = Math.floor(minutes/60)
        const days = Math.floor(hours/24)
        const months = Math.floor(days/30)
        const years = Math.floor(months/12)
        if(years > 0)
        {
            return `${years} years ago`
        }
        else if(months > 0)
        {
            return `${months} months ago`
        }
        else if(days > 0)
        {
            return `${days} days ago`
        }
        else if(hours > 0)
        {
            return `${hours} hours ago`
        }
        else if(minutes > 0)
        {
            return `${minutes} minutes ago`
        }
        else if(seconds > 0)
        {
            return `${seconds} seconds ago`
        }
        else{
            return `Just now`
        }
    }


  return (
    <>
    <NavBar/>
    <div className="border rounded-lg p-4 my-4 rounded-xl shadow-xl bg-white">
      <div className="flex items-center">
        <img
          src={post.avatar}
          alt={post.username}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div className="flex flex-col">
            <p className="font-bold" onClick={handleProfile}>{post.username}</p>
            <span className="text-sm">{findTime(post.created_at)}</span>
        </div>
      </div>

      {/* Conditionally render image section */}
      <p className="w-full text-sm md:text-xl my-4">{post.body}</p>
      {!post.image_url.includes("None") && <img src={post.image_url} alt={post.caption} className="w-full my-4" />}
      {/* Display text content */}
      <div className="w-full">
        <div className="flex flex-row justify-between">
          {/* Like Button */}
          <button onClick={handleLike} className="flex">
            {(liked) ? (
              <IoHeart className="text-xl text-red-500" />
            ) : (
              <IoHeartOutline className="text-xl" />
            )}
            <span className="text-sm md:ml-2">{likes}</span>
          </button>
          {/* Bookmark Button */}
          <button onClick={handleBookmark} className="flex">
            {
                (bookmark) ? (
                    <IoBookmark className="text-xl text-gray-800" />
                ) : (
                    <IoBookmarkOutline className="text-xl" />
                )
            }
            <span className="text-sm md:ml-2">{bookmarks}</span>
          </button>
          {/* Share Button */}
          <button onClick={handleShare}>
            <IoPaperPlaneOutline className="text-xl" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default SinglePost;