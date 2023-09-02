import React, { useState, useEffect } from "react";
import {
  IoHeartOutline,
  IoHeart,
  IoChatbubbleOutline,
  IoBookmarkOutline,
  IoBookmark,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import NavBar from "../../Components/NavBar/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import axios from "axios";
import ToastMaker from "toastmaker";
import "toastmaker/dist/toastmaker.css";
import Loader from "../../Components/Loader/Loader";
import {SlUser} from "react-icons/sl";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Bookmarks.css';
import Post from "../../Components/Post/Post";


const BookMarks = () => {
  // Sample data for posts

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadData = async (res) => {
    setPosts(res);
  };

  const removePosts = async (id) => {
    const newPosts = posts.filter((post) => post.id !== id);
    setPosts(newPosts);
    };


  const getPosts = async () => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const res = await axios.get(
        "https://scicommons-backend.onrender.com/api/feed/bookmarks/",
        config
      );
      if (res.data.success.length === 0) {
        await loadData([]);
      } else {
        await loadData(res.data.success);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const res = await axios.get(
        `https://scicommons-backend.onrender.com/api/feed/bookmarks/`,
        config
      );
      if (res.data.success.length === 0) {
        setLoadingMore(false);
        ToastMaker("No more posts to load", 3500, {
          valign: "top",
          styles: {
            backgroundColor: "red",
            fontSize: "20px",
          },
        });
      }
      await loadData([...res.data.success]);
    } catch (err) {
      console.log(err);
    }
    setLoadingMore(false);
  };
  useEffect(() => {
    getPosts();
    const interval = setInterval(() => {
      getPosts();
    }, 600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavBar />
      {!loading && (
        <>
          <div className="flex flex-row justify-center items-center mx-auto px-4 w-full md:w-1/2 mt-2">
            <h1 className="text-3xl text-gray-600 font-semibold">My Bookmarks</h1>
          </div>
          <div className="container mx-auto px-4 w-full md:w-1/2 mt-2">
            {posts.length > 0 &&
              posts.map((post) => <Post key={post.id} post={post} removePosts={removePosts}/>)}
            {posts.length === 0 && (
              <div className="flex flex-col justify-center items-center h-screen">
                <p className="text-2xl font-semibold">
                  No Bookmark posts to show
                </p>
              </div>
            )}
          </div>
        </>
      )}
      {loading && <Loader />}
    </>
  );
};

export default BookMarks;
