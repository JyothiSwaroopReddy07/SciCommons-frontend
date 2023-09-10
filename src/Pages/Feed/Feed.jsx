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
import Popper from "popper.js";
import {BiDotsHorizontal} from "react-icons/bi";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Feed.css';
import Post from '../../Components/Post/Post';

const Feed = () => {
  // Sample data for posts

  const [posts,setPosts] = useState([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [body, setBody] = useState('');

  const handleBodyChange = (event) => {
    setBody(event);
  }

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
    getPosts();
  },[])

  const handleSubmit = async(e) => {
    e.preventDefault();
    const form_data = new FormData(e.target);
    form_data.append('body', body);
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

  const onDeletePost = async(id) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    await loadData(updatedPosts);
  }
  
  const handleEditChange = async(postId,body,image_url) => {
    const updatedPosts = [...posts];
    const index = updatedPosts.findIndex(post => post.id === postId);
    updatedPosts[index].body = body;
    updatedPosts[index].image_url = image_url;
    await loadData(updatedPosts);
  }


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
                <ReactQuill theme="snow" className="bg-white w-full p-2 mb-4 resize-none border rounded" value={body} onChange={handleBodyChange}/>
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
              <Post key={post.id} post={post} onDeletePost={onDeletePost} handleEditChange={handleEditChange} />
          ))}
          {posts.length>0 && <div className="flex justify-center">
              <button style={{cursor:"pointer"}} onClick={loadMore} className="bg-green-500 hover:bg-green-700 text-white h-8 px-2 rounded my-4">
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
