// src/Feed.js
import React, { useState, useEffect } from 'react';
import { IoHeartOutline, IoHeart, IoChatbubbleOutline, IoBookmarkOutline,IoBookmark, IoPaperPlaneOutline } from 'react-icons/io5';
import NavBar from '../../Components/NavBar/NavBar';
import { Link, useNavigate } from 'react-router-dom';
import {AiOutlinePlus, AiOutlineMinus} from 'react-icons/ai';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import axios from 'axios';
import ToastMaker from 'toastmaker';
import "toastmaker/dist/toastmaker.css";
import Loader from '../../Components/Loader/Loader';
import {SlUser} from "react-icons/sl";


const Post = ({ post }) => {
  const [liked, setLiked] = useState(post.liked);
  const [bookmark, setBookmark] = useState(post.isbookmarked);
  const [likes, setLikes] = useState(post.likes);
  const [bookmarks, setBookmarks] = useState(post.bookmarks);
  const navigate = useNavigate();

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
            const res = await axios.post(`https://scicommons-backend.onrender.com/api/feed/unlike/`,{post: post.id}, config)
            setLiked((prevLiked) => !prevLiked)
            setLikes((prevLikes) => prevLikes - 1)
        } catch(err) {
            console.log(err)
        }
        
    }
    else {
        try{
            const res = await axios.post(`https://scicommons-backend.onrender.com/api/feed/like/`,{post: post.id}, config)
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
            const res = await axios.post(`https://scicommons-backend.onrender.com/api/feed/unbookmark/`,{post: post.id}, config)
            setBookmark((prevBookmark) => !prevBookmark)
            setBookmarks((prevBookmarks) => prevBookmarks - 1)
        } catch(err) {
            console.log(err)
        }


    }
    else {
        try{
            const res = await axios.post(`https://scicommons-backend.onrender.com/api/feed/bookmark/`,{post: post.id}, config)
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
    
    <div className="border rounded-lg p-4 my-4 rounded-xl shadow-xl bg-white">
    <Link to={`/post/${post.id}`}>
      <div className="flex items-center">
        {post.avatar.includes("None")?<SlUser className="w-6 h-6 mr-2"/>:
            <img
            src={post.avatar}
            alt={post.username}
            className="w-10 h-10 rounded-full mr-4"
          />
        }
        <div className="flex flex-col">
            <p className="font-bold" onClick={handleProfile}>{post.username}</p>
            <span className="text-sm text-slate-400">{findTime(post.created_at)}</span>
        </div>
      </div>
    </Link>
      {/* Conditionally render image section */}
      <p className="w-full text-sm md:text-xl my-4">{post.body}</p>
      {!post.image_url.includes("None") && <img src={post.image_url} alt={post.caption} className="w-full my-4" />}
      {/* Display text content */}
      <Link to={`/post/${post.id}`}>
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
          {/* Comment Button */}
          <button onClick={handleComment} className="flex">
            <IoChatbubbleOutline className="text-xl" />
            <span className="text-sm md:ml-2">{post.comments_count}</span>
            
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
      </Link>
    </div>
    </>
  );
};

const Feed = () => {
  // Sample data for posts

  const [posts,setPosts] = useState([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadData = async(res) => {
    setPosts(res)
  }

  const getPosts = async() => {
    setLoading(true)
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }
    try{
        const res = await axios.get("https://scicommons-backend.onrender.com/api/feed/", config)
        if(res.data.success.results.length === 0) {
          await loadData([])
        }else {
          await loadData(res.data.success.results)
        }
        
    } catch(err) {
        console.log(err)
    }
    setLoading(false)

  }

  const loadMore = async() => {
    setLoadingMore(true)
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }
    try{
        const res = await axios.get(`https://scicommons-backend.onrender.com/api/feed/?limit=20&offset=${posts.length}`, config)

        if(res.data.success.results.length === 0){
            setLoadingMore(false)
            ToastMaker("No more posts to load", 3500,{
                valign: 'top',
                  styles : {
                      backgroundColor: 'red',
                      fontSize: '20px',
                  }
                }
            )
        }
        await loadData([...posts, ...res.data.success.results])

    } catch(err) {
        console.log(err)
    }
    setLoadingMore(false)
  }
  useEffect(() => {
    getPosts()
    const interval = setInterval(() => {
        getPosts();
      }, 600000);
  

      return () => clearInterval(interval);
  },[])

  const handleSubmit = async(e) => {
    e.preventDefault();
    const form_data = new FormData(e.target);

    const file = form_data.get('image');
    if (file && file.size > 10485760) {
      ToastMaker('File size is too large. Maximum allowed size is 10 MB', 3500,{
        valign: 'top',
          styles : {
              backgroundColor: 'red',
              fontSize: '20px',
          }
      })
      e.target.reset()
      return;
    } else {
      console.log('File size is ok')
    }
    const token = localStorage.getItem("token");
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
    
        },
    };
    try{
        const res = await axios.post("https://scicommons-backend.onrender.com/api/feed/", form_data, config);
        await getPosts()
        ToastMaker("Post Added Successfully", "success")
        setIsAccordionOpen(false)
        e.target.reset()
    }
    catch(err) {
        console.log(err)
    }


  };


  return (
    <>
    <NavBar />
    { !loading &&
        <> 
        <div className="p-4 w-full md:w-1/2 mx-auto">
        <div className="flex items-center mb-2">
            <Toggle
            checked={isAccordionOpen}
            icons={{
                checked: <AiOutlineMinus className="text-gray-700" />,
                unchecked: <AiOutlinePlus className="text-gray-700" />,
            }}
            onChange={() => setIsAccordionOpen(!isAccordionOpen)}
            />
            <span className="ml-2 text-xl font-semibold text-center float-right">Add Post</span>
        </div>
        {isAccordionOpen && (
            <div className="p-4 bg-slate-100 rounded-md shadow-md">
            <form onSubmit={(e)=>handleSubmit(e)} encType="multipart/form-data">
                <textarea
                className="w-full p-2 mb-4 resize-none border rounded"
                rows="3"
                placeholder="Enter your caption..."
                name="body"
                ></textarea>
                <div className="flex justify-between items-center">
                    <input
                    type="file"
                    accept="image/*"
                    className="mb-4 rounded-xl"
                    name="image"
                    />
                    <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white h-8 px-2 rounded"
                    >
                    Post
                    </button>
                </div>
            </form>
            </div>
        )}
        </div>
        <div className="container mx-auto px-4 w-full md:w-1/2">
          {posts.length > 0 && posts.map((post) => (
              <Post key={post.id} post={post} />
          ))}
          {posts.length>0 && <div className="flex justify-center">
              <button onClick={loadMore} className="bg-green-500 hover:bg-green-700 text-white h-8 px-2 rounded my-4">
                  {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          }
          {
            posts.length === 0 && <div className="flex justify-center h-screen">
              <p className="text-2xl font-semibold">No Posts to show</p>
            </div>
          }

        </div>
        </>
        }
        {loading && <Loader/>}
    </>
  );
};

export default Feed;
