// src/SinglePost.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import {
  IoHeartOutline,
  IoHeart,
  IoBookmarkOutline,
  IoBookmark,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import { AiOutlineSend,AiFillLike,AiOutlineLike } from "react-icons/ai";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";

const Comment = ({comment}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [liked, setLiked] = useState(comment.commentliked);
  const [likes, setLikes] = useState(comment.commentlikes);
  const [loading, setLoading] = useState(false);

  const handleProfile = (e) => {
    e.preventDefault();
    navigate(`/profile/${comment.username}`);
  };

  const handleLike = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    if (liked) {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/feedcomment/unlike/`,
          { comment: comment.id},
          config
        );
        setLiked((prevLiked) => !prevLiked);
        setLikes((prevLikes) => prevLikes - 1);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/feedcomment/like/`,
          { comment: comment.id},
          config
        );
        setLiked((prevLiked) => !prevLiked);
        setLikes((prevLikes) => prevLikes + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const findTime = (date) => {
    const time = new Date(date);
    const now = new Date();
    const diff = now - time;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) {
      return `${years} years ago`;
    } else if (months > 0) {
      return `${months} months ago`;
    } else if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else if (seconds > 0) {
      return `${seconds} seconds ago`;
    } else {
      return `Just now`;
    }
  };


  return (
    <>
      <div key={comment.id} className="border rounded-lg p-2 my-2 bg-white">
            <div className="flex justify-between mb-2">
              <div className="flex flex-row items-center">
              <img
                src={comment.commentavatar}
                alt={comment.username}
                className="w-6 h-6 rounded-full mr-2"
              />
                <p className="font-medium text-sm" onClick={handleProfile}>
                  {comment.username}
                </p>
              </div>
              <span className="text-xs">{findTime(comment.created_at)}</span>
            </div>
            <p className="w-full text-sm mb-2 pl-8">{comment.comment}</p>
            <div className="w-full ml-10">
              <div className="flex flex-row items-center">
                <button onClick={handleLike} className="flex">
                  {liked ? (
                    <AiFillLike className="text-md" />
                  ) : (
                    <AiOutlineLike className="text-md" />
                  )}
                </button>
                <span className="text-sm">{likes}</span>
              </div>
            </div>
          </div>
    </>
  )
}


const SinglePost = () => {
  const [liked, setLiked] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [likes, setLikes] = useState(false);
  const [bookmarks, setBookmarks] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const { postId } = useParams();
  const loadData = async (res) => {
    setLiked(res.liked);
    setBookmark(res.isbookmarked);
    setLikes(res.likes);
    setBookmarks(res.bookmarks);
    setPost(res);
    setComments(res.comments);
  };

  const fetchPost = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const res = await axios.get(
        `https://scicommons-backend.onrender.com/api/feed/${postId}/`,
        config
      );
      console.log(res.data.success);
      await loadData(res.data.success);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPost();
    setLoading(false);
  }, []);

  const handleLike = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    if (liked) {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/feed/unlike/`,
          { post: postId },
          config
        );
        setLiked((prevLiked) => !prevLiked);
        setLikes((prevLikes) => prevLikes - 1);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/feed/like/`,
          { post: postId },
          config
        );
        setLiked((prevLiked) => !prevLiked);
        setLikes((prevLikes) => prevLikes + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleComment = async(e) => {
    e.preventDefault();
    const comment = document.getElementsByName("comment")[0].value;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try{
      const res = await axios.post(`https://scicommons-backend.onrender.com/api/feedcomment/`, {post: postId, comment: comment}, config)
      console.log(res.data.success)
      fetchPost();
    } catch(err){
      console.log(err)
    }
  };

  const handleBookmark = async (e) => {
    // Implement bookmark logic here
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    if (bookmark) {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/feed/unbookmark/`,
          { post: postId },
          config
        );
        setBookmark((prevBookmark) => !prevBookmark);
        setBookmarks((prevBookmarks) => prevBookmarks - 1);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/feed/bookmark/`,
          { post: postId },
          config
        );
        setBookmark((prevBookmark) => !prevBookmark);
        setBookmarks((prevBookmarks) => prevBookmarks + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleProfile = (e) => {
    e.preventDefault();
    navigate(`/profile/${post.username}`);
  };

  const handleShare = () => {
    // Implement share logic here
    console.log("Share post:", post);
  };

  const findTime = (date) => {
    const time = new Date(date);
    const now = new Date();
    const diff = now - time;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) {
      return `${years} years ago`;
    } else if (months > 0) {
      return `${months} months ago`;
    } else if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else if (seconds > 0) {
      return `${seconds} seconds ago`;
    } else {
      return `Just now`;
    }
  };

  return (
    <>
      <NavBar />
      {loading && <Loader />}
      {!loading && post !== null && (
        <>
          <div className="border shadow-2xl p-4 mt-2 bg-white w-full md:w-1/2 mx-auto">
            <div className="flex items-center">
              <img
                src={post.avatar}
                alt={post.username}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex flex-col">
                <p className="font-bold" onClick={handleProfile}>
                  {post.username}
                </p>
                <span className="text-sm">{findTime(post.created_at)}</span>
              </div>
            </div>
            <p className="w-full text-md md:text-xl my-4">{post.body}</p>
            {!post.image_url.includes("None") && (
              <img
                src={post.image_url}
                alt={post.caption}
                className="w-full my-4"
              />
            )}
            <div className="w-full">
              <div className="flex flex-row justify-between">
                <button onClick={handleLike} className="flex">
                  {liked ? (
                    <IoHeart className="text-xl text-red-500" />
                  ) : (
                    <IoHeartOutline className="text-xl" />
                  )}
                  <span className="text-sm md:ml-2">{likes}</span>
                </button>
                <button onClick={handleBookmark} className="flex">
                  {bookmark ? (
                    <IoBookmark className="text-xl text-gray-800" />
                  ) : (
                    <IoBookmarkOutline className="text-xl" />
                  )}
                  <span className="text-sm md:ml-2">{bookmarks}</span>
                </button>
                <button onClick={handleShare}>
                  <IoPaperPlaneOutline className="text-xl" />
                </button>
              </div>
            </div>
          </div>
          <div className="border p-4 shadow-2xl bg-white w-full md:w-1/2 mx-auto">
            {/* <div className="flex flex-row items-center justify-between mb-2">
              <img
                src={user.profile_pic_url}
                alt={user.username}
                className="w-10 h-10 rounded-full mr-4"
              />
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full border rounded-lg p-2 mr-2 rounded-xl"
                name="comment"
              />
              <button
                onClick={handleComment}
                className="bg-green-400 rounded-lg p-2"
              >
                <AiOutlineSend className="text-xl" />
              </button>
            </div> */}
            <div className="text-2xl font-semibold">Comments</div>
            {
              comments.length>0 && comments.map((comment) => (
                <Comment comment={comment} />
              ))
            }
          </div>
        </>
      )}
    </>
  );
};

export default SinglePost;
