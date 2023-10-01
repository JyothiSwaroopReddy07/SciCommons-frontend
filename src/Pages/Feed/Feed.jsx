// src/Feed.js
import React, { useState, useEffect } from 'react';
import { IoHeartOutline, IoHeart, IoChatbubbleOutline, IoBookmarkOutline,IoBookmark, IoPaperPlaneOutline } from 'react-icons/io5';
import NavBar from '../../Components/NavBar/NavBar';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {AiOutlinePlus, AiOutlineMinus} from 'react-icons/ai';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import axios from 'axios';
import ToastMaker from 'toastmaker';
import "toastmaker/dist/toastmaker.css";
import Loader from '../../Components/Loader/Loader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Feed.css';
import Post from '../../Components/Post/Post';
import {useGlobalContext} from '../../Context/StateContext'


const PostModal = ({setIsAccordionOpen}) => {

  const handleBodyChange = (event) => {
    setBody(event);
  }

  const [body, setBody] = useState('');
  const {token} = useGlobalContext();
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    if(token===null) {
      navigate('/login')
    }
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
    
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
    
        },
    };
    try{
        const res = await axios.post("https://scicommons-backend.onrender.com/api/feed/", form_data, config);
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
      <div className="w-full h-full fixed block top-0 left-0 bg-gray-900 bg-opacity-50 z-50 flex flex-row items-center justify-center">
          <div className="p-4 bg-slate-100 w-full md:w-1/2 rounded-md shadow-md max-h-4/5">
          <form onSubmit={(e)=>handleSubmit(e)} encType="multipart/form-data">
                <ReactQuill theme="snow" className="bg-white w-full p-2 mb-4 resize-none border rounded max-h-[40vh] overflow-y-auto" value={body} onChange={handleBodyChange}/>
                <div className="flex justify-between items-center">
                    <input
                    style={{"border": "2px solid #2d3748"}}
                    type="file"
                    accept="image/*"
                    className="mb-4 rounded-xl"
                    name="image"
                    />
                    <div>
                      <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-700 text-white h-8 px-2 rounded"
                      >
                      Post
                      </button>
                      <button
                      onClick={()=>{setIsAccordionOpen(false)}}
                      className="bg-red-500 text-white h-8 px-2 rounded ml-2"
                      >
                      Close
                      </button>
                    </div>
                </div>
            </form>
          </div>
      </div>
    </>
  )
}


const Feed = () => {

  const [posts,setPosts] = useState([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();
  const {token} = useGlobalContext();

  const loadData = async(res) => {
    setPosts(res)
  }

  const getPosts = async() => {
    setLoading(true)
    let config = null;
    if(token===null) {
        config = {
            headers: {
                "Content-Type": "application/json",
            },
        }
    }
    else {
      config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
      }
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
    let config = null;
    if(token===null) {
      config = {
          headers: {
              "Content-Type": "application/json",
          },
      }
    }
    else {
      config = {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
      }
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
        <div className="bg-green-50 min-h-screen"> 
        <div className="p-4 w-full md:w-1/2 mx-auto">
          <div className="flex flex-row justify-end items-center mb-2">
              <button onClick={()=>{setIsAccordionOpen(!isAccordionOpen)}} className="ml-2 text-xl font-semibold text-center bg-gray-500 text-white rounded-md p-1 shadow-xl float-right">Add Post</button>
          </div>
            {isAccordionOpen && <PostModal setIsAccordionOpen={setIsAccordionOpen}/>}
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
        </div>
        }
        {loading && <Loader/>}
    </>
  );
};

export default Feed;
